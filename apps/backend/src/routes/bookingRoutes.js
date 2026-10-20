"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bookingController_1 = require("../controllers/bookingController");
var authMiddleware_1 = require("../middleware/authMiddleware");
var router = (0, express_1.Router)();
// Public booking endpoint (open to players / guests)
router.post('/public', bookingController_1.publicBookTurf);
// Protected routes (require user authentication)
router.use(authMiddleware_1.requireAuth);
router.get('/my-bookings', bookingController_1.getMyBookings);
router.post('/initiate', bookingController_1.initiateBooking);
router.post('/verify', bookingController_1.verifyBooking);
exports.default = router;
