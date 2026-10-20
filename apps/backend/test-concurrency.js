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
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
var db_1 = require("./src/config/db");
var app_1 = require("./src/app");
var User_1 = require("./src/models/User");
var Turf_1 = require("./src/models/Turf");
var TurfSlot_1 = require("./src/models/TurfSlot");
var jsonwebtoken_1 = require("jsonwebtoken");
var runTest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var server, user1, user2, owner, turf, slot, token1, token2, req1, req2, _a, res1, res2, body1, body2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, db_1.connectDB)()];
            case 1:
                _b.sent();
                server = app_1.default.listen(5001, function () {
                    console.log('Test Server running on port 5001');
                });
                return [4 /*yield*/, User_1.default.create({ name: 'User 1', phone: '1234567890', role: 'PLAYER' })];
            case 2:
                user1 = _b.sent();
                return [4 /*yield*/, User_1.default.create({ name: 'User 2', phone: '0987654321', role: 'PLAYER' })];
            case 3:
                user2 = _b.sent();
                return [4 /*yield*/, User_1.default.create({ name: 'Owner', phone: '1122334455', role: 'TURF_OWNER' })];
            case 4:
                owner = _b.sent();
                return [4 /*yield*/, Turf_1.default.create({
                        name: 'Test Turf',
                        locationDetails: 'City Center',
                        city: 'Tirunelveli',
                        location: { type: 'Point', coordinates: [77.71, 8.71] },
                        ownerId: owner._id.toString()
                    })];
            case 5:
                turf = _b.sent();
                return [4 /*yield*/, TurfSlot_1.default.create({
                        turfId: turf._id.toString(),
                        startTime: new Date(),
                        endTime: new Date(Date.now() + 3600000),
                        price: 100,
                        pricingType: 'WEEKDAY',
                        status: 'AVAILABLE'
                    })];
            case 6:
                slot = _b.sent();
                console.log("Created Slot ID: ".concat(slot._id));
                console.log('Firing simultaneous booking requests...');
                token1 = jsonwebtoken_1.default.sign({ userId: user1._id, role: user1.role }, process.env.JWT_SECRET || 'secret');
                token2 = jsonwebtoken_1.default.sign({ userId: user2._id, role: user2.role }, process.env.JWT_SECRET || 'secret');
                req1 = fetch('http://localhost:5001/api/bookings/initiate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer ".concat(token1) },
                    body: JSON.stringify({ slotId: slot._id })
                });
                req2 = fetch('http://localhost:5001/api/bookings/initiate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer ".concat(token2) },
                    body: JSON.stringify({ slotId: slot._id })
                });
                return [4 /*yield*/, Promise.all([req1, req2])];
            case 7:
                _a = _b.sent(), res1 = _a[0], res2 = _a[1];
                return [4 /*yield*/, res1.json()];
            case 8:
                body1 = _b.sent();
                return [4 /*yield*/, res2.json()];
            case 9:
                body2 = _b.sent();
                console.log("Request 1 Status: ".concat(res1.status, ", Response:"), body1);
                console.log("Request 2 Status: ".concat(res2.status, ", Response:"), body2);
                if ((res1.status === 201 && res2.status === 409) || (res1.status === 409 && res2.status === 201)) {
                    console.log('✅ Concurrency test PASSED! Redis lock successfully prevented double booking.');
                }
                else {
                    console.error('❌ Concurrency test FAILED.');
                }
                server.close();
                return [4 /*yield*/, (0, db_1.closeDB)()];
            case 10:
                _b.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); };
runTest().catch(console.error);
