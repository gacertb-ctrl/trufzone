"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var adController_1 = require("../controllers/adController");
var authMiddleware_1 = require("../middleware/authMiddleware");
var router = (0, express_1.Router)();
// Public route to view active banners on homepage / marketplace
router.get('/public', adController_1.getPublicActiveAds);
router.get('/public/active', adController_1.getPublicActiveAds);
// Authenticated Advertiser & Admin endpoints
router.use(authMiddleware_1.requireAuth);
router.get('/', (0, authMiddleware_1.requireRole)(['ADVERTISER', 'ADMIN']), adController_1.getAdvertisements);
router.post('/', (0, authMiddleware_1.requireRole)(['ADVERTISER', 'ADMIN']), adController_1.createAdvertisement);
router.put('/:id', (0, authMiddleware_1.requireRole)(['ADVERTISER', 'ADMIN']), adController_1.updateAdvertisement);
router.delete('/:id', (0, authMiddleware_1.requireRole)(['ADVERTISER', 'ADMIN']), adController_1.deleteAdvertisement);
exports.default = router;
