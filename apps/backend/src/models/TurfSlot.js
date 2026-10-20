"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var TurfSlotSchema = new mongoose_1.Schema({
    turfId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Turf', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true },
    pricingType: { type: String, enum: ['WEEKDAY', 'WEEKEND', 'PEAK', 'HOLIDAY'], default: 'WEEKDAY' },
    status: { type: String, enum: ['AVAILABLE', 'LOCKED', 'BOOKED', 'BLOCKED'], default: 'AVAILABLE' },
    lockExpiresAt: { type: Date }
}, { timestamps: true });
// Indexes to quickly find available slots for a turf on a specific day
TurfSlotSchema.index({ turfId: 1, startTime: 1, status: 1 });
// Index for automatic lock expiration in DB (TTL index as backup to Redis)
TurfSlotSchema.index({ lockExpiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { status: 'LOCKED' } });
exports.default = mongoose_1.default.model('TurfSlot', TurfSlotSchema);
