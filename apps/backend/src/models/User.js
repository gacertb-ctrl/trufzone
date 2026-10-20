"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, sparse: true },
    email: { type: String, sparse: true },
    password: { type: String },
    googleId: { type: String, sparse: true },
    avatar: { type: String },
    role: { type: String, enum: ['PLAYER', 'TURF_OWNER', 'TURF_ADMIN', 'ADMIN', 'ADVERTISER', 'STAFF'], default: 'PLAYER' },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    lastLogoutAt: { type: Date },
    tokenVersion: { type: Number, default: 0 }
}, { timestamps: true });
exports.default = mongoose_1.default.model('User', UserSchema);
