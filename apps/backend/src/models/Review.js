"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ReviewSchema = new mongoose_1.Schema({
    turfId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Turf', required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, required: true },
    turfName: { type: String, required: true },
    sport: { type: String, default: 'Football' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: String, default: 'Recently' },
    comment: { type: String, required: true },
    helpfulCount: { type: Number, default: 0 },
    reply: {
        author: { type: String },
        date: { type: String },
        text: { type: String }
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Review', ReviewSchema);
