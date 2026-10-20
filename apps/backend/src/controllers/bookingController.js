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
exports.publicBookTurf = exports.getMyBookings = exports.verifyBooking = exports.initiateBooking = void 0;
var TurfSlot_1 = require("../models/TurfSlot");
var Booking_1 = require("../models/Booking");
var Turf_1 = require("../models/Turf");
var User_1 = require("../models/User");
var redis_1 = require("../config/redis");
var initiateBooking = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var slotId, userId, lockKey, lockTTL, acquired, slot, orderId, booking, error_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                slotId = req.body.slotId;
                userId = req.user._id;
                if (!slotId) {
                    res.status(400).json({ error: 'slotId is required' });
                    return [2 /*return*/];
                }
                lockKey = "lock:slot:".concat(slotId);
                lockTTL = 600;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                return [4 /*yield*/, redis_1.default.set(lockKey, userId.toString(), 'EX', lockTTL, 'NX')];
            case 2:
                acquired = _a.sent();
                if (!acquired) {
                    res.status(409).json({ error: 'Slot is currently being booked by someone else' });
                    return [2 /*return*/];
                }
                _a.label = 3;
            case 3:
                _a.trys.push([3, 7, , 9]);
                return [4 /*yield*/, TurfSlot_1.default.findById(slotId)];
            case 4:
                slot = _a.sent();
                if (!slot || slot.status !== 'AVAILABLE') {
                    res.status(409).json({ error: 'Slot is unavailable' });
                    return [2 /*return*/];
                }
                orderId = 'ORD_' + Math.floor(Math.random() * 1000000000);
                booking = new Booking_1.default({
                    bookingId: orderId,
                    userId: userId,
                    turfId: slot.turfId,
                    slotId: slotId,
                    paymentStatus: 'PENDING',
                    status: 'PAYMENT_PENDING'
                });
                return [4 /*yield*/, booking.save()];
            case 5:
                _a.sent();
                slot.status = 'LOCKED';
                return [4 /*yield*/, slot.save()];
            case 6:
                _a.sent();
                res.status(201).json({ success: true, orderId: orderId, bookingId: booking._id });
                return [3 /*break*/, 9];
            case 7:
                error_1 = _a.sent();
                return [4 /*yield*/, redis_1.default.del(lockKey)];
            case 8:
                _a.sent();
                throw error_1;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_2 = _a.sent();
                console.error('Error initiating booking:', error_2);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.initiateBooking = initiateBooking;
var verifyBooking = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, orderId, paymentId, slotId, userId, booking, slot, lockKey, script, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, orderId = _a.orderId, paymentId = _a.paymentId, slotId = _a.slotId;
                userId = req.user._id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                return [4 /*yield*/, Booking_1.default.findOne({ bookingId: orderId, userId: userId })];
            case 2:
                booking = _b.sent();
                if (!booking) {
                    res.status(404).json({ error: 'Booking not found' });
                    return [2 /*return*/];
                }
                if (!paymentId) {
                    res.status(400).json({ error: 'Payment signature required' });
                    return [2 /*return*/];
                }
                booking.paymentStatus = 'SUCCESS';
                booking.status = 'CONFIRMED';
                return [4 /*yield*/, booking.save()];
            case 3:
                _b.sent();
                return [4 /*yield*/, TurfSlot_1.default.findById(slotId)];
            case 4:
                slot = _b.sent();
                if (!slot) return [3 /*break*/, 6];
                slot.status = 'BOOKED';
                return [4 /*yield*/, slot.save()];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                lockKey = "lock:slot:".concat(slotId);
                script = "\n            if redis.call(\"get\", KEYS[1]) == ARGV[1] then\n                return redis.call(\"del\", KEYS[1])\n            else\n                return 0\n            end\n        ";
                return [4 /*yield*/, redis_1.default.eval(script, 1, lockKey, userId.toString())];
            case 7:
                _b.sent();
                res.status(200).json({ success: true, message: 'Booking confirmed' });
                return [3 /*break*/, 9];
            case 8:
                error_3 = _b.sent();
                console.error('Error verifying booking:', error_3);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.verifyBooking = verifyBooking;
