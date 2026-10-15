'use client';

import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Plus, Sparkles, TrendingUp, Eye, MousePointerClick, 
  IndianRupee, Trash2, Edit2, Play, Pause, ExternalLink, Calendar, 
  Check, AlertCircle, RefreshCw, BarChart2, ShieldAlert, Loader2, Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  getAdvertisements, createAdvertisement, 
  updateAdvertisement, deleteAdvertisement 
} from '@/services/api';
import { useUserRole } from '@/context/UserRoleContext';
import { cn } from '@/lib/utils';

interface AdItem {
  _id: string;
  title: string;
  description?: string;
  bannerUrl: string;
  targetUrl: string;
  placement: 'HOME_HERO' | 'SIDEBAR' | 'SEARCH_BANNER' | 'POPUP';
  budget?: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export default function AdvertisementsPage() {
  const { isAuthenticated, isAdvertiser, isAdmin, isOwner, currentRole } = useUserRole();
  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPlacement, setFilterPlacement] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formBannerUrl, setFormBannerUrl] = useState('');
  const [formTargetUrl, setFormTargetUrl] = useState('');
  const [formPlacement, setFormPlacement] = useState<'HOME_HERO' | 'SIDEBAR' | 'SEARCH_BANNER' | 'POPUP'>('HOME_HERO');
  const [formBudget, setFormBudget] = useState('5000');
  const [formStartDate, setFormStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await getAdvertisements();
      if (res.data?.success && Array.isArray(res.data.data)) {
        setAds(res.data.data);
      } else {
        setAds([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch advertisements:', err);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [isAuthenticated, currentRole]);

  const resetForm = () => {
    setEditingAd(null);
    setFormTitle('');
    setFormDesc('');
    setFormBannerUrl('');
    setFormTargetUrl('');
    setFormPlacement('HOME_HERO');
    setFormBudget('5000');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setFormEndDate(d.toISOString().split('T')[0]);
    setErrorMsg(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (ad: AdItem) => {
    setEditingAd(ad);
    setFormTitle(ad.title);
    setFormDesc(ad.description || '');
    setFormBannerUrl(ad.bannerUrl);
    setFormTargetUrl(ad.targetUrl);
    setFormPlacement(ad.placement);
    setFormBudget(String(ad.budget || 5000));
    setFormStartDate(ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '');
    setFormEndDate(ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : '');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formBannerUrl.trim() || !formTargetUrl.trim()) {
      setErrorMsg('Please fill in Campaign Title, Banner Image URL, and Target URL.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      const payload = {
        title: formTitle.trim(),
        description: formDesc.trim(),
        bannerUrl: formBannerUrl.trim(),
        targetUrl: formTargetUrl.trim(),
        placement: formPlacement,
        budget: Number(formBudget) || 0,
        startDate: formStartDate ? new Date(formStartDate).toISOString() : undefined,
        endDate: formEndDate ? new Date(formEndDate).toISOString() : undefined,
      };

      if (editingAd) {
        await updateAdvertisement(editingAd._id, payload);
        setSuccessMsg('Campaign updated successfully!');
      } else {
        await createAdvertisement(payload);
        setSuccessMsg('New campaign launched successfully!');
      }

      setIsModalOpen(false);
      resetForm();
      fetchCampaigns();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error('Error saving campaign:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save campaign. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (ad: AdItem) => {
    const nextStatus = ad.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      await updateAdvertisement(ad._id, { status: nextStatus });
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      alert('Could not change campaign status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this sponsorship campaign?')) return;
    try {
      await deleteAdvertisement(id);
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to delete ad:', err);
      alert('Could not delete advertisement.');
    }
  };

  // Metrics
  const activeCount = ads.filter(a => a.status === 'ACTIVE').length;
  const totalImpressions = ads.reduce((sum, a) => sum + (a.impressions || 0), 0);
  const totalClicks = ads.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const totalBudget = ads.reduce((sum, a) => sum + (a.budget || 0), 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  const filteredAds = filterPlacement === 'ALL' 
    ? ads 
    : ads.filter(a => a.placement === filterPlacement);

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Megaphone className="w-7 h-7 text-primary" />
              Campaign Manager & Sponsorships
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold">
              {isAdvertiser ? 'Advertiser Portal' : 'Admin Oversight'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Publish targeted promotional banners across match passes, venue discovery, and player search portals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCampaigns}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground transition-colors"
            title="Refresh campaigns"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Launch Campaign
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="bg-card/50 backdrop-blur-xs border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Ads</span>
              <Play className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-foreground">{activeCount}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Of {ads.length} total campaigns</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xs border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Impressions</span>
              <Eye className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-foreground">{totalImpressions.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Player venue views</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xs border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Clicks</span>
              <MousePointerClick className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-black text-foreground">{totalClicks.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Brand interactions</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xs border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Avg CTR</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-foreground">{ctr}%</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Click-through rate</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xs border-border col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Budget</span>
              <IndianRupee className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-foreground">₹{totalBudget.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Allocated spend</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'HOME_HERO', 'SIDEBAR', 'SEARCH_BANNER', 'POPUP'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterPlacement(tab)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
              filterPlacement === tab 
                ? "bg-primary text-primary-foreground border-primary shadow-xs" 
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Campaigns Listing */}
      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
          <p className="text-xs font-bold text-muted-foreground">Loading marketing campaigns...</p>
        </div>
      ) : filteredAds.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-foreground text-base">No Sponsorship Campaigns Found</h3>
            <p className="text-xs text-muted-foreground">
              {filterPlacement === 'ALL' 
                ? 'Launch high-visibility banners to promote sports equipment, coaching academies, or energy drinks to thousands of active athletes.'
                : `No active campaigns found in the ${filterPlacement.replace('_', ' ')} slot.`}
            </p>
            <button
              onClick={openCreateModal}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary-hover shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Create First Campaign
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAds.map((ad) => (
            <Card key={ad._id} className="overflow-hidden flex flex-col border-border bg-card hover:shadow-md transition-shadow">
              {/* Banner Image Preview */}
              <div className="relative h-40 w-full bg-muted/40 overflow-hidden group">
                <img 
                  src={ad.bannerUrl} 
                  alt={ad.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <Badge 
                    className={cn(
                      "text-[10px] font-black uppercase tracking-wider",
                      ad.status === 'ACTIVE' 
                        ? "bg-emerald-500/90 text-white" 
                        : "bg-muted/90 text-muted-foreground"
                    )}
                  >
                    {ad.status}
                  </Badge>
                  <Badge className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold border-none">
                    {ad.placement.replace('_', ' ')}
                  </Badge>
                </div>

                <a 
                  href={ad.targetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black text-white text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Target URL
                </a>
              </div>

              {/* Campaign Content */}
              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-foreground text-sm line-clamp-1">{ad.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {ad.description || 'Promotional sponsorship banner.'}
                  </p>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-muted/30 border border-border/50 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground block">Views</span>
                    <span className="text-xs font-black text-foreground">{(ad.impressions || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground block">Clicks</span>
                    <span className="text-xs font-black text-primary">{(ad.clicks || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground block">Budget</span>
                    <span className="text-xs font-black text-foreground">₹{(ad.budget || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <button
                    onClick={() => handleToggleStatus(ad)}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors",
                      ad.status === 'ACTIVE' 
                        ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" 
                        : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                    )}
                  >
                    {ad.status === 'ACTIVE' ? (
                      <>
                        <Pause className="w-3 h-3" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        Resume
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(ad)}
                      className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Campaign"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ad._id)}
                      className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/20 text-rose-500 transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-foreground text-base">
                    {editingAd ? 'Edit Campaign' : 'Launch New Campaign'}
                  </h2>
                  <p className="text-[11px] text-muted-foreground">Configure banner placement and budget</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">Campaign Headline *</label>
                <input 
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. 20% Off Kipsta Pro Football Boots"
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/30 text-foreground font-medium focus:outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Campaign Description</label>
                <textarea 
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Short marketing hook for players..."
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/30 text-foreground font-medium focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">Banner Placement *</label>
                  <select 
                    value={formPlacement}
                    onChange={(e: any) => setFormPlacement(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-muted/30 text-foreground font-medium focus:outline-hidden focus:border-primary"
                  >
                    <option value="HOME_HERO">Home Page Hero</option>
                    <option value="SIDEBAR">Sidebar Sponsor</option>
                    <option value="SEARCH_BANNER">Search Results Banner</option>
                    <option value="POPUP">Match Pass Confirmation Modal</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Campaign Budget (₹)</label>
                  <input 
                    type="number"
                    min="500"
                    step="500"
                    value={formBudget}
                    onChange={(e) => setFormBudget(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-muted/30 text-foreground font-medium focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Banner Image URL *</label>
                <input 
                  type="url"
                  required
                  value={formBannerUrl}
                  onChange={(e) => setFormBannerUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1518604666860-9ed391f76460"
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/30 text-foreground font-medium focus:outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Target Click-Through URL *</label>
                <input 
                  type="url"
                  required
                  value={formTargetUrl}
                  onChange={(e) => setFormTargetUrl(e.target.value)}
                  placeholder="https://decathlon.in/products/football-boots"
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/30 text-foreground font-medium focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">Start Date</label>
                  <input 
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-muted/30 text-foreground font-medium focus:outline-hidden focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">End Date</label>
                  <input 
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-muted/30 text-foreground font-medium focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary-hover shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? 'Saving...' : editingAd ? 'Update Campaign' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
