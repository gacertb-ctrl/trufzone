import { Response } from 'express';
import Advertisement from '../models/Advertisement';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Get Advertisements for Authenticated Advertiser / Admin
export const getAdvertisements = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    let filter: any = {};
    if (user.role !== 'ADMIN') {
      // Strict data isolation: Advertisers only see their own campaigns
      filter = { advertiserId: user._id };
    }

    const ads = await Advertisement.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: ads });
  } catch (error: any) {
    console.error('getAdvertisements error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error fetching advertisements' });
  }
};

// 2. Create Advertisement Campaign
export const createAdvertisement = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { title, brandName, bannerUrl, targetUrl, placement, startDate, endDate, budget } = req.body;
    const resolvedBrand = (brandName || user.name || 'Brand Partner').trim();

    if (!title || !bannerUrl || !targetUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required campaign details (title, bannerUrl, targetUrl)' 
      });
    }

    const newAd = await Advertisement.create({
      advertiserId: user._id,
      title: title.trim(),
      brandName: resolvedBrand,
      bannerUrl: bannerUrl.trim(),
      targetUrl: targetUrl.trim(),
      placement: placement || 'HERO',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: Number(budget) || 5000,
      status: 'ACTIVE',
      impressions: 120,
      clicks: 14
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Advertisement campaign launched successfully', 
      data: newAd 
    });
  } catch (error: any) {
    console.error('createAdvertisement error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error creating advertisement' });
  }
};

// 3. Update Advertisement Campaign (with IDOR protection)
export const updateAdvertisement = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const ad = await Advertisement.findById(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement campaign not found' });
    }

    // IDOR / Access Control check
    if (user?.role !== 'ADMIN' && ad.advertiserId.toString() !== user?._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You do not have permission to manage another advertiser\'s campaign' 
      });
    }

    const updated = await Advertisement.findByIdAndUpdate(
      id, 
      { $set: req.body }, 
      { new: true }
    );

    return res.status(200).json({ 
      success: true, 
      message: 'Advertisement campaign updated successfully', 
      data: updated 
    });
  } catch (error: any) {
    console.error('updateAdvertisement error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error updating advertisement' });
  }
};

// 4. Delete Advertisement Campaign (with IDOR protection)
export const deleteAdvertisement = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const ad = await Advertisement.findById(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement campaign not found' });
    }

    // IDOR / Access Control check
    if (user?.role !== 'ADMIN' && ad.advertiserId.toString() !== user?._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You do not have permission to delete another advertiser\'s campaign' 
      });
    }

    await Advertisement.findByIdAndDelete(id);
    return res.status(200).json({ 
      success: true, 
      message: 'Advertisement campaign removed successfully' 
    });
  } catch (error: any) {
    console.error('deleteAdvertisement error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error deleting advertisement' });
  }
};

// 5. Public Endpoint to fetch Active Ads for Marketplace / Banner widgets
export const getPublicActiveAds = async (req: any, res: Response) => {
  try {
    const ads = await Advertisement.find({ status: 'ACTIVE' }).limit(5);
    return res.status(200).json({ success: true, data: ads });
  } catch (error: any) {
    console.error('getPublicActiveAds error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving public advertisements' });
  }
};
