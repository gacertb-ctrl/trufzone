"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = exports.addToInMemoryBlacklist = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var User_1 = require("../models/User");
var redis_1 = require("../config/redis");
// In-memory blacklist for immediate cross-request revocation even if Redis has latency or is offline
var inMemoryRevokedTokens = new Set();
var addToInMemoryBlacklist = function (token) {
    if (token) {
        inMemoryRevokedTokens.add(token);
    }
};
exports.addToInMemoryBlacklist = addToInMemoryBlacklist;
var requireAuth = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, isBlacklisted, redisErr_1, secret, decoded, user, tokenIssuedAtMs, lastLogoutMs, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'Unauthorized - No token provided' })];
                }
                token = authHeader.split(' ')[1];
                if (!token || token.trim() === '') {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'Unauthorized - Empty token' })];
                }
                // 1. Fast in-memory check
                if (inMemoryRevokedTokens.has(token)) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'Unauthorized - Token has been revoked / logged out' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, redis_1.default.get("blacklist:token:".concat(token))];
            case 2:
                isBlacklisted = _a.sent();
                if (isBlacklisted) {
                    inMemoryRevokedTokens.add(token);
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'Unauthorized - Token has been revoked / logged out' })];
                }
                return [3 /*break*/, 4];
            case 3:
                redisErr_1 = _a.sent();
                console.warn('Redis blacklist check error:', redisErr_1);
                return [3 /*break*/, 4];
            case 4:
                secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
                decoded = jsonwebtoken_1.default.verify(token, secret);
                return [4 /*yield*/, User_1.default.findById(decoded.id)];
            case 5:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'Unauthorized - User not found or inactive' })];
                }
                // 3. Database session invalidation check via lastLogoutAt
                if (user.lastLogoutAt && decoded.iat) {
                    tokenIssuedAtMs = decoded.iat * 1000;
                    lastLogoutMs = new Date(user.lastLogoutAt).getTime();
                    // Allow 1 second clock leeway
                    if (tokenIssuedAtMs < (lastLogoutMs - 1000)) {
                        inMemoryRevokedTokens.add(token);
                        return [2 /*return*/, res.status(401).json({ success: false, message: 'Unauthorized - Session has been terminated / logged out' })];
                    }
                }
                // 4. Token version invalidation check
                if (decoded.tokenVersion !== undefined && user.tokenVersion !== undefined) {
                    if (decoded.tokenVersion < user.tokenVersion) {
                        inMemoryRevokedTokens.add(token);
                        return [2 /*return*/, res.status(401).json({ success: false, message: 'Unauthorized - Session token expired by logout' })];
                    }
                }
                req.user = user;
                req.token = token;
                next();
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                if (error_1.name === 'TokenExpiredError') {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'Unauthorized - Token expired' })];
                }
                return [2 /*return*/, res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.requireAuth = requireAuth;
var requireRole = function (roles) {
    return function (req, res, next) {
        var _a;
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized - Authentication required' });
        }
        var userRole = (_a = req.user.role) === null || _a === void 0 ? void 0 : _a.toUpperCase();
        // Admins always have access
        if (userRole === 'ADMIN') {
            return next();
        }
        var normalizedRoles = roles.map(function (r) { return r.toUpperCase(); });
        // Treat TURF_OWNER and TURF_ADMIN interchangeably
        var isOwnerRole = userRole === 'TURF_OWNER' || userRole === 'TURF_ADMIN';
        var acceptsOwner = normalizedRoles.includes('TURF_OWNER') || normalizedRoles.includes('TURF_ADMIN');
        if (normalizedRoles.includes(userRole) || (isOwnerRole && acceptsOwner)) {
            return next();
        }
        return res.status(403).json({
            success: false,
            message: "Forbidden - Requires role in [".concat(roles.join(', '), "]. Current role: ").concat(userRole)
        });
    };
};
exports.requireRole = requireRole;
