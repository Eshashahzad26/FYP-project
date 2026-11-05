import { 
  Product, 
  BrandInfo, 
  UserProfile, 
  StitchingRateConfig, 
  Order, 
  SavedOutfit, 
  SharedTryOn, 
  FamilyOpinion,
  AdminAuditLog 
} from '../database/types.ts';

export const apiClient = {
  // Products
  async getProducts(params?: { category?: string; brand?: string; occasion?: string; search?: string; sort?: string; maxPrice?: number }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.brand) query.set('brand', params.brand);
    if (params?.occasion) query.set('occasion', params.occasion);
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.maxPrice) query.set('maxPrice', String(params.maxPrice));
    
    const res = await fetch(`/api/products?${query.toString()}`);
    const data = await res.json();
    return data.products || [];
  },

  async getProductById(id: string): Promise<Product | null> {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    return data.product || null;
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create product');
    return data.product;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    return data.product;
  },

  async deleteProduct(id: string): Promise<{ success: boolean; deactivated?: boolean; message?: string }> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Brands
  async getBrands(): Promise<BrandInfo[]> {
    const res = await fetch('/api/brands');
    const data = await res.json();
    return data.brands || [];
  },

  async updateBrandSizeChart(brandId: string, sizeChart: any[]): Promise<BrandInfo> {
    const res = await fetch(`/api/brands/${brandId}/sizechart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sizeChart }),
    });
    const data = await res.json();
    return data.brand;
  },

  // Stitching Rates
  async getStitchingRates(): Promise<StitchingRateConfig> {
    const res = await fetch('/api/stitching-rates');
    const data = await res.json();
    return data.rates;
  },

  async updateStitchingRates(rates: Partial<StitchingRateConfig>): Promise<StitchingRateConfig> {
    const res = await fetch('/api/stitching-rates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rates),
    });
    const data = await res.json();
    return data.rates;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch('/api/orders');
    const data = await res.json();
    return data.orders || [];
  },

  async placeOrder(orderPayload: any): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to place order');
    return data.order;
  },

  async updateOrderStatus(orderId: string, status: string, note?: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    const data = await res.json();
    return data.order;
  },

  async cancelOrder(orderId: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to cancel order');
    return data.order;
  },

  // Saved Outfits & Family Opinion
  async getSavedOutfits(): Promise<SavedOutfit[]> {
    const res = await fetch('/api/saved-outfits');
    const data = await res.json();
    return data.savedOutfits || [];
  },

  async saveOutfit(payload: any): Promise<{ outfit: SavedOutfit; shareId: string }> {
    const res = await fetch('/api/saved-outfits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  },

  async deleteSavedOutfit(id: string): Promise<boolean> {
    const res = await fetch(`/api/saved-outfits/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  async getSharedTryOn(shareId: string): Promise<SharedTryOn> {
    const res = await fetch(`/api/opinions/${shareId}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Shared outfit not found');
    return data.shared;
  },

  async submitFamilyOpinion(shareId: string, opinion: { authorName: string; relationship: string; vote: string; comment: string }): Promise<FamilyOpinion> {
    const res = await fetch(`/api/opinions/${shareId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opinion),
    });
    const data = await res.json();
    return data.opinion;
  },

  async toggleShareLink(shareId: string): Promise<boolean> {
    const res = await fetch(`/api/opinions/${shareId}/toggle`, { method: 'PATCH' });
    const data = await res.json();
    return data.isActive;
  },

  // User Profile
  async getUserProfile(): Promise<UserProfile> {
    const res = await fetch('/api/user/profile');
    const data = await res.json();
    return data.profile;
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    return data.profile;
  },

  // Admin Stats
  async getAdminStats(): Promise<{ stats: any; auditLogs: AdminAuditLog[] }> {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    return data;
  },

  // Gemini AI Styling
  async getGeminiStylingAdvice(params: any): Promise<{ advice: any; source: string }> {
    const res = await fetch('/api/gemini/styling-advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  },

  async getGeminiDulhanLook(params: any): Promise<{ looks: any; source: string }> {
    const res = await fetch('/api/gemini/dulhan-look', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  },

  async getGeminiMixMatch(budget: number, occasion: string): Promise<{ combination: any; source: string }> {
    const res = await fetch('/api/gemini/mix-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ budget, occasion }),
    });
    return await res.json();
  },

  async analyzePhoto(imageBase64: string, heightCm: number): Promise<{ analysis: any; source: string }> {
    const res = await fetch('/api/gemini/analyze-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, heightCm }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to analyze photo');
    return data;
  }
};
