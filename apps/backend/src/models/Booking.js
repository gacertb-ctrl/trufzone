"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var BookingSchema = new mongoose_1.Schema({
    bookingId: { type: String, required: true, unique: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    turfId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Turf', required: true },
    slotId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TurfSlot', required: true },
    paymentStatus: { type: String, enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    status: { type: String, enum: ['PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'EXPIRED', 'REFUNDED'], default: 'PAYMENT_PENDING' },
    paymentTransactionId: { type: String },
    qrHash: { type: String }
}, { timestamps: true });
BookingSchema.index({ userId: 1 });
BookingSchema.index({ turfId: 1, status: 1 });
exports.default = mongoose_1.default.model('Booking', BookingSchema);
