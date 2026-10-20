"use strict";
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
var express_1 = require("express");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
// Ensure environment variables are loaded
dotenv_1.default.config();
var bookingRoutes_1 = require("./routes/bookingRoutes");
var authRoutes_1 = require("./routes/authRoutes");
var turfRoutes_1 = require("./routes/turfRoutes");
var ownerRoutes_1 = require("./routes/ownerRoutes");
var adRoutes_1 = require("./routes/adRoutes");
var app = (0, express_1.default)();
// Parse and normalize allowed origins from environment variables
var configuredOrigins = __spreadArray(__spreadArray([
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL
], (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []), true), [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
], false).filter(Boolean)
    .map(function (origin) { return origin.trim().replace(/\/+$/, ''); });
var corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) {
            return callback(null, true);
        }
        var normalizedOrigin = origin.trim().replace(/\/+$/, '');
        // Check if origin matches allowed origins list
        if (configuredOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }
        // Allow any Vercel deployment (*.vercel.app) including preview URLs
        try {
            var parsed = new URL(normalizedOrigin);
            if (parsed.hostname.endsWith('.vercel.app')) {
                return callback(null, true);
            }
        }
        catch (_a) {
            // Invalid origin URL format
        }
        // In non-production environments, permit all origins for convenience
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        console.warn("[CORS Blocked] Origin not allowed: ".concat(origin));
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
    ],
    optionsSuccessStatus: 200,
};
// Enable CORS with preflight handling for all routes
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Prevent browser and proxy caching of sensitive API responses (bfcache / back button security)
app.use(function (req, res, next) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});
app.get('/api/health', function (req, res) {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/turfs', turfRoutes_1.default);
app.use('/api/owner', ownerRoutes_1.default);
app.use('/api/ads', adRoutes_1.default);
exports.default = app;
