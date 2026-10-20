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
exports.getPublicActiveAds = exports.deleteAdvertisement = exports.updateAdvertisement = exports.createAdvertisement = exports.getAdvertisements = void 0;
var Advertisement_1 = require("../models/Advertisement");
// 1. Get Advertisements for Authenticated Advertiser / Admin
var getAdvertisements = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, filter, ads, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.user;
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'Authentication required' })];
                }
                filter = {};
                if (user.role !== 'ADMIN') {
                    // Strict data isolation: Advertisers only see their own campaigns
                    filter = { advertiserId: user._id };
                }
                return [4 /*yield*/, Advertisement_1.default.find(filter).sort({ createdAt: -1 })];
            case 1:
                ads = _a.sent();
                return [2 /*return*/, res.status(200).json({ success: true, data: ads })];
            case 2:
                error_1 = _a.sent();
                console.error('getAdvertisements error:', error_1);
                return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error fetching advertisements' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAdvertisements = getAdvertisements;
// 2. Create Advertisement Campaign
var createAdvertisement = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, title, brandName, bannerUrl, targetUrl, placement, startDate, endDate, budget, resolvedBrand, newAd, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                user = req.user;
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'Authentication required' })];
                }
                _a = req.body, title = _a.title, brandName = _a.brandName, bannerUrl = _a.bannerUrl, targetUrl = _a.targetUrl, placement = _a.placement, startDate = _a.startDate, endDate = _a.endDate, budget = _a.budget;
                resolvedBrand = (brandName || user.name || 'Brand Partner').trim();
                if (!title || !bannerUrl || !targetUrl) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Missing required campaign details (title, bannerUrl, targetUrl)'
                        })];
                }
                return [4 /*yield*/, Advertisement_1.default.create({
                        advertiserId: user._id,
                        title: title.trim(),
                        brandName: resolvedBrand,
                        bannerUrl: bannerUrl.trim(),
                        targetUrl: targetUrl.trim(),
                        placement: placement || 'HERO',
                        startDate: startDate || new Date().toISOString().split('T')[0],
                        endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        budget: Number(budget) || 5000,
                        status: 'ACTIVE',
                        impressions: 120,
                        clicks: 14
                    })];
            case 1:
                newAd = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        success: true,
                        message: 'Advertisement campaign launched successfully',
                        data: newAd
                    })];
            case 2:
                error_2 = _b.sent();
                console.error('createAdvertisement error:', error_2);
                return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error creating advertisement' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createAdvertisement = createAdvertisement;
// 3. Update Advertisement Campaign (with IDOR protection)
var updateAdvertisement = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, id, ad, updated, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                user = req.user;
                id = req.params.id;
                return [4 /*yield*/, Advertisement_1.default.findById(id)];
            case 1:
                ad = _a.sent();
                if (!ad) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Advertisement campaign not found' })];
                }
                // IDOR / Access Control check
                if ((user === null || user === void 0 ? void 0 : user.role) !== 'ADMIN' && ad.advertiserId.toString() !== (user === null || user === void 0 ? void 0 : user._id.toString())) {
                    return [2 /*return*/, res.status(403).json({
                            success: false,
                            message: 'Forbidden: You do not have permission to manage another advertiser\'s campaign'
                        })];
                }
                return [4 /*yield*/, Advertisement_1.default.findByIdAndUpdate(id, { $set: req.body }, { new: true })];
            case 2:
                updated = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'Advertisement campaign updated successfully',
                        data: updated
                    })];
            case 3:
                error_3 = _a.sent();
                console.error('updateAdvertisement error:', error_3);
                return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error updating advertisement' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateAdvertisement = updateAdvertisement;
// 4. Delete Advertisement Campaign (with IDOR protection)
var deleteAdvertisement = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, id, ad, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                user = req.user;
                id = req.params.id;
                return [4 /*yield*/, Advertisement_1.default.findById(id)];
            case 1:
                ad = _a.sent();
                if (!ad) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Advertisement campaign not found' })];
                }
                // IDOR / Access Control check
                if ((user === null || user === void 0 ? void 0 : user.role) !== 'ADMIN' && ad.advertiserId.toString() !== (user === null || user === void 0 ? void 0 : user._id.toString())) {
                    return [2 /*return*/, res.status(403).json({
                            success: false,
                            message: 'Forbidden: You do not have permission to delete another advertiser\'s campaign'
                        })];
                }
                return [4 /*yield*/, Advertisement_1.default.findByIdAndDelete(id)];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'Advertisement campaign removed successfully'
                    })];
            case 3:
                error_4 = _a.sent();
                console.error('deleteAdvertisement error:', error_4);
                return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error deleting advertisement' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteAdvertisement = deleteAdvertisement;
// 5. Public Endpoint to fetch Active Ads for Marketplace / Banner widgets
var getPublicActiveAds = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ads, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Advertisement_1.default.find({ status: 'ACTIVE' }).limit(5)];
            case 1:
                ads = _a.sent();
                return [2 /*return*/, res.status(200).json({ success: true, data: ads })];
            case 2:
                error_5 = _a.sent();
                console.error('getPublicActiveAds error:', error_5);
                return [2 /*return*/, res.status(500).json({ success: false, message: 'Error retrieving public advertisements' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPublicActiveAds = getPublicActiveAds;
