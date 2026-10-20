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
exports.getAllSports = exports.getTurfSlots = exports.getTurfDetails = exports.getTurfs = void 0;
var mongoose_1 = require("mongoose");
var Turf_1 = require("../models/Turf");
var TurfSlot_1 = require("../models/TurfSlot");
// GET /api/turfs?lat=77.71&lng=8.71&radius=10000
var getTurfs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lng, radius, sport, query, turfs, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, lat = _a.lat, lng = _a.lng, radius = _a.radius, sport = _a.sport;
                query = { status: 'ACTIVE' };
                // MongoDB Geospatial $near query
                if (lat && lng) {
                    query.location = {
                        $near: {
                            $geometry: {
                                type: 'Point',
                                coordinates: [parseFloat(lng), parseFloat(lat)]
                            },
                            $maxDistance: radius ? parseInt(radius) : 15000 // default 15km
                        }
                    };
                }
                if (sport) {
                    query.sports = { $in: [new RegExp(sport, 'i')] };
                }
                return [4 /*yield*/, Turf_1.default.find(query).limit(50)];
            case 1:
                turfs = _b.sent();
                res.status(200).json({ success: true, data: turfs });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching turfs:', error_1);
                res.status(500).json({ success: false, message: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTurfs = getTurfs;
// GET /api/turfs/:id
var getTurfDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var turf, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!mongoose_1.default.isValidObjectId(req.params.id)) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Turf not found' })];
                }
                return [4 /*yield*/, Turf_1.default.findById(req.params.id)];
            case 1:
                turf = _a.sent();
                if (!turf) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Turf not found' })];
                }
                res.status(200).json({ success: true, data: turf });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ success: false, message: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTurfDetails = getTurfDetails;
// GET /api/turfs/:id/slots?date=YYYY-MM-DD
var getTurfSlots = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var date, startDate, endDate, slots, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!mongoose_1.default.isValidObjectId(req.params.id)) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Turf not found' })];
                }
                date = req.query.date;
                if (!date) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Date query parameter is required' })];
                }
                startDate = new Date(date);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 1);
                return [4 /*yield*/, TurfSlot_1.default.find({
                        turfId: req.params.id,
                        startTime: { $gte: startDate, $lt: endDate },
                        status: { $in: ['AVAILABLE', 'LOCKED'] }
                    }).sort({ startTime: 1 })];
            case 1:
                slots = _a.sent();
                res.status(200).json({ success: true, data: slots });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ success: false, message: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTurfSlots = getTurfSlots;
// GET /api/turfs/sports/all
var getAllSports = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sports, cleanSports, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Turf_1.default.distinct('sports', { status: 'ACTIVE' })];
            case 1:
                sports = _a.sent();
                cleanSports = sports.filter(Boolean);
                res.status(200).json({ success: true, data: cleanSports });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('getAllSports error:', error_4);
                res.status(500).json({ success: false, message: 'Failed to fetch sports' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllSports = getAllSports;
