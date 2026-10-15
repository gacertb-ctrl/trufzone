import mongoose, { Schema, Document } from 'mongoose';
import { IAdvertisement } from '@turfhub/shared-types';

export interface IAdvertisementDocument extends Omit<IAdvertisement, '_id' | 'createdAt' | 'updatedAt'>, Document {}

const AdvertisementSchema: Schema = new Schema({
  advertiserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  brandName: { type: String, required: true },
  bannerUrl: { type: String, required: true },
  targetUrl: { type: String, required: true },
  placement: { 
    type: String, 
    enum: ['HERO', 'HOME_HERO', 'SIDEBAR', 'POPUP', 'FOOTER', 'SEARCH_BANNER'], 
    default: 'HERO' 
  },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  budget: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'PAUSED', 'PENDING', 'EXPIRED'], 
    default: 'ACTIVE' 
  },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IAdvertisementDocument>('Advertisement', AdvertisementSchema);