var getMyBookings = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, bookings, formatted, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user._id;
                return [4 /*yield*/, Booking_1.default.find({ userId: userId })
                        .sort({ createdAt: -1 })
                        .populate('turfId', 'name locationDetails city sports images')
                        .populate('slotId', 'startTime endTime price')];
            case 1:
                bookings = _a.sent();
                formatted = bookings.map(function (b) {
                    var _a, _b, _c, _d, _e, _f;
                    return ({
                        id: b._id.toString(),
                        bookingCode: b.bookingId,
                        turfId: (_b = (_a = b.turfId) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(),
                        turfName: ((_c = b.turfId) === null || _c === void 0 ? void 0 : _c.name) || 'Turf Arena',
                        customerName: req.user.name,
                        customerPhone: req.user.phone,
                        customerEmail: req.user.email || '',
                        sport: ((_e = (_d = b.turfId) === null || _d === void 0 ? void 0 : _d.sports) === null || _e === void 0 ? void 0 : _e[0]) || 'Football',
                        date: b.slotId ? new Date(b.slotId.startTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        timeSlot: b.slotId
                            ? "".concat(new Date(b.slotId.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), " \u2013 ").concat(new Date(b.slotId.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
                            : 'Evening Slot',
                        startTimeHour: b.slotId ? new Date(b.slotId.startTime).getHours() : 18,
                        durationHours: 1,
                        amount: ((_f = b.slotId) === null || _f === void 0 ? void 0 : _f.price) || 1000,
                        paymentMethod: b.paymentStatus === 'SUCCESS' ? 'UPI' : 'CASH',
                        paymentStatus: b.paymentStatus === 'SUCCESS' ? 'PAID' : (b.paymentStatus === 'REFUNDED' ? 'REFUNDED' : 'PENDING'),
                        status: b.status,
                        qrHash: b.qrHash,
                        createdAt: b.createdAt
                    });
                });
                res.status(200).json({ success: true, data: formatted });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error in getMyBookings:', error_4);
                res.status(500).json({ success: false, message: 'Failed to fetch personal bookings' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMyBookings = getMyBookings;
var publicBookTurf = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, turfId, date, timeSlot, customerName, customerPhone, sport, paymentMethod, cleanPhone, turf, bookingDate, startPart, slotHour, existingSlot, basePrice, isPeak, calculatedAmount, customer, slotEndDate, slot, bookingRef, booking, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                _a = req.body, turfId = _a.turfId, date = _a.date, timeSlot = _a.timeSlot, customerName = _a.customerName, customerPhone = _a.customerPhone, sport = _a.sport, paymentMethod = _a.paymentMethod;
                if (!turfId || !customerName || !customerPhone || !timeSlot) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Missing required booking fields: turf, customer name, mobile number, and time slot are required.'
                        })];
                }
                cleanPhone = customerPhone.trim();
                if (!/^\d{10}$/.test(cleanPhone)) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Please provide a valid 10-digit mobile number for booking confirmation.'
                        })];
                }
                return [4 /*yield*/, Turf_1.default.findById(turfId)];
            case 1:
                turf = _b.sent();
                if (!turf) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            message: 'The selected turf arena does not exist or has been deactivated.'
                        })];
                }
                bookingDate = new Date(date || Date.now());
                startPart = (timeSlot || '18:00').split('–')[0];
                slotHour = parseInt(startPart) || 18;
                bookingDate.setHours(slotHour, 0, 0, 0);
                return [4 /*yield*/, TurfSlot_1.default.findOne({
                        turfId: turfId,
                        startTime: bookingDate,
                        status: { $in: ['BOOKED', 'LOCKED', 'BLOCKED'] }
                    })];
            case 2:
                existingSlot = _b.sent();
                if (existingSlot) {
                    return [2 /*return*/, res.status(409).json({
                            success: false,
                            message: "The ".concat(timeSlot, " slot on ").concat(date, " is already booked. Please choose an alternative time slot.")
                        })];
                }
                basePrice = turf.pricePerHour || 1000;
                isPeak = timeSlot.includes('6:00 PM') || timeSlot.includes('7:00 PM') || timeSlot.includes('8:00 PM');
                calculatedAmount = isPeak ? basePrice + 200 : basePrice;
                return [4 /*yield*/, User_1.default.findOne({ phone: cleanPhone })];
            case 3:
                customer = _b.sent();
                if (!!customer) return [3 /*break*/, 5];
                return [4 /*yield*/, User_1.default.create({
                        name: customerName.trim(),
                        phone: cleanPhone,
                        role: 'PLAYER',
                        isVerified: true,
                        tokenVersion: 0
                    })];
            case 4:
                customer = _b.sent();
                _b.label = 5;
            case 5:
                slotEndDate = new Date(bookingDate);
                slotEndDate.setHours(slotHour + 1, 0, 0, 0);
                return [4 /*yield*/, TurfSlot_1.default.create({
                        turfId: turfId,
                        startTime: bookingDate,
                        endTime: slotEndDate,
                        price: calculatedAmount,
                        pricingType: isPeak ? 'PEAK' : 'WEEKDAY',
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
                        paymentTransactionId: "ONLINE-".concat(Date.now()),
                        qrHash: "QR-".concat(bookingRef)
                    })];
            case 7:
                booking = _b.sent();
                res.status(201).json({
                    success: true,
                    message: "Match booked successfully for ".concat(turf.name, "!"),
                    data: {
                        id: booking._id ? booking._id.toString() : bookingRef,
                        bookingCode: bookingRef,
                        turfName: turf.name,
                        date: bookingDate.toISOString().split('T')[0],
                        timeSlot: timeSlot,
                        amount: calculatedAmount,
                        status: 'CONFIRMED'
                    }
                });
                return [3 /*break*/, 9];
            case 8:
                error_5 = _b.sent();
                console.error('Error in publicBookTurf:', error_5);
                res.status(500).json({ success: false, message: 'Server error while processing your booking request. Please try again.' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.publicBookTurf = publicBookTurf;
