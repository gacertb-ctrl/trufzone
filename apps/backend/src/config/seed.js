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
exports.generateRandomBookings = exports.seedDatabase = void 0;
var User_1 = require("../models/User");
var Turf_1 = require("../models/Turf");
var TurfSlot_1 = require("../models/TurfSlot");
var Booking_1 = require("../models/Booking");
var Review_1 = require("../models/Review");
var Offer_1 = require("../models/Offer");
var Tournament_1 = require("../models/Tournament");
var Advertisement_1 = require("../models/Advertisement");
var authController_1 = require("../controllers/authController");
var SEED_PLAYERS = [
    { name: 'Arun Kumar', phone: '9876543210', email: 'arun.football@gmail.com' },
    { name: 'Suresh (Nellai Strikers FC)', phone: '9988776655', email: 'suresh.strikers@nellai.in' },
    { name: 'Karthik Ramasamy', phone: '9123456789', email: 'karthik.warriors@outlook.com' },
    { name: 'Rajesh Kannan (Friends United)', phone: '9442233445', email: 'rajesh.fu@gmail.com' },
    { name: 'Pradeep S', phone: '9888111222', email: 'pradeep.sports@yahoo.com' },
    { name: 'Vijay Murugan', phone: '9840199887', email: 'vijay.cup@gmail.com' },
    { name: 'Mohamed Riaz', phone: '9771122334', email: 'riaz.tigers@gmail.com' },
    { name: 'Palai Smashers Team', phone: '9944155667', email: 'smashers.badminton@live.com' },
    { name: 'Ashwin Kumar', phone: '9488123456', email: 'ashwin.k@gmail.com' },
    { name: 'Venkatesh M', phone: '9842198765', email: 'venkat.sports@gmail.com' },
    { name: 'Dinesh Babu', phone: '9791122334', email: 'dinesh.babu@outlook.com' },
    { name: 'Manikandan P', phone: '9443156789', email: 'mani.football@gmail.com' },
];
var RANDOM_PLAYER_NAMES = [
    'Gokul Nath', 'Vigneshwaran P', 'Praveen Kumar', 'Mohan Sundaram',
    'Naveen Raj', 'Ajith Kumar', 'Dhanush S', 'Saravanan K',
    'Balaji Raman', 'Vijay Antony', 'Kabilan M', 'Surya Prakash',
    'Anand Babu', 'Silambarasan', 'Senthil Nathan'
];
var seedDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var defaultPassword, owner, staffUser, adminUser, advertiserUser, createdPlayers, _i, SEED_PLAYERS_1, p, player, existingTurfs, turfs, turf1, turf2, turf3, baseDate, dayOffset, currentDay, nextDay, _a, turfs_1, turf, slotsCount, slotsToInsert, h, start, end, isPeak, price, totalBookingsCount, allSlots, bookingTemplates, slotIdx, i, tmpl, slot, player, turf, bookingRef, reviewCount, offerCount, tourCount, adsCount, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 66, , 67]);
                defaultPassword = (0, authController_1.hashPassword)('password123');
                return [4 /*yield*/, User_1.default.findOne({ phone: '9443182940' })];
            case 1:
                owner = _b.sent();
                if (!!owner) return [3 /*break*/, 3];
                return [4 /*yield*/, User_1.default.create({
                        name: 'John Doe',
                        phone: '9443182940',
                        email: 'john.doe@turfhub.in',
                        password: defaultPassword,
                        role: 'TURF_OWNER',
                        isVerified: true
                    })];
            case 2:
                owner = _b.sent();
                console.log('Seeded Owner: John Doe');
                return [3 /*break*/, 5];
            case 3:
                if (!!owner.password) return [3 /*break*/, 5];
                owner.password = defaultPassword;
                return [4 /*yield*/, owner.save()];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [4 /*yield*/, User_1.default.findOne({ phone: '9842100001' })];
            case 6:
                staffUser = _b.sent();
                if (!!staffUser) return [3 /*break*/, 8];
                return [4 /*yield*/, User_1.default.create({
                        name: 'Karthik R (Ground Supervisor)',
                        phone: '9842100001',
                        email: 'karthik.staff@turfhub.in',
                        password: defaultPassword,
                        role: 'STAFF',
                        isVerified: true
                    })];
            case 7:
                staffUser = _b.sent();
                console.log('Seeded Staff: Karthik R');
                return [3 /*break*/, 10];
            case 8:
                if (!!staffUser.password) return [3 /*break*/, 10];
                staffUser.password = defaultPassword;
                return [4 /*yield*/, staffUser.save()];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10: return [4 /*yield*/, User_1.default.findOne({ phone: '9443100002' })];
            case 11:
                adminUser = _b.sent();
                if (!!adminUser) return [3 /*break*/, 13];
                return [4 /*yield*/, User_1.default.create({
                        name: 'Sundar Raman (Platform Admin)',
                        phone: '9443100002',
                        email: 'admin@turfhub.in',
                        password: defaultPassword,
                        role: 'ADMIN',
                        isVerified: true
                    })];
            case 12:
                adminUser = _b.sent();
                console.log('Seeded Admin: Sundar Raman');
                return [3 /*break*/, 15];
            case 13:
                if (!!adminUser.password) return [3 /*break*/, 15];
                adminUser.password = defaultPassword;
                return [4 /*yield*/, adminUser.save()];
            case 14:
                _b.sent();
                _b.label = 15;
            case 15: return [4 /*yield*/, User_1.default.findOne({ phone: '9842100003' })];
            case 16:
                advertiserUser = _b.sent();
                if (!!advertiserUser) return [3 /*break*/, 18];
                return [4 /*yield*/, User_1.default.create({
                        name: 'Sponsor Partner',
                        phone: '9842100003',
                        email: 'sponsors@turfhub.in',
                        password: defaultPassword,
                        role: 'ADVERTISER',
                        isVerified: true
                    })];
            case 17:
                advertiserUser = _b.sent();
                console.log('Seeded Advertiser: Sponsor Partner');
                return [3 /*break*/, 20];
            case 18:
                if (!!advertiserUser.password) return [3 /*break*/, 20];
                advertiserUser.password = defaultPassword;
                return [4 /*yield*/, advertiserUser.save()];
            case 19:
                _b.sent();
                _b.label = 20;
            case 20:
                createdPlayers = [];
                _i = 0, SEED_PLAYERS_1 = SEED_PLAYERS;
                _b.label = 21;
            case 21:
                if (!(_i < SEED_PLAYERS_1.length)) return [3 /*break*/, 28];
                p = SEED_PLAYERS_1[_i];
                return [4 /*yield*/, User_1.default.findOne({ phone: p.phone })];
            case 22:
                player = _b.sent();
                if (!!player) return [3 /*break*/, 24];
                return [4 /*yield*/, User_1.default.create({
                        name: p.name,
                        phone: p.phone,
                        email: p.email,
                        password: defaultPassword,
                        role: 'PLAYER',
                        isVerified: true
                    })];
            case 23:
                player = _b.sent();
                return [3 /*break*/, 26];
            case 24:
                if (!!player.password) return [3 /*break*/, 26];
                player.password = defaultPassword;
                return [4 /*yield*/, player.save()];
            case 25:
                _b.sent();
                _b.label = 26;
            case 26:
                createdPlayers.push(player);
                _b.label = 27;
            case 27:
                _i++;
                return [3 /*break*/, 21];
            case 28: return [4 /*yield*/, Turf_1.default.find({ ownerId: owner._id })];
            case 29:
                existingTurfs = _b.sent();
                turfs = existingTurfs;
                if (!(existingTurfs.length === 0)) return [3 /*break*/, 33];
                return [4 /*yield*/, Turf_1.default.create({
                        name: 'ABC Football Arena',
                        description: 'FIFA Pro Artificial Turf with 400W Stadium Floodlights in Vannarpettai.',
                        locationDetails: 'Vannarpettai, Near Railway Station',
                        city: 'Tirunelveli',
                        location: {
                            type: 'Point',
                            coordinates: [77.7567, 8.7139]
                        },
                        ownerId: owner._id,
                        sports: ['Football', 'Box Cricket'],
                        facilities: ['FIFA Grade Turf', 'LED Floodlights', 'Changing Rooms', 'Drinking Water', 'Free Parking', 'Bibs & Balls'],
                        images: [
                            'https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1200&q=80',
                            'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'
                        ],
                        status: 'ACTIVE'
                    })];
            case 30:
                turf1 = _b.sent();
                return [4 /*yield*/, Turf_1.default.create({
                        name: 'Nellai Cricket Ground',
                        description: 'All-Weather Box Cricket & Bowling Machine Facility in Palayamkottai.',
                        locationDetails: 'Palayamkottai, Near High Ground',
                        city: 'Tirunelveli',
                        location: {
                            type: 'Point',
                            coordinates: [77.7400, 8.7100]
                        },
                        ownerId: owner._id,
                        sports: ['Box Cricket', 'Tennis'],
                        facilities: ['High Netting Enclosure', 'Bowling Machine', 'LED Lighting', 'Seating Dugouts'],
                        images: [
                            'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80'
                        ],
                        status: 'ACTIVE'
                    })];
            case 31:
                turf2 = _b.sent();
                return [4 /*yield*/, Turf_1.default.create({
                        name: 'GreenField Multisport Arena',
                        description: 'Dual Turf Complex for Football & Badminton in Perumalpuram.',
                        locationDetails: 'Perumalpuram, Near St. Xavier College',
                        city: 'Tirunelveli',
                        location: {
                            type: 'Point',
                            coordinates: [77.7200, 8.7000]
                        },
                        ownerId: owner._id,
                        sports: ['Football', 'Badminton'],
                        facilities: ['Dual Court Layout', 'Indoor Badminton Court', 'Solar Heated Showers', 'Filtered Water'],
                        images: [
                            'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80'
                        ],
                        status: 'ACTIVE'
                    })];
            case 32:
                turf3 = _b.sent();
                turfs = [turf1, turf2, turf3];
                console.log('Seeded 3 Turfs in Tirunelveli');
                return [3 /*break*/, 37];
            case 33: 
            // Refresh image URLs on existing seeded turfs
            return [4 /*yield*/, Turf_1.default.updateOne({ name: 'ABC Football Arena' }, { $set: { images: ['https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'] } })];
            case 34:
                // Refresh image URLs on existing seeded turfs
                _b.sent();
                return [4 /*yield*/, Turf_1.default.updateOne({ name: 'Nellai Cricket Ground' }, { $set: { images: ['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80'] } })];
            case 35:
                _b.sent();
                return [4 /*yield*/, Turf_1.default.updateOne({ name: 'GreenField Multisport Arena' }, { $set: { images: ['https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80'] } })];
            case 36:
                _b.sent();
                _b.label = 37;
            case 37:
                baseDate = new Date();
                baseDate.setHours(0, 0, 0, 0);
                dayOffset = -2;
                _b.label = 38;
            case 38:
                if (!(dayOffset <= 5)) return [3 /*break*/, 44];
                currentDay = new Date(baseDate);
                currentDay.setDate(baseDate.getDate() + dayOffset);
                nextDay = new Date(currentDay);
                nextDay.setDate(currentDay.getDate() + 1);
                _a = 0, turfs_1 = turfs;
                _b.label = 39;
            case 39:
                if (!(_a < turfs_1.length)) return [3 /*break*/, 43];
                turf = turfs_1[_a];
                return [4 /*yield*/, TurfSlot_1.default.countDocuments({
                        turfId: turf._id,
                        startTime: { $gte: currentDay, $lt: nextDay }
                    })];
            case 40:
                slotsCount = _b.sent();
                if (!(slotsCount === 0)) return [3 /*break*/, 42];
                slotsToInsert = [];
                for (h = 6; h < 23; h++) {
                    start = new Date(currentDay);
                    start.setHours(h, 0, 0, 0);
                    end = new Date(currentDay);
                    end.setHours(h + 1, 0, 0, 0);
                    isPeak = h >= 18 && h <= 21;
                    price = isPeak ? 1200 : (turf.name.includes('Cricket') ? 800 : 1000);
                    slotsToInsert.push({
                        turfId: turf._id,
                        startTime: start,
                        endTime: end,
                        price: price,
                        pricingType: isPeak ? 'PEAK' : 'WEEKDAY',
                        status: 'AVAILABLE'
                    });
                }
                return [4 /*yield*/, TurfSlot_1.default.insertMany(slotsToInsert)];
            case 41:
                _b.sent();
                _b.label = 42;
            case 42:
                _a++;
                return [3 /*break*/, 39];
            case 43:
                dayOffset++;
                return [3 /*break*/, 38];
            case 44: return [4 /*yield*/, Booking_1.default.countDocuments()];
            case 45:
                totalBookingsCount = _b.sent();
                if (!(totalBookingsCount < 15)) return [3 /*break*/, 53];
                console.log('Seeding rich booking matches in MongoDB...');
                return [4 /*yield*/, TurfSlot_1.default.find({ status: 'AVAILABLE' })
                        .sort({ startTime: 1 })
                        .limit(40)];
            case 46:
                allSlots = _b.sent();
                bookingTemplates = [
                    { playerIdx: 0, turfIdx: 0, status: 'CONFIRMED', payment: 'SUCCESS', method: 'UPI' },
                    { playerIdx: 1, turfIdx: 0, status: 'CONFIRMED', payment: 'SUCCESS', method: 'UPI' },
                    { playerIdx: 2, turfIdx: 1, status: 'CONFIRMED', payment: 'SUCCESS', method: 'CASH' },
                    { playerIdx: 3, turfIdx: 0, status: 'CONFIRMED', payment: 'SUCCESS', method: 'UPI' },
                    { playerIdx: 4, turfIdx: 2, status: 'CONFIRMED', payment: 'SUCCESS', method: 'UPI' },
                    { playerIdx: 5, turfIdx: 0, status: 'CONFIRMED', payment: 'PENDING', method: 'CASH' },
                    { playerIdx: 6, turfIdx: 1, status: 'CONFIRMED', payment: 'SUCCESS', method: 'UPI' },
                    { playerIdx: 7, turfIdx: 2, status: 'CONFIRMED', payment: 'SUCCESS', method: 'UPI' },
                    { playerIdx: 8, turfIdx: 0, status: 'COMPLETED', payment: 'SUCCESS', method: 'UPI' },
                    { playerIdx: 9, turfIdx: 1, status: 'COMPLETED', payment: 'SUCCESS', method: 'CASH' },
                    { playerIdx: 10, turfIdx: 0, status: 'CONFIRMED', payment: 'SUCCESS', method: 'UPI' },
                    { playerIdx: 11, turfIdx: 2, status: 'CONFIRMED', payment: 'SUCCESS', method: 'UPI' },
                    { playerIdx: 0, turfIdx: 0, status: 'COMPLETED', payment: 'SUCCESS', method: 'UPI' },
                    { playerIdx: 1, turfIdx: 0, status: 'COMPLETED', payment: 'SUCCESS', method: 'UPI' },
                    { playerIdx: 2, turfIdx: 1, status: 'CANCELLED', payment: 'REFUNDED', method: 'UPI' },
                    { playerIdx: 3, turfIdx: 0, status: 'CONFIRMED', payment: 'SUCCESS', method: 'UPI' },
                    { playerIdx: 4, turfIdx: 2, status: 'CONFIRMED', payment: 'SUCCESS', method: 'UPI' },
                ];
                slotIdx = 0;
                i = 0;
                _b.label = 47;
            case 47:
                if (!(i < bookingTemplates.length && slotIdx < allSlots.length)) return [3 /*break*/, 52];
                tmpl = bookingTemplates[i];
                slot = allSlots[slotIdx++];
                player = createdPlayers[tmpl.playerIdx % createdPlayers.length];
                turf = turfs[tmpl.turfIdx % turfs.length];
                bookingRef = "TH-".concat(Math.floor(8000 + i * 111));
                if (!(tmpl.status !== 'CANCELLED')) return [3 /*break*/, 49];
                return [4 /*yield*/, TurfSlot_1.default.updateOne({ _id: slot._id }, { status: 'BOOKED' })];
            case 48:
                _b.sent();
                _b.label = 49;
            case 49: return [4 /*yield*/, Booking_1.default.create({
                    bookingId: bookingRef,
                    userId: player._id,
                    turfId: turf._id,
                    slotId: slot._id,
                    paymentStatus: tmpl.payment,
                    status: tmpl.status,
                    paymentTransactionId: "".concat(tmpl.method, "-").concat(Date.now(), "-").concat(i),
                    qrHash: "QR-".concat(bookingRef)
                })];
            case 50:
                _b.sent();
                _b.label = 51;
            case 51:
                i++;
                return [3 /*break*/, 47];
            case 52:
                console.log("Seeded ".concat(bookingTemplates.length, " matches across all turfs in MongoDB!"));
                _b.label = 53;
            case 53: return [4 /*yield*/, Review_1.default.countDocuments()];
            case 54:
                reviewCount = _b.sent();
                if (!(reviewCount === 0)) return [3 /*break*/, 56];
                console.log('Seeding customer reviews in MongoDB...');
                return [4 /*yield*/, Review_1.default.create([
                        {
                            turfId: turfs[0]._id,
                            authorName: 'Arun Kumar',
                            turfName: 'ABC Football Arena',
                            sport: 'Football',
                            rating: 5.0,
                            date: 'Yesterday, 8:40 PM',
                            comment: 'Best artificial turf in Tirunelveli! Floodlights are top notch and the pitch bounce is very consistent.',
                            helpfulCount: 14,
                            reply: {
                                author: 'John (Owner)',
                                date: 'Yesterday',
                                text: 'Thank you Arun! We just upgraded the LED stadium floodlights last month. Looking forward to your next match!'
                            }
                        },
                        {
                            turfId: turfs[1]._id,
                            authorName: 'Karthik Ramasamy',
                            turfName: 'Nellai Cricket Ground',
                            sport: 'Box Cricket',
                            rating: 4.8,
                            date: '2 days ago',
                            comment: 'Great box cricket facility. Bowling machine speed options are excellent for practice sessions.',
                            helpfulCount: 9
                        },
                        {
                            turfId: turfs[2]._id,
                            authorName: 'Palai Smashers Team',
                            turfName: 'GreenField Multisport Arena',
                            sport: 'Badminton',
                            rating: 5.0,
                            date: '4 days ago',
                            comment: 'The wooden synthetic hybrid badminton court is very gentle on knees. Super clean changing rooms!',
                            helpfulCount: 6
                        },
                        {
                            turfId: turfs[0]._id,
                            authorName: 'Suresh Kumar (Nellai FC)',
                            turfName: 'ABC Football Arena',
                            sport: 'Football',
                            rating: 4.5,
                            date: 'Last week',
                            comment: 'Very good pitch condition. Drinking water filter is cold and refreshing after intense 90 mins matches.',
                            helpfulCount: 11
                        }
                    ])];
            case 55:
                _b.sent();
                _b.label = 56;
            case 56: return [4 /*yield*/, Offer_1.default.countDocuments()];
            case 57:
                offerCount = _b.sent();
                if (!(offerCount === 0)) return [3 /*break*/, 59];
                console.log('Seeding promo offers in MongoDB...');
                return [4 /*yield*/, Offer_1.default.create([
                        {
                            code: 'AFTERNOON20',
                            discount: '20% OFF',
                            turf: 'All Turfs in Portfolio',
                            validHours: '12:00 PM – 4:00 PM (Off-Peak)',
                            validUntil: '30 Sep 2026',
                            status: 'ACTIVE',
                            redemptions: 24
                        },
                        {
                            code: 'WEEKENDPLAY',
                            discount: '₹150 Flat OFF',
                            turf: 'Nellai Cricket Ground',
                            validHours: '6:00 AM – 9:00 AM (Early Bird)',
                            validUntil: '15 Oct 2026',
                            status: 'ACTIVE',
                            redemptions: 48
                        },
                        {
                            code: 'RAINYDAYS',
                            discount: '25% OFF',
                            turf: 'ABC Football Arena',
                            validHours: 'Monsoon Flash Discount',
                            validUntil: 'Expired',
                            status: 'EXPIRED',
                            redemptions: 42
                        }
                    ])];
            case 58:
                _b.sent();
                _b.label = 59;
            case 59: return [4 /*yield*/, Tournament_1.default.countDocuments()];
            case 60:
                tourCount = _b.sent();
                if (!(tourCount === 0)) return [3 /*break*/, 62];
                console.log('Seeding tournaments in MongoDB...');
                return [4 /*yield*/, Tournament_1.default.create([
                        {
                            title: 'Nellai Premier Night Cup 2026',
                            sport: 'Football 7v7',
                            venue: 'ABC Football Arena',
                            date: '20 Sep – 22 Sep 2026',
                            teamsLimit: 16,
                            registeredCount: 14,
                            entryFee: 2500,
                            prizePool: '₹50,000 + Trophy',
                            status: 'REGISTRATION OPEN',
                            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'
                        },
                        {
                            title: 'Tirunelveli Corporate Box Cricket Trophy',
                            sport: 'Box Cricket 6v6',
                            venue: 'Nellai Cricket Ground',
                            date: '27 Sep – 28 Sep 2026',
                            teamsLimit: 12,
                            registeredCount: 8,
                            entryFee: 2000,
                            prizePool: '₹30,000',
                            status: 'REGISTRATION OPEN',
                            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'
                        },
                        {
                            title: 'Independence Day Monsoon Cup',
                            sport: 'Football 7v7',
                            venue: 'GreenField Multisport Arena',
                            date: '15 Aug 2026',
                            teamsLimit: 16,
                            registeredCount: 16,
                            entryFee: 2000,
                            prizePool: '₹40,000',
                            status: 'COMPLETED',
                            image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80'
                        }
                    ])];
            case 61:
                _b.sent();
                _b.label = 62;
            case 62: return [4 /*yield*/, Advertisement_1.default.countDocuments()];
            case 63:
                adsCount = _b.sent();
                if (!(adsCount === 0 && advertiserUser)) return [3 /*break*/, 65];
                return [4 /*yield*/, Advertisement_1.default.create([
                        {
                            advertiserId: advertiserUser._id,
                            title: 'Nellai Pro Sports Gear 20% Off',
                            brandName: 'Nellai Sports Co.',
                            bannerUrl: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1200&q=80',
                            targetUrl: 'https://example.com/sports-gear',
                            placement: 'HERO',
                            startDate: '2026-10-01',
                            endDate: '2026-11-30',
                            budget: 15000,
                            status: 'ACTIVE',
                            impressions: 1420,
                            clicks: 184
                        },
                        {
                            advertiserId: advertiserUser._id,
                            title: 'FastRecovery Electrolytes & Hydration',
                            brandName: 'HydroSport India',
                            bannerUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',
                            targetUrl: 'https://example.com/hydration',
                            placement: 'SIDEBAR',
                            startDate: '2026-10-05',
                            endDate: '2026-11-15',
                            budget: 8000,
                            status: 'ACTIVE',
                            impressions: 890,
                            clicks: 96
                        }
                    ])];
            case 64:
                _b.sent();
                console.log('Seeded sample advertisements');
                _b.label = 65;
            case 65:
                console.log('Database seeding verified successfully');
                return [3 /*break*/, 67];
            case 66:
                err_1 = _b.sent();
                console.error('Database seeding error:', err_1);
                return [3 /*break*/, 67];
            case 67: return [2 /*return*/];
        }
    });
}); };
exports.seedDatabase = seedDatabase;
// Generator to insert N random new bookings dynamically into MongoDB Atlas
var generateRandomBookings = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (count) {
        var owner, turfs, createdBookings, paymentMethods, statuses, i, randName, randPhone, player, turf, dayOffset, slotDate, hour, slotEndDate, price, slot, bookingRef, paymentMethod, status_1, booking, error_1;
        if (count === void 0) { count = 5; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 15, , 16]);
                    return [4 /*yield*/, User_1.default.findOne({ phone: '9443182940' })];
                case 1:
                    owner = _a.sent();
                    if (!!owner) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, exports.seedDatabase)()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, Turf_1.default.find()];
                case 4:
                    turfs = _a.sent();
                    if (!(turfs.length === 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, exports.seedDatabase)()];
                case 5:
                    _a.sent();
                    return [2 /*return*/, []];
                case 6:
                    createdBookings = [];
                    paymentMethods = ['UPI', 'CASH', 'UPI', 'UPI'];
                    statuses = ['CONFIRMED', 'CONFIRMED', 'COMPLETED', 'CONFIRMED'];
                    i = 0;
                    _a.label = 7;
                case 7:
                    if (!(i < count)) return [3 /*break*/, 14];
                    randName = RANDOM_PLAYER_NAMES[Math.floor(Math.random() * RANDOM_PLAYER_NAMES.length)];
                    randPhone = '98' + Math.floor(10000000 + Math.random() * 89999999);
                    return [4 /*yield*/, User_1.default.findOne({ name: randName })];
                case 8:
                    player = _a.sent();
                    if (!!player) return [3 /*break*/, 10];
                    return [4 /*yield*/, User_1.default.create({
                            name: randName,
                            phone: randPhone,
                            email: "".concat(randName.toLowerCase().replace(/\s+/g, ''), "@gmail.com"),
                            role: 'PLAYER',
                            isVerified: true
                        })];
                case 9:
                    player = _a.sent();
                    _a.label = 10;
                case 10:
                    turf = turfs[Math.floor(Math.random() * turfs.length)];
                    dayOffset = Math.floor(Math.random() * 4);
                    slotDate = new Date();
                    slotDate.setDate(slotDate.getDate() + dayOffset);
                    hour = 6 + Math.floor(Math.random() * 16);
                    slotDate.setHours(hour, 0, 0, 0);
                    slotEndDate = new Date(slotDate);
                    slotEndDate.setHours(hour + 1, 0, 0, 0);
                    price = hour >= 18 ? 1200 : (turf.name.includes('Cricket') ? 800 : 1000);
                    return [4 /*yield*/, TurfSlot_1.default.create({
                            turfId: turf._id,
                            startTime: slotDate,
                            endTime: slotEndDate,
                            price: price,
                            pricingType: hour >= 18 ? 'PEAK' : 'WEEKDAY',
                            status: 'BOOKED'
                        })];
                case 11:
                    slot = _a.sent();
                    bookingRef = "TH-".concat(Math.floor(1000 + Math.random() * 8999));
                    paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                    status_1 = statuses[Math.floor(Math.random() * statuses.length)];
                    return [4 /*yield*/, Booking_1.default.create({
                            bookingId: bookingRef,
                            userId: player._id,
                            turfId: turf._id,
                            slotId: slot._id,
                            paymentStatus: status_1 === 'CANCELLED' ? 'REFUNDED' : 'SUCCESS',
                            status: status_1,
                            paymentTransactionId: "".concat(paymentMethod, "-").concat(Date.now(), "-").concat(i),
                            qrHash: "QR-".concat(bookingRef)
                        })];
                case 12:
                    booking = _a.sent();
                    createdBookings.push(booking);
                    _a.label = 13;
                case 13:
                    i++;
                    return [3 /*break*/, 7];
                case 14:
                    console.log("Generated and inserted ".concat(createdBookings.length, " random bookings directly into MongoDB!"));
                    return [2 /*return*/, createdBookings];
                case 15:
                    error_1 = _a.sent();
                    console.error('generateRandomBookings error:', error_1);
                    return [2 /*return*/, []];
                case 16: return [2 /*return*/];
            }
        });
    });
};
exports.generateRandomBookings = generateRandomBookings;
