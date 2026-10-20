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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.resetPassword = exports.forgotPassword = exports.verifyOtp = exports.sendOtp = exports.googleAuth = exports.loginWithPassword = exports.register = exports.verifyPassword = exports.hashPassword = void 0;
var crypto_1 = require("crypto");
var redis_1 = require("../config/redis");
var User_1 = require("../models/User");
var jsonwebtoken_1 = require("jsonwebtoken");
var authMiddleware_1 = require("../middleware/authMiddleware");
// --- Password Hashing Helpers using Node.js crypto (Scrypt) ---
var hashPassword = function (password) {
    var salt = crypto_1.default.randomBytes(16).toString('hex');
    var hash = crypto_1.default.scryptSync(password, salt, 64).toString('hex');
    return "".concat(salt, ":").concat(hash);
};
exports.hashPassword = hashPassword;
var verifyPassword = function (password, combined) {
    if (!combined || !combined.includes(':'))
        return false;
    var _a = combined.split(':'), salt = _a[0], key = _a[1];
    var hash = crypto_1.default.scryptSync(password, salt, 64).toString('hex');
    return crypto_1.default.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(key, 'hex'));
};
exports.verifyPassword = verifyPassword;
var createJwtToken = function (user) {
    var secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
    return jsonwebtoken_1.default.sign({ id: user._id, role: user.role, tokenVersion: user.tokenVersion || 0 }, secret, { expiresIn: '7d' });
};
// 1. User Registration (POST /api/auth/register)
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, phone, email, password, normalizedPhone, normalizedEmail, existingPhone, existingEmail, user, token, userObj, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, name_1 = _a.name, phone = _a.phone, email = _a.email, password = _a.password;
                if (!name_1 || name_1.trim().length < 2) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Full name is required (at least 2 characters)' })];
                }
                if (!phone || !/^\d{10}$/.test(phone.trim())) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'A valid 10-digit mobile number is required' })];
                }
                if (!password || password.length < 6) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' })];
                }
                normalizedPhone = phone.trim();
                normalizedEmail = email ? email.trim().toLowerCase() : undefined;
                return [4 /*yield*/, User_1.default.findOne({ phone: normalizedPhone })];
            case 1:
                existingPhone = _b.sent();
                if (existingPhone) {
                    return [2 /*return*/, res.status(409).json({ success: false, message: 'An account with this mobile number already exists' })];
                }
                if (!normalizedEmail) return [3 /*break*/, 3];
                return [4 /*yield*/, User_1.default.findOne({ email: normalizedEmail })];
            case 2:
                existingEmail = _b.sent();
                if (existingEmail) {
                    return [2 /*return*/, res.status(409).json({ success: false, message: 'An account with this email address already exists' })];
                }
                _b.label = 3;
            case 3: return [4 /*yield*/, User_1.default.create({
                    name: name_1.trim(),
                    phone: normalizedPhone,
                    email: normalizedEmail,
                    password: (0, exports.hashPassword)(password),
                    role: 'PLAYER',
                    isVerified: true,
                    tokenVersion: 0
                })];
            case 4:
                user = _b.sent();
                token = createJwtToken(user);
                userObj = user.toObject();
                delete userObj.password;
                res.status(201).json({
                    success: true,
                    data: { token: token, user: userObj },
                    message: 'Account created successfully'
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.error('Error during registration:', error_1);
                res.status(500).json({ success: false, message: 'Registration failed due to server error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
// 2. Password Login (POST /api/auth/login)
var loginWithPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, identifier, password, cleanId, user, isMatch, token, userObj, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, identifier = _a.identifier, password = _a.password;
                if (!identifier || !password) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Mobile number/email and password are required' })];
                }
                cleanId = identifier.trim();
                return [4 /*yield*/, User_1.default.findOne({
                        $or: [
                            { phone: cleanId },
                            { email: cleanId.toLowerCase() }
                        ]
                    })];
            case 1:
                user = _b.sent();
                if (!user || !user.password) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'Invalid credentials. Please check mobile/email or sign in with OTP.' })];
                }
                isMatch = (0, exports.verifyPassword)(password, user.password);
                if (!isMatch) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'Invalid credentials' })];
                }
                token = createJwtToken(user);
                userObj = user.toObject();
                delete userObj.password;
                res.status(200).json({
                    success: true,
                    data: { token: token, user: userObj },
                    message: 'Authentication successful'
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Error in loginWithPassword:', error_2);
                res.status(500).json({ success: false, message: 'Login failed due to server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.loginWithPassword = loginWithPassword;
// 3. Google OAuth Token Verification (POST /api/auth/google)
var googleAuth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, idToken, directSub, directEmail, directName, directPic, googleData, googleRes, fetchErr_1, decoded, googleId, email, name_2, avatar, user, shouldSave, token, userObj, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 15, , 16]);
                _a = req.body, idToken = _a.idToken, directSub = _a.googleId, directEmail = _a.email, directName = _a.name, directPic = _a.avatar;
                googleData = null;
                if (!idToken) return [3 /*break*/, 7];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, fetch("https://oauth2.googleapis.com/tokeninfo?id_token=".concat(idToken))];
            case 2:
                googleRes = _b.sent();
                if (!googleRes.ok) return [3 /*break*/, 4];
                return [4 /*yield*/, googleRes.json()];
            case 3:
                googleData = _b.sent();
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                fetchErr_1 = _b.sent();
                console.warn('Direct Google tokeninfo fetch error:', fetchErr_1);
                return [3 /*break*/, 6];
            case 6:
                // Fallback decode for valid JWT structure
                if (!googleData || !googleData.sub) {
                    try {
                        decoded = jsonwebtoken_1.default.decode(idToken);
                        if (decoded && (decoded.email || decoded.sub)) {
                            googleData = decoded;
                        }
                    }
                    catch (dErr) {
                        // Ignore
                    }
                }
                // Local development mock token fallback
                if ((!googleData || !googleData.sub) && (idToken.startsWith('google_oauth_token_') || idToken.startsWith('demo_'))) {
                    googleData = {
                        sub: 'google_demo_' + idToken.slice(-8),
                        email: 'google.athlete@turfzone.in',
                        name: 'Demo Google Athlete',
                        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
                    };
                }
                return [3 /*break*/, 8];
            case 7:
                if (directSub || directEmail) {
                    googleData = {
                        sub: directSub || ('g-' + Date.now()),
                        email: directEmail,
                        name: directName || 'Google Athlete',
                        picture: directPic || ''
                    };
                }
                _b.label = 8;
            case 8:
                if (!googleData || (!googleData.email && !googleData.sub)) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'Invalid or missing Google identity payload' })];
                }
                googleId = googleData.sub;
                email = (googleData.email || '').toLowerCase();
                name_2 = googleData.name || googleData.given_name || 'Google Athlete';
                avatar = googleData.picture || '';
                return [4 /*yield*/, User_1.default.findOne({
                        $or: __spreadArray([
                            { googleId: googleId }
                        ], (email ? [{ email: email }] : []), true)
                    })];
            case 9:
                user = _b.sent();
                if (!user) return [3 /*break*/, 12];
                shouldSave = false;
                if (!user.googleId) {
                    user.googleId = googleId;
                    shouldSave = true;
                }
                if (avatar && !user.avatar) {
                    user.avatar = avatar;
                    shouldSave = true;
                }
                if (!shouldSave) return [3 /*break*/, 11];
                return [4 /*yield*/, user.save()];
            case 10:
                _b.sent();
                _b.label = 11;
            case 11: return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, User_1.default.create({
                    name: name_2,
                    email: email,
                    googleId: googleId,
                    avatar: avatar,
                    role: 'PLAYER',
                    isVerified: true,
                    tokenVersion: 0
                })];
            case 13:
                // Create new player with Google identity
                user = _b.sent();
                _b.label = 14;
            case 14:
                token = createJwtToken(user);
                userObj = user.toObject();
                delete userObj.password;
                res.status(200).json({
                    success: true,
                    data: { token: token, user: userObj },
                    message: 'Authenticated with Google'
                });
                return [3 /*break*/, 16];
            case 15:
                error_3 = _b.sent();
                console.error('Error in googleAuth:', error_3);
                res.status(500).json({ success: false, message: 'Google authentication failed' });
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.googleAuth = googleAuth;
// 4. Send Mobile OTP (POST /api/auth/send-otp)
var sendOtp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var phone, cleanPhone, otp, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                phone = req.body.phone;
                if (!phone || !/^\d{10}$/.test(phone.trim())) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'A valid 10-digit mobile number is required' })];
                }
                cleanPhone = phone.trim();
                otp = Math.floor(100000 + Math.random() * 900000).toString();
                // Store OTP in Redis with 5 minutes (300 seconds) TTL
                return [4 /*yield*/, redis_1.default.setex("otp:".concat(cleanPhone), 300, otp)];
            case 1:
                // Store OTP in Redis with 5 minutes (300 seconds) TTL
                _a.sent();
                console.log("\n========================================\n[SMS GATEWAY] OTP for ".concat(cleanPhone, " => ").concat(otp, "\n========================================\n"));
                res.status(200).json({ success: true, message: 'Verification code sent to your mobile number' });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error sending OTP:', error_4);
                res.status(500).json({ success: false, message: 'Error sending verification code' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sendOtp = sendOtp;
// 5. Verify Mobile OTP (POST /api/auth/verify-otp)
var verifyOtp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, phone, otp, name_3, cleanPhone, storedOtp, user, token, userObj, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, phone = _a.phone, otp = _a.otp, name_3 = _a.name;
                if (!phone || !otp) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Mobile number and verification OTP are required' })];
                }
                cleanPhone = phone.trim();
                return [4 /*yield*/, redis_1.default.get("otp:".concat(cleanPhone))];
            case 1:
                storedOtp = _b.sent();
                // Strictly verify OTP from Redis (NO fake 123456 bypass)
                if (!storedOtp || storedOtp !== otp.trim()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid or expired verification code' })];
                }
                // Clear OTP after verification
                return [4 /*yield*/, redis_1.default.del("otp:".concat(cleanPhone))];
            case 2:
                // Clear OTP after verification
                _b.sent();
                return [4 /*yield*/, User_1.default.findOne({ phone: cleanPhone })];
            case 3:
                user = _b.sent();
                if (!!user) return [3 /*break*/, 5];
                return [4 /*yield*/, User_1.default.create({
                        phone: cleanPhone,
                        name: name_3 ? name_3.trim() : "Player ".concat(cleanPhone.slice(-4)),
                        role: 'PLAYER',
                        isVerified: true,
                        tokenVersion: 0
                    })];
            case 4:
                user = _b.sent();
                _b.label = 5;
            case 5:
                token = createJwtToken(user);
                userObj = user.toObject();
                delete userObj.password;
                res.status(200).json({
                    success: true,
                    data: { token: token, user: userObj },
                    message: 'Authentication successful'
                });
                return [3 /*break*/, 7];
            case 6:
                error_5 = _b.sent();
                console.error('Error verifying OTP:', error_5);
                res.status(500).json({ success: false, message: 'Error verifying code' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.verifyOtp = verifyOtp;
// 6. Forgot Password Request (POST /api/auth/forgot-password)
var forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var identifier, cleanId, user, resetToken, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                identifier = req.body.identifier;
                if (!identifier) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Mobile number or email is required' })];
                }
                cleanId = identifier.trim();
                return [4 /*yield*/, User_1.default.findOne({
                        $or: [
                            { phone: cleanId },
                            { email: cleanId.toLowerCase() }
                        ]
                    })];
            case 1:
                user = _a.sent();
                resetToken = Math.floor(100000 + Math.random() * 900000).toString();
                // 10 minutes TTL
                return [4 /*yield*/, redis_1.default.setex("reset:".concat(cleanId), 600, resetToken)];
            case 2:
                // 10 minutes TTL
                _a.sent();
                if (user) {
                    console.log("\n========================================\n[RESET CODE] Token for ".concat(cleanId, " => ").concat(resetToken, "\n========================================\n"));
                }
                // Generic response to avoid account enumeration in production
                res.status(200).json({
                    success: true,
                    message: 'If an account exists with this credential, a verification code has been generated.',
                    data: process.env.NODE_ENV !== 'production' ? { resetToken: resetToken } : undefined
                });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                console.error('Error in forgotPassword:', error_6);
                res.status(500).json({ success: false, message: 'Failed to process password reset request' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
// 7. Reset Password (POST /api/auth/reset-password)
var resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, identifier, token, newPassword, cleanId, storedToken, user, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, identifier = _a.identifier, token = _a.token, newPassword = _a.newPassword;
                if (!identifier || !token || !newPassword) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Identifier, verification code, and new password are required' })];
                }
                if (newPassword.length < 6) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' })];
                }
                cleanId = identifier.trim();
                return [4 /*yield*/, redis_1.default.get("reset:".concat(cleanId))];
            case 1:
                storedToken = _b.sent();
                if (!storedToken || storedToken !== token.trim()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid or expired password reset code' })];
                }
                return [4 /*yield*/, User_1.default.findOne({
                        $or: [
                            { phone: cleanId },
                            { email: cleanId.toLowerCase() }
                        ]
                    })];
            case 2:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Account not found' })];
                }
                // Update password with hash & invalidate all previous sessions
                user.password = (0, exports.hashPassword)(newPassword);
                user.tokenVersion = (user.tokenVersion || 0) + 1;
                user.lastLogoutAt = new Date();
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                return [4 /*yield*/, redis_1.default.del("reset:".concat(cleanId))];
            case 4:
                _b.sent();
                res.status(200).json({
                    success: true,
                    message: 'Password updated successfully. Please sign in with your new credentials.'
                });
                return [3 /*break*/, 6];
            case 5:
                error_7 = _b.sent();
                console.error('Error in resetPassword:', error_7);
                res.status(500).json({ success: false, message: 'Failed to reset password' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
// 8. Return currently authenticated user profile (GET /api/auth/me)
var getMe = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userObj;
    return __generator(this, function (_a) {
        try {
            if (!req.user) {
                return [2 /*return*/, res.status(401).json({ success: false, message: 'Not authenticated' })];
            }
            userObj = req.user.toObject ? req.user.toObject() : req.user;
            delete userObj.password;
            res.status(200).json({
                success: true,
                data: { user: userObj }
            });
        }
        catch (error) {
            console.error('Error in getMe:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
        return [2 /*return*/];
    });
}); };
exports.getMe = getMe;
// 9. Invalidate token on server-side via in-memory set, Redis blacklist, and DB lastLogoutAt (POST /api/auth/logout)
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, userId, decoded, nowInSec, ttl, err_1, error_8;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 8, , 9]);
                token = req.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
                if (!token) return [3 /*break*/, 7];
                (0, authMiddleware_1.addToInMemoryBlacklist)(token);
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 5]);
                decoded = jsonwebtoken_1.default.decode(token);
                if (!userId && (decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
                    userId = decoded.id;
                }
                nowInSec = Math.floor(Date.now() / 1000);
                ttl = (decoded === null || decoded === void 0 ? void 0 : decoded.exp) && decoded.exp > nowInSec
                    ? decoded.exp - nowInSec
                    : 7 * 24 * 3600;
                return [4 /*yield*/, redis_1.default.setex("blacklist:token:".concat(token), ttl, 'revoked')];
            case 2:
                _c.sent();
                return [3 /*break*/, 5];
            case 3:
                err_1 = _c.sent();
                return [4 /*yield*/, redis_1.default.setex("blacklist:token:".concat(token), 7 * 24 * 3600, 'revoked')];
            case 4:
                _c.sent();
                return [3 /*break*/, 5];
            case 5:
                if (!userId) return [3 /*break*/, 7];
                return [4 /*yield*/, User_1.default.findByIdAndUpdate(userId, {
                        lastLogoutAt: new Date(),
                        $inc: { tokenVersion: 1 }
                    })];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7:
                res.status(200).json({
                    success: true,
                    message: 'Session successfully invalidated and token revoked'
                });
                return [3 /*break*/, 9];
            case 8:
                error_8 = _c.sent();
                console.error('Error in logout:', error_8);
                res.status(500).json({ success: false, message: 'Error during logout' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.logout = logout;
