import { Router } from 'express';
import { 
  getAdvertisements, 
  createAdvertisement, 
  updateAdvertisement, 
  deleteAdvertisement, 
  getPublicActiveAds 
} from '../controllers/adController';
import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Public route to view active banners on homepage / marketplace
router.get('/public', getPublicActiveAds);
router.get('/public/active', getPublicActiveAds);

// Authenticated Advertiser & Admin endpoints
router.use(requireAuth);
router.get('/', requireRole(['ADVERTISER', 'ADMIN']), getAdvertisements);
router.post('/', requireRole(['ADVERTISER', 'ADMIN']), createAdvertisement);
router.put('/:id', requireRole(['ADVERTISER', 'ADMIN']), updateAdvertisement);
router.delete('/:id', requireRole(['ADVERTISER', 'ADMIN']), deleteAdvertisement);

export default router;
