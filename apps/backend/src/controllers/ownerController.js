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
exports.getOwnerStaff = exports.getOwnerReports = exports.updateTournamentTeamStatus = exports.registerTournamentTeam = exports.createOwnerTournament = exports.getOwnerTournaments = exports.deleteOwnerOffer = exports.createOwnerOffer = exports.getOwnerOffers = exports.addReviewReply = exports.getOwnerReviews = exports.seedRandomMatches = exports.generateSlots = exports.getOwnerTurfs = exports.deleteTurf = exports.updateTurf = exports.createTurf = exports.getOwnerCustomers = exports.updateBookingStatus = exports.blockSlot = exports.createOfflineBooking = exports.getOwnerBookings = exports.getDashboardStats = exports.getAuthorizedTurfsForUser = void 0;
var Turf_1 = require("../models/Turf");
var TurfSlot_1 = require("../models/TurfSlot");
var Booking_1 = require("../models/Booking");
var User_1 = require("../models/User");
var Review_1 = require("../models/Review");
var Offer_1 = require("../models/Offer");
var Tournament_1 = require("../models/Tournament");
var seed_1 = require("../config/seed");
// Helper: Ensure Database has data, auto-seed if empty
var ensureDatabaseHasData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var turfsCount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Turf_1.default.countDocuments()];
            case 1:
                turfsCount = _a.sent();
                if (!(turfsCount === 0)) return [3 /*break*/, 3];
                console.log('Database empty. Auto-seeding initial sports data into MongoDB Atlas...');
                return [4 /*yield*/, (0, seed_1.seedDatabase)()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// Helper: Securely resolve turfs belonging to or accessible by the authenticated user
var getAuthorizedTurfsForUser = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var directTurfs, primaryOwner;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!user)
                    return [2 /*return*/, []];
                if (!(user.role === 'ADMIN')) return [3 /*break*/, 2];
                return [4 /*yield*/, Turf_1.default.find()];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                if (!(user.role === 'STAFF')) return [3 /*break*/, 8];
                return [4 /*yield*/, Turf_1.default.find({ ownerId: user._id })];
            case 3:
                directTurfs = _a.sent();
                if (directTurfs.length > 0)
                    return [2 /*return*/, directTurfs];
                return [4 /*yield*/, User_1.default.findOne({ role: { $in: ['TURF_OWNER', 'TURF_ADMIN'] } })];
            case 4:
                primaryOwner = _a.sent();
                if (!primaryOwner) return [3 /*break*/, 6];
                return [4 /*yield*/, Turf_1.default.find({ ownerId: primaryOwner._id })];
            case 5: return [2 /*return*/, _a.sent()];
            case 6: return [4 /*yield*/, Turf_1.default.find()];
            case 7: return [2 /*return*/, _a.sent()];
            case 8: return [4 /*yield*/, Turf_1.default.find({ ownerId: user._id })];
            case 9: 
            // TURF_OWNER / TURF_ADMIN
            return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getAuthorizedTurfsForUser = getAuthorizedTurfsForUser;
