"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var RegisteredTeamSchema = new mongoose_1.Schema({
    teamName: { type: String, required: true },
    captainName: { type: String, required: true },
    captainPhone: { type: String, required: true },
    membersCount: { type: Number, default: 7 },
    registeredAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'APPROVED', 'REJECTED'], default: 'CONFIRMED' }
});
var TournamentSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    sport: { type: String, default: 'Football 7v7' },
    venue: { type: String, default: 'ABC Football Arena' },
    date: { type: String, required: true },
    teamsLimit: { type: Number, default: 16 },
    registeredCount: { type: Number, default: 0 },
    registeredTeams: { type: [RegisteredTeamSchema], default: [] },
    organizerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    entryFee: { type: Number, default: 2000 },
    prizePool: { type: String, default: '₹50,000 + Trophy' },
    status: { type: String, enum: ['REGISTRATION OPEN', 'IN PROGRESS', 'COMPLETED'], default: 'REGISTRATION OPEN' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80' }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Tournament', TournamentSchema);
