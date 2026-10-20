"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var OfferSchema = new mongoose_1.Schema({
    code: { type: String, required: true, uppercase: true, unique: true },
    discount: { type: String, required: true },
    turf: { type: String, default: 'All Turfs in Portfolio' },
    validHours: { type: String, default: '12:00 PM – 4:00 PM (Off-Peak)' },
    validUntil: { type: String, default: '30 Sep 2026' },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'PAUSED'], default: 'ACTIVE' },
    redemptions: { type: Number, default: 0 }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Offer', OfferSchema);