// 1. Dashboard KPI & Summary
var getDashboardStats = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var turfs, turfIds, activeBookings, totalBookingsCount, today, tomorrow, availableSlots, totalTodaySlots, allConfirmedBookings, totalRevenue, todayBookingsRaw, todayRevenue, recentBookingsRaw, recentBookings, bookedSlotsCount, occupancy, isStaff, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                return [4 /*yield*/, ensureDatabaseHasData()];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, exports.getAuthorizedTurfsForUser)(req.user)];
            case 2:
                turfs = _b.sent();
                turfIds = turfs.map(function (t) { return t._id; });
                if (turfs.length === 0) {
                    return [2 /*return*/, res.status(200).json({
                            success: true,
                            data: {
                                totalTurfs: 0,
                                activeBookings: 0,
                                totalBookings: 0,
                                availableSlots: 0,
                                occupancy: 0,
                                todayRevenue: 0,
                                totalRevenue: 0,
                                recentBookings: []
                            }
                        })];
                }
                return [4 /*yield*/, Booking_1.default.countDocuments({
                        turfId: { $in: turfIds },
                        status: 'CONFIRMED'
                    })];
            case 3:
                activeBookings = _b.sent();
                return [4 /*yield*/, Booking_1.default.countDocuments({
                        turfId: { $in: turfIds }
                    })];
            case 4:
                totalBookingsCount = _b.sent();
                today = new Date();
                today.setHours(0, 0, 0, 0);
                tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                return [4 /*yield*/, TurfSlot_1.default.countDocuments({
                        turfId: { $in: turfIds },
                        status: 'AVAILABLE',
                        startTime: { $gte: today, $lt: tomorrow }
                    })];
            case 5:
                availableSlots = _b.sent();
                return [4 /*yield*/, TurfSlot_1.default.countDocuments({
                        turfId: { $in: turfIds },
                        startTime: { $gte: today, $lt: tomorrow }
                    })];
            case 6:
                totalTodaySlots = _b.sent();
                return [4 /*yield*/, Booking_1.default.find({
                        turfId: { $in: turfIds },
                        status: { $in: ['CONFIRMED', 'COMPLETED'] }
                    }).populate('slotId')];
            case 7:
                allConfirmedBookings = _b.sent();
                totalRevenue = allConfirmedBookings.reduce(function (sum, b) {
                    var _a;
                    return sum + (((_a = b.slotId) === null || _a === void 0 ? void 0 : _a.price) || 1000);
                }, 0);
                return [4 /*yield*/, Booking_1.default.find({
                        turfId: { $in: turfIds },
                        status: { $in: ['CONFIRMED', 'COMPLETED'] },
                        createdAt: { $gte: today, $lt: tomorrow }
                    }).populate('slotId')];
            case 8:
                todayBookingsRaw = _b.sent();
                todayRevenue = todayBookingsRaw.reduce(function (sum, b) {
                    var _a;
                    return sum + (((_a = b.slotId) === null || _a === void 0 ? void 0 : _a.price) || 1000);
                }, 0);
                return [4 /*yield*/, Booking_1.default.find({ turfId: { $in: turfIds } })
                        .sort({ createdAt: -1 })
                        .limit(10)
                        .populate('turfId', 'name locationDetails sports')
                        .populate('userId', 'name phone email')
                        .populate('slotId', 'startTime endTime price')];
            case 9:
                recentBookingsRaw = _b.sent();
                recentBookings = recentBookingsRaw.map(function (b) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    return ({
                        id: b._id.toString(),
                        bookingCode: b.bookingId,
                        turf: ((_a = b.turfId) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Arena',
                        turfId: (_c = (_b = b.turfId) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString(),
                        sport: ((_e = (_d = b.turfId) === null || _d === void 0 ? void 0 : _d.sports) === null || _e === void 0 ? void 0 : _e[0]) || 'Football',
                        user: ((_f = b.userId) === null || _f === void 0 ? void 0 : _f.name) || 'Player',
                        phone: ((_g = b.userId) === null || _g === void 0 ? void 0 : _g.phone) || '',
                        email: ((_h = b.userId) === null || _h === void 0 ? void 0 : _h.email) || '',
                        time: b.slotId
                            ? "".concat(new Date(b.slotId.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), " \u2013 ").concat(new Date(b.slotId.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
                            : 'Evening Slot',
                        date: b.slotId ? new Date(b.slotId.startTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        amount: ((_j = b.slotId) === null || _j === void 0 ? void 0 : _j.price) || 1000,
                        paymentMethod: b.paymentStatus === 'SUCCESS' ? 'UPI' : 'CASH',
                        paymentStatus: b.paymentStatus,
                        status: b.status.toLowerCase()
                    });
                });
                bookedSlotsCount = Math.max(0, totalTodaySlots - availableSlots);
                occupancy = totalTodaySlots > 0 ? Math.round((bookedSlotsCount / totalTodaySlots) * 100) : 0;
                isStaff = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'STAFF';
                res.status(200).json({
                    success: true,
                    data: {
                        totalTurfs: turfs.length,
                        activeBookings: activeBookings,
                        totalBookings: totalBookingsCount,
                        availableSlots: availableSlots,
                        occupancy: occupancy,
                        todayRevenue: isStaff ? 0 : todayRevenue,
                        totalRevenue: isStaff ? 0 : totalRevenue,
                        recentBookings: recentBookings
                    }
                });
                return [3 /*break*/, 11];
            case 10:
                error_1 = _b.sent();
                console.error('getDashboardStats error:', error_1);
                res.status(500).json({ success: false, message: 'Internal server error' });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.getDashboardStats = getDashboardStats;
// 2. Full Bookings Ledger
var getOwnerBookings = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var turfs, turfIds, _a, status_1, turfId_1, search, isAuthorized, query, bookings, formatted, q_1, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                return [4 /*yield*/, ensureDatabaseHasData()];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, exports.getAuthorizedTurfsForUser)(req.user)];
            case 2:
                turfs = _b.sent();
                if (turfs.length === 0) {
                    return [2 /*return*/, res.status(200).json({ success: true, data: [] })];
                }
                turfIds = turfs.map(function (t) { return t._id; });
                _a = req.query, status_1 = _a.status, turfId_1 = _a.turfId, search = _a.search;
                // Verify turf ownership if turfId is provided
                if (turfId_1 && turfId_1 !== 'ALL') {
                    isAuthorized = turfIds.some(function (id) { return id.toString() === turfId_1.toString(); });
                    if (!isAuthorized) {
                        return [2 /*return*/, res.status(403).json({ success: false, message: 'Forbidden: Not authorized for this turf' })];
                    }
                }
                query = {
                    turfId: (turfId_1 && turfId_1 !== 'ALL') ? turfId_1 : { $in: turfIds }
                };
                if (status_1 && status_1 !== 'ALL') {
                    query.status = status_1.toUpperCase();
                }
                return [4 /*yield*/, Booking_1.default.find(query)
                        .sort({ createdAt: -1 })
                        .populate('turfId', 'name locationDetails city sports')
                        .populate('userId', 'name phone email')
                        .populate('slotId', 'startTime endTime price')];
            case 3:
                bookings = _b.sent();
                formatted = bookings.map(function (b) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    return ({
                        id: b._id.toString(),
                        bookingCode: b.bookingId,
                        turfId: (_b = (_a = b.turfId) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(),
                        turfName: ((_c = b.turfId) === null || _c === void 0 ? void 0 : _c.name) || 'Turf Arena',
                        customerName: ((_d = b.userId) === null || _d === void 0 ? void 0 : _d.name) || 'Player',
                        customerPhone: ((_e = b.userId) === null || _e === void 0 ? void 0 : _e.phone) || '',
                        customerEmail: ((_f = b.userId) === null || _f === void 0 ? void 0 : _f.email) || '',
                        sport: ((_h = (_g = b.turfId) === null || _g === void 0 ? void 0 : _g.sports) === null || _h === void 0 ? void 0 : _h[0]) || 'Football',
                        date: b.slotId ? new Date(b.slotId.startTime).toISOString().split('T')[0] : '2026-09-08',
                        timeSlot: b.slotId
                            ? "".concat(new Date(b.slotId.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), " \u2013 ").concat(new Date(b.slotId.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
                            : '6:00 PM – 7:00 PM',
                        startTimeHour: b.slotId ? new Date(b.slotId.startTime).getHours() : 18,
                        durationHours: 1,
                        amount: ((_j = b.slotId) === null || _j === void 0 ? void 0 : _j.price) || 1000,
                        paymentMethod: b.paymentStatus === 'SUCCESS' ? 'UPI' : 'CASH',
                        paymentStatus: b.paymentStatus === 'SUCCESS' ? 'PAID' : (b.paymentStatus === 'REFUNDED' ? 'REFUNDED' : 'PENDING'),
                        status: b.status,
                        createdAt: b.createdAt
                    });
                });
                if (search) {
                    q_1 = search.toLowerCase();
                    formatted = formatted.filter(function (b) {
                        return b.customerName.toLowerCase().includes(q_1) ||
                            b.bookingCode.toLowerCase().includes(q_1) ||
                            b.customerPhone.includes(q_1);
                    });
                }
                res.status(200).json({ success: true, data: formatted });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error('getOwnerBookings error:', error_2);
                res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getOwnerBookings = getOwnerBookings;
// 3. Create Offline Booking (Counter)
var createOfflineBooking = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, turfId, customerName, customerPhone, date, timeSlot, amount, paymentMethod, sport, court, notes, numericAmount, turf_1, authorizedTurfs, hasAccess, customer, bookingDate, startPart, slotHour, slotEndDate, slot, bookingRef, booking, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                _a = req.body, turfId = _a.turfId, customerName = _a.customerName, customerPhone = _a.customerPhone, date = _a.date, timeSlot = _a.timeSlot, amount = _a.amount, paymentMethod = _a.paymentMethod, sport = _a.sport, court = _a.court, notes = _a.notes;
                if (!customerName || !customerPhone) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Customer name and phone number are required' })];
                }
                numericAmount = Number(amount);
                if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Booking amount must be a valid positive price' })];
                }
                return [4 /*yield*/, Turf_1.default.findById(turfId)];
            case 1:
                turf_1 = _b.sent();
                if (!turf_1) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Turf arena not found' })];
                }
                return [4 /*yield*/, (0, exports.getAuthorizedTurfsForUser)(req.user)];
            case 2:
                authorizedTurfs = _b.sent();
                hasAccess = authorizedTurfs.some(function (t) { return t._id.toString() === turf_1._id.toString(); });
                if (!hasAccess) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Forbidden - You do not have access to manage this turf' })];
                }
                return [4 /*yield*/, User_1.default.findOne({ phone: customerPhone })];
            case 3:
                customer = _b.sent();
                if (!!customer) return [3 /*break*/, 5];
                return [4 /*yield*/, User_1.default.create({
                        name: customerName,
                        phone: customerPhone,
                        email: "".concat(customerName.toLowerCase().replace(/\s+/g, ''), "@gmail.com"),
                        role: 'PLAYER',
                        isVerified: true
                    })];
            case 4:
                customer = _b.sent();
                _b.label = 5;
            case 5:
                bookingDate = new Date(date || Date.now());
                startPart = (timeSlot || '19:00').split('–')[0];
                slotHour = parseInt(startPart) || 19;
                bookingDate.setHours(slotHour, 0, 0, 0);
                slotEndDate = new Date(bookingDate);
                slotEndDate.setHours(slotHour + 1, 0, 0, 0);
                return [4 /*yield*/, TurfSlot_1.default.create({
                        turfId: turfId,
                        startTime: bookingDate,
                        endTime: slotEndDate,
                        price: numericAmount,
                        pricingType: 'WEEKDAY',
                        status: 'BOOKED'
                    })];
            case 6:
                slot = _b.sent();
                bookingRef = 'TH-' + Math.floor(1000 + Math.random() * 9000);
                return [4 /*yield*/, Booking_1.default.create({
                        bookingId: bookingRef,
                        userId: customer._id,
                        turfId: turfId,
                        slotId: slot._id,
                        paymentStatus: paymentMethod === 'PENDING' ? 'PENDING' : 'SUCCESS',
                        status: 'CONFIRMED',
                        paymentTransactionId: "OFFLINE-".concat(paymentMethod, "-").concat(Date.now()),
                        qrHash: "QR-".concat(bookingRef)
                    })];
            case 7:
                booking = _b.sent();
                res.status(201).json({
                    success: true,
                    message: 'Offline counter booking confirmed in database',
                    data: {
                        id: booking._id.toString(),
                        bookingCode: bookingRef,
                        slotId: slot._id.toString(),
                        status: 'CONFIRMED'
                    }
                });
                return [3 /*break*/, 9];
            case 8:
                error_3 = _b.sent();
                console.error('createOfflineBooking error:', error_3);
                res.status(500).json({ success: false, message: 'Failed to create offline booking' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.createOfflineBooking = createOfflineBooking;
// 4. Block Slot for Maintenance / Weather
var blockSlot = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, turfId, date, timeSlot, reason, turf, blockDate, blockEnd, slot, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, turfId = _a.turfId, date = _a.date, timeSlot = _a.timeSlot, reason = _a.reason;
                return [4 /*yield*/, Turf_1.default.findById(turfId)];
            case 1:
                turf = _b.sent();
                if (!turf) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Turf not found' })];
                }
                if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF' && req.user.role !== 'TURF_ADMIN' && turf.ownerId.toString() !== req.user._id.toString()) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Forbidden - You do not own or manage this turf' })];
                }
                blockDate = new Date(date || Date.now());
                blockDate.setHours(14, 0, 0, 0);
                blockEnd = new Date(blockDate);
                blockEnd.setHours(16, 0, 0, 0);
                return [4 /*yield*/, TurfSlot_1.default.create({
                        turfId: turfId,
                        startTime: blockDate,
                        endTime: blockEnd,
                        price: 0,
                        pricingType: 'WEEKDAY',
                        status: 'BLOCKED'
                    })];
            case 2:
                slot = _b.sent();
                res.status(201).json({
                    success: true,
                    message: "Slot successfully blocked for ".concat(reason || 'Maintenance'),
                    data: slot
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.error('blockSlot error:', error_4);
                res.status(500).json({ success: false, message: 'Failed to block slot' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.blockSlot = blockSlot;
// 5. Update Booking Status (Cancel, Reschedule, Refund)
var updateBookingStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, status_2, paymentStatus, booking, turfOwnerId, error_5;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                id = req.params.id;
                _a = req.body, status_2 = _a.status, paymentStatus = _a.paymentStatus;
                return [4 /*yield*/, Booking_1.default.findById(id).populate('turfId')];
            case 1:
                booking = _d.sent();
                if (!booking) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Booking not found' })];
                }
                if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF' && req.user.role !== 'TURF_ADMIN') {
                    turfOwnerId = (_c = (_b = booking.turfId) === null || _b === void 0 ? void 0 : _b.ownerId) === null || _c === void 0 ? void 0 : _c.toString();
                    if (turfOwnerId && turfOwnerId !== req.user._id.toString()) {
                        return [2 /*return*/, res.status(403).json({ success: false, message: 'Forbidden - You do not own this turf booking' })];
                    }
                }
                if (status_2)
                    booking.status = status_2.toUpperCase();
                if (paymentStatus)
                    booking.paymentStatus = paymentStatus.toUpperCase();
                return [4 /*yield*/, booking.save()];
            case 2:
                _d.sent();
                if (!(booking.status === 'CANCELLED' && booking.slotId)) return [3 /*break*/, 4];
                return [4 /*yield*/, TurfSlot_1.default.findByIdAndUpdate(booking.slotId, { status: 'AVAILABLE' })];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4:
                res.status(200).json({
                    success: true,
                    message: "Booking status updated to ".concat(booking.status),
                    data: booking
                });
                return [3 /*break*/, 6];
            case 5:
                error_5 = _d.sent();
                console.error('updateBookingStatus error:', error_5);
                res.status(500).json({ success: false, message: 'Failed to update booking' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateBookingStatus = updateBookingStatus;
// 6. Customers CRM Directory
var getOwnerCustomers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var turfs, turfIds, bookings, customerMap_1, customers, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, ensureDatabaseHasData()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, exports.getAuthorizedTurfsForUser)(req.user)];
            case 2:
                turfs = _a.sent();
                if (turfs.length === 0) {
                    return [2 /*return*/, res.status(200).json({ success: true, data: [] })];
                }
                turfIds = turfs.map(function (t) { return t._id; });
                return [4 /*yield*/, Booking_1.default.find({ turfId: { $in: turfIds } })
                        .populate('userId', 'name phone email')
                        .populate('turfId', 'name sports')
                        .populate('slotId', 'price')];
            case 3:
                bookings = _a.sent();
                customerMap_1 = {};
                bookings.forEach(function (b) {
                    var _a, _b, _c, _d;
                    if (!b.userId)
                        return;
                    var uid = b.userId._id.toString();
                    if (!customerMap_1[uid]) {
                        customerMap_1[uid] = {
                            id: uid,
                            name: b.userId.name,
                            phone: b.userId.phone,
                            email: b.userId.email || '',
                            totalBookings: 0,
                            totalSpent: 0,
                            lastVisit: 'Recently',
                            favoriteSport: ((_b = (_a = b.turfId) === null || _a === void 0 ? void 0 : _a.sports) === null || _b === void 0 ? void 0 : _b[0]) || 'Football',
                            favoriteTurf: ((_c = b.turfId) === null || _c === void 0 ? void 0 : _c.name) || 'Turf Arena',
                            rating: 4.9,
                            status: 'REGULAR'
                        };
                    }
                    customerMap_1[uid].totalBookings += 1;
                    customerMap_1[uid].totalSpent += (((_d = b.slotId) === null || _d === void 0 ? void 0 : _d.price) || 1000);
                    if (customerMap_1[uid].totalBookings >= 4) {
                        customerMap_1[uid].status = 'VIP';
                    }
                });
                customers = Object.values(customerMap_1);
                res.status(200).json({
                    success: true,
                    data: customers
                });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                console.error('getOwnerCustomers error:', error_6);
                res.status(500).json({ success: false, message: 'Failed to fetch customers' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getOwnerCustomers = getOwnerCustomers;
// 7. Turf CRUD
var createTurf = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var turfData, turf, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                turfData = req.body;
                turfData.ownerId = req.user._id;
                if (!turfData.location || !Array.isArray(turfData.location.coordinates) || turfData.location.coordinates.length < 2) {
                    turfData.location = {
                        type: 'Point',
                        coordinates: [77.7567, 8.7139] // Default coordinates for Tirunelveli
                    };
                }
                turf = new Turf_1.default(turfData);
                return [4 /*yield*/, turf.save()];
            case 1:
                _a.sent();
                res.status(201).json({ success: true, data: turf, message: 'Turf created successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('createTurf error:', error_7);
                res.status(500).json({ success: false, message: 'Error creating turf' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createTurf = createTurf;
var updateTurf = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, turf, updated, error_8;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, Turf_1.default.findById(id)];
            case 1:
                turf = _c.sent();
                if (!turf) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Turf venue not found' })];
                }
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'ADMIN' && turf.ownerId.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString())) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Forbidden: You do not own this turf venue' })];
                }
                return [4 /*yield*/, Turf_1.default.findByIdAndUpdate(id, { $set: req.body }, { new: true })];
            case 2:
                updated = _c.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Turf venue updated successfully', data: updated })];
            case 3:
                error_8 = _c.sent();
                console.error('updateTurf error:', error_8);
                return [2 /*return*/, res.status(500).json({ success: false, message: 'Error updating turf venue' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateTurf = updateTurf;
var deleteTurf = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, turf, error_9;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                id = req.params.id;
                return [4 /*yield*/, Turf_1.default.findById(id)];
            case 1:
                turf = _c.sent();
                if (!turf) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Turf venue not found' })];
                }
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'ADMIN' && turf.ownerId.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString())) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Forbidden: You do not own this turf venue' })];
                }
                return [4 /*yield*/, Turf_1.default.findByIdAndDelete(id)];
            case 2:
                _c.sent();
                return [4 /*yield*/, TurfSlot_1.default.deleteMany({ turfId: id })];
            case 3:
                _c.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Turf venue deleted successfully' })];
            case 4:
                error_9 = _c.sent();
                console.error('deleteTurf error:', error_9);
                return [2 /*return*/, res.status(500).json({ success: false, message: 'Error deleting turf venue' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteTurf = deleteTurf;
var getOwnerTurfs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sport, turfs, sportRegex_1, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ensureDatabaseHasData()];
            case 1:
                _a.sent();
                sport = req.query.sport;
                return [4 /*yield*/, (0, exports.getAuthorizedTurfsForUser)(req.user)];
            case 2:
                turfs = _a.sent();
                if (sport && sport !== 'ALL') {
                    sportRegex_1 = new RegExp(sport, 'i');
                    turfs = turfs.filter(function (t) { var _a; return (_a = t.sports) === null || _a === void 0 ? void 0 : _a.some(function (s) { return sportRegex_1.test(s); }); });
                }
                res.status(200).json({ success: true, data: turfs });
                return [3 /*break*/, 4];
            case 3:
                error_10 = _a.sent();
                console.error(error_10);
                res.status(500).json({ success: false, message: 'Error fetching owner turfs' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getOwnerTurfs = getOwnerTurfs;
var generateSlots = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, turfId_2, date, startTime, endTime, intervalMinutes, price, pricingType, authorizedTurfs, turf, slots, sTime, eTime, current, end, next, createdSlots, error_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, turfId_2 = _a.turfId, date = _a.date, startTime = _a.startTime, endTime = _a.endTime, intervalMinutes = _a.intervalMinutes, price = _a.price, pricingType = _a.pricingType;
                return [4 /*yield*/, (0, exports.getAuthorizedTurfsForUser)(req.user)];
            case 1:
                authorizedTurfs = _b.sent();
                turf = authorizedTurfs.find(function (t) { return t._id.toString() === turfId_2.toString(); });
                if (!turf) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Forbidden: You do not own or have access to this turf' })];
                }
                slots = [];
                sTime = startTime ? (startTime.length === 5 ? "".concat(startTime, ":00") : startTime) : '06:00:00';
                eTime = endTime ? (endTime.length === 5 ? "".concat(endTime, ":00") : endTime) : '22:00:00';
                current = new Date("".concat(date, "T").concat(sTime));
                end = new Date("".concat(date, "T").concat(eTime));
                if (isNaN(current.getTime()) || isNaN(end.getTime())) {
                    current = new Date("".concat(date, "T06:00:00"));
                    end = new Date("".concat(date, "T22:00:00"));
                }
                while (current < end) {
                    next = new Date(current.getTime() + (intervalMinutes || 60) * 60000);
                    if (next > end)
                        break;
                    slots.push({
                        turfId: turfId_2,
                        startTime: new Date(current),
                        endTime: new Date(next),
                        price: Number(price) || 1000,
                        pricingType: pricingType || 'WEEKDAY',
                        status: 'AVAILABLE'
                    });
                    current = next;
                }
                return [4 /*yield*/, TurfSlot_1.default.insertMany(slots)];
            case 2:
                createdSlots = _b.sent();
                res.status(201).json({ success: true, data: createdSlots, message: "".concat(createdSlots.length, " slots generated successfully") });
                return [3 /*break*/, 4];
            case 3:
                error_11 = _b.sent();
                console.error('generateSlots error:', error_11);
                res.status(500).json({ success: false, message: 'Error generating slots' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.generateSlots = generateSlots;
// 8. Dynamic Random Data Seeder Endpoint (POST /api/owner/seed-random)
var seedRandomMatches = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var count, createdBookings, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                count = parseInt(req.body.count) || 5;
                return [4 /*yield*/, (0, seed_1.generateRandomBookings)(count)];
            case 1:
                createdBookings = _a.sent();
                res.status(201).json({
                    success: true,
                    message: "Successfully generated and added ".concat(createdBookings.length, " random matches in database"),
                    count: createdBookings.length,
                    data: createdBookings
                });
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                console.error('seedRandomMatches error:', error_12);
                res.status(500).json({ success: false, message: 'Failed to seed random data' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.seedRandomMatches = seedRandomMatches;
// 9. Reviews Endpoint (GET /api/owner/reviews, POST /api/owner/reviews/:id/reply)
var getOwnerReviews = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var count, reviews, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, ensureDatabaseHasData()];
            case 1:
                _a.sent();
                return [4 /*yield*/, Review_1.default.countDocuments()];
            case 2:
                count = _a.sent();
                if (!(count === 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, seed_1.seedDatabase)()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, Review_1.default.find().sort({ createdAt: -1 })];
            case 5:
                reviews = _a.sent();
                res.status(200).json({ success: true, data: reviews });
                return [3 /*break*/, 7];
            case 6:
                error_13 = _a.sent();
                console.error('getOwnerReviews error:', error_13);
                res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getOwnerReviews = getOwnerReviews;
var addReviewReply = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, text, author, review, error_14;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, text = _a.text, author = _a.author;
                return [4 /*yield*/, Review_1.default.findByIdAndUpdate(id, {
                        reply: {
                            author: author || 'John (TurfHub Owner)',
                            date: 'Just now',
                            text: text
                        }
                    }, { new: true })];
            case 1:
                review = _b.sent();
                res.status(200).json({ success: true, data: review, message: 'Reply posted to database' });
                return [3 /*break*/, 3];
            case 2:
                error_14 = _b.sent();
                console.error('addReviewReply error:', error_14);
                res.status(500).json({ success: false, message: 'Failed to add reply' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addReviewReply = addReviewReply;
// 10. Offers Endpoint (GET /api/owner/offers, POST /api/owner/offers)
var getOwnerOffers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var count, offers, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, Offer_1.default.countDocuments()];
            case 1:
                count = _a.sent();
                if (!(count === 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, seed_1.seedDatabase)()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, Offer_1.default.find().sort({ createdAt: -1 })];
            case 4:
                offers = _a.sent();
                res.status(200).json({ success: true, data: offers });
                return [3 /*break*/, 6];
            case 5:
                error_15 = _a.sent();
                console.error('getOwnerOffers error:', error_15);
                res.status(500).json({ success: false, message: 'Failed to fetch offers' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getOwnerOffers = getOwnerOffers;
var createOwnerOffer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var offer, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Offer_1.default.create(req.body)];
            case 1:
                offer = _a.sent();
                res.status(201).json({ success: true, data: offer, message: 'Offer saved to database' });
                return [3 /*break*/, 3];
            case 2:
                error_16 = _a.sent();
                console.error('createOwnerOffer error:', error_16);
                res.status(500).json({ success: false, message: 'Failed to create offer' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createOwnerOffer = createOwnerOffer;
var deleteOwnerOffer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, Offer_1.default.findByIdAndDelete(id)];
            case 1:
                _a.sent();
                res.status(200).json({ success: true, message: 'Offer deleted successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_17 = _a.sent();
                console.error('deleteOwnerOffer error:', error_17);
                res.status(500).json({ success: false, message: 'Failed to delete offer' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteOwnerOffer = deleteOwnerOffer;
// 11. Tournaments Endpoint (GET /api/owner/tournaments, POST /api/owner/tournaments)
var getOwnerTournaments = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var count, tournaments, error_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, Tournament_1.default.countDocuments()];
            case 1:
                count = _a.sent();
                if (!(count === 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, seed_1.seedDatabase)()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, Tournament_1.default.find().sort({ createdAt: -1 })];
            case 4:
                tournaments = _a.sent();
                res.status(200).json({ success: true, data: tournaments });
                return [3 /*break*/, 6];
            case 5:
                error_18 = _a.sent();
                console.error('getOwnerTournaments error:', error_18);
                res.status(500).json({ success: false, message: 'Failed to fetch tournaments' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getOwnerTournaments = getOwnerTournaments;
var createOwnerTournament = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, sport, venue, date, teamsLimit, entryFee, prizePool, image, tournament, error_19;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, title = _a.title, sport = _a.sport, venue = _a.venue, date = _a.date, teamsLimit = _a.teamsLimit, entryFee = _a.entryFee, prizePool = _a.prizePool, image = _a.image;
                if (!title || !date) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Tournament title and date are required' })];
                }
                return [4 /*yield*/, Tournament_1.default.create({
                        title: title.trim(),
                        sport: sport || 'Football 7v7',
                        venue: venue || 'ABC Football Arena',
                        date: date,
                        teamsLimit: Number(teamsLimit) || 16,
                        registeredCount: 0,
                        registeredTeams: [],
                        organizerId: req.user._id,
                        entryFee: Number(entryFee) || 0,
                        prizePool: prizePool || 'Trophy & Medals',
                        status: 'REGISTRATION OPEN',
                        image: image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'
                    })];
            case 1:
                tournament = _b.sent();
                res.status(201).json({ success: true, data: tournament, message: 'Tournament created successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_19 = _b.sent();
                console.error('createOwnerTournament error:', error_19);
                res.status(500).json({ success: false, message: 'Failed to create tournament' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createOwnerTournament = createOwnerTournament;
var registerTournamentTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, teamName_1, captainName, captainPhone, membersCount, tournament, exists, error_20;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = req.params.id;
                _a = req.body, teamName_1 = _a.teamName, captainName = _a.captainName, captainPhone = _a.captainPhone, membersCount = _a.membersCount;
                if (!teamName_1 || !captainName || !captainPhone) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Team name, captain name, and captain mobile number are required' })];
                }
                return [4 /*yield*/, Tournament_1.default.findById(id)];
            case 1:
                tournament = _b.sent();
                if (!tournament) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Tournament not found' })];
                }
                if (tournament.status !== 'REGISTRATION OPEN') {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Registrations are closed for this tournament' })];
                }
                if (tournament.registeredTeams.length >= tournament.teamsLimit) {
                    return [2 /*return*/, res.status(409).json({ success: false, message: 'Tournament registration is full' })];
                }
                exists = tournament.registeredTeams.some(function (t) { return t.teamName.toLowerCase() === teamName_1.trim().toLowerCase(); });
                if (exists) {
                    return [2 /*return*/, res.status(409).json({ success: false, message: 'A team with this name is already registered' })];
                }
                tournament.registeredTeams.push({
                    teamName: teamName_1.trim(),
                    captainName: captainName.trim(),
                    captainPhone: captainPhone.trim(),
                    membersCount: Number(membersCount) || 7,
                    registeredAt: new Date(),
                    status: 'CONFIRMED'
                });
                tournament.registeredCount = tournament.registeredTeams.filter(function (t) { return t.status !== 'REJECTED'; }).length;
                return [4 /*yield*/, tournament.save()];
            case 2:
                _b.sent();
                res.status(201).json({
                    success: true,
                    message: "Squad \"".concat(teamName_1, "\" registered successfully!"),
                    data: tournament
                });
                return [3 /*break*/, 4];
            case 3:
                error_20 = _b.sent();
                console.error('registerTournamentTeam error:', error_20);
                res.status(500).json({ success: false, message: 'Failed to register team' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.registerTournamentTeam = registerTournamentTeam;
var updateTournamentTeamStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, teamId_1, status_3, tournament, team, error_21;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.params, id = _a.id, teamId_1 = _a.teamId;
                status_3 = req.body.status;
                return [4 /*yield*/, Tournament_1.default.findById(id)];
            case 1:
                tournament = _b.sent();
                if (!tournament) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Tournament not found' })];
                }
                team = tournament.registeredTeams.id
                    ? tournament.registeredTeams.id(teamId_1)
                    : tournament.registeredTeams.find(function (t) { var _a; return ((_a = t._id) === null || _a === void 0 ? void 0 : _a.toString()) === teamId_1.toString(); });
                if (!team) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Registered team not found' })];
                }
                team.status = status_3;
                tournament.registeredCount = tournament.registeredTeams.filter(function (t) { return t.status === 'CONFIRMED' || t.status === 'APPROVED'; }).length;
                return [4 /*yield*/, tournament.save()];
            case 2:
                _b.sent();
                res.status(200).json({ success: true, message: "Team status updated to ".concat(status_3), data: tournament });
                return [3 /*break*/, 4];
            case 3:
                error_21 = _b.sent();
                console.error('updateTournamentTeamStatus error:', error_21);
                res.status(500).json({ success: false, message: 'Failed to update team status' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateTournamentTeamStatus = updateTournamentTeamStatus;
// 12. Reports & Analytics (GET /api/owner/reports)
var getOwnerReports = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var turfs, turfIds, bookings, turfRevenueMap_1, sportDistributionMap_1, totalRevenue_1, totalBookings_1, turfContributions, sportDistribution, error_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, ensureDatabaseHasData()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, exports.getAuthorizedTurfsForUser)(req.user)];
            case 2:
                turfs = _a.sent();
                if (turfs.length === 0) {
                    return [2 /*return*/, res.status(200).json({
                            success: true,
                            data: {
                                totalRevenue: 0,
                                totalBookings: 0,
                                turfContributions: [],
                                sportDistribution: []
                            }
                        })];
                }
                turfIds = turfs.map(function (t) { return t._id; });
                return [4 /*yield*/, Booking_1.default.find({ turfId: { $in: turfIds } })
                        .populate('turfId', 'name sports')
                        .populate('slotId', 'price startTime')];
            case 3:
                bookings = _a.sent();
                turfRevenueMap_1 = {};
                sportDistributionMap_1 = {};
                totalRevenue_1 = 0;
                totalBookings_1 = bookings.length;
                bookings.forEach(function (b) {
                    var _a, _b, _c, _d;
                    var price = ((_a = b.slotId) === null || _a === void 0 ? void 0 : _a.price) || 0;
                    var turfName = ((_b = b.turfId) === null || _b === void 0 ? void 0 : _b.name) || 'Turf Arena';
                    var sport = ((_d = (_c = b.turfId) === null || _c === void 0 ? void 0 : _c.sports) === null || _d === void 0 ? void 0 : _d[0]) || 'Football';
                    if (b.status === 'CONFIRMED' || b.status === 'COMPLETED') {
                        totalRevenue_1 += price;
                    }
                    if (!turfRevenueMap_1[turfName]) {
                        turfRevenueMap_1[turfName] = { name: turfName, revenue: 0, bookings: 0 };
                    }
                    turfRevenueMap_1[turfName].revenue += price;
                    turfRevenueMap_1[turfName].bookings += 1;
                    sportDistributionMap_1[sport] = (sportDistributionMap_1[sport] || 0) + 1;
                });
                turfContributions = Object.values(turfRevenueMap_1);
                sportDistribution = Object.entries(sportDistributionMap_1).map(function (_a) {
                    var name = _a[0], count = _a[1];
                    return ({
                        name: name,
                        value: Math.round((count / (totalBookings_1 || 1)) * 100)
                    });
                });
                res.status(200).json({
                    success: true,
                    data: {
                        totalRevenue: totalRevenue_1,
                        totalBookings: totalBookings_1,
                        turfContributions: turfContributions,
                        sportDistribution: sportDistribution
                    }
                });
                return [3 /*break*/, 5];
            case 4:
                error_22 = _a.sent();
                console.error('getOwnerReports error:', error_22);
                res.status(500).json({ success: false, message: 'Failed to fetch reports' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getOwnerReports = getOwnerReports;
var getOwnerStaff = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var staffMembers, error_23;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.find({ role: 'STAFF' }).select('-password')];
            case 1:
                staffMembers = _a.sent();
                res.status(200).json({ success: true, data: staffMembers });
                return [3 /*break*/, 3];
            case 2:
                error_23 = _a.sent();
                console.error('getOwnerStaff error:', error_23);
                res.status(500).json({ success: false, message: 'Failed to fetch staff' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getOwnerStaff = getOwnerStaff;
