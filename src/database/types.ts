export type GarmentCategory = 
  | 'Shalwar Kameez'
  | 'Kurti'
  | 'Abaya'
  | 'Lehenga'
  | 'Bridal Wear'
  | 'Dupatta'
  | 'Accessories';

export type PakistaniBrand = 
  | 'Khaadi'
  | 'Sapphire'
  | 'Maria.B'
  | 'Sana Safinaz'
  | 'Baroque'
  | 'Gul Ahmed'
  | 'Asim Jofa';

export type GarmentFabric = 
  | 'Lawn'
  | 'Chiffon'
  | 'Silk'
  | 'Velvet'
  | 'Organza'
  | 'Cotton'
  | 'Jacquard'
  | 'Net'
  | 'Khaddar';

export type OccasionType = 
  | 'Daily Wear'
  | 'Casual'
  | 'Semi-Formal'
  | 'Formal'
  | 'Eid'
  | 'Mehndi'
  | 'Barat'
  | 'Walima'
  | 'Wedding Guest';

export type BodyShape = 'Hourglass' | 'Pear' | 'Rectangle' | 'Apple' | 'Inverted Triangle';

export type SkinTone = 'Fair' | 'Medium' | 'Olive' | 'Dark';
export type SkinUndertone = 'Warm' | 'Cool' | 'Neutral';

export interface SizeMeasurement {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  bust: number;     // inches
  waist: number;    // inches
  hips: number;     // inches
  shoulder: number; // inches
  length: number;   // inches
}

export interface BrandInfo {
  id: string;
  name: PakistaniBrand;
  logo: string;
  description: string;
  sizeChart: SizeMeasurement[];
}

export interface Product {
  id: string;
  name: string;
  brand: PakistaniBrand;
  category: GarmentCategory;
  price: number; // in PKR
  originalPrice?: number;
  color: string;
  colorHex: string;
  fabric: GarmentFabric;
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL')[];
  stock: Record<string, number>; // size -> quantity
  inStock: boolean;
  occasion: OccasionType;
  images: string[];
  description: string;
  popularity: number; // 1-100 score
  createdAt: string;
  isActive: boolean;
  pieces?: '1-Piece' | '2-Piece' | '3-Piece';
  matchingDupattas?: string[]; // IDs or descriptions
}

export interface UserMeasurements {
  heightCm: number;
  bustInches: number;
  waistInches: number;
  hipsInches: number;
  shoulderInches: number;
}

export interface BodyAnalysisResult {
  bodyShape: BodyShape;
  measurements: UserMeasurements;
  skinTone: SkinTone;
  skinUndertone: SkinUndertone;
  confidenceScore: number;
  notes: string;
  photoUrl?: string;
  analyzedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
  addresses: DeliveryAddress[];
  measurements?: UserMeasurements;
  bodyAnalysis?: BodyAnalysisResult;
  favoriteColors: string[];
  preferredStyles: string[];
  styleProfileNotes?: string[];
  role: 'customer' | 'admin';
}

export interface DeliveryAddress {
  id: string;
  title: string; // e.g. "Home", "Office"
  recipientName: string;
  phone: string;
  addressLine: string;
  city: string;
  isDefault: boolean;
}

export interface CartItem {
  id: string; // unique item cart id
  productId: string;
  product: Product;
  selectedSize: 'XS' | 'S' | 'M' | 'L' | 'XL';
  selectedColor: string;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string; // e.g. HAA-2026-9481
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  deliveryAddress: DeliveryAddress;
  items: {
    productId: string;
    productName: string;
    brand: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
    image: string;
  }[];
  paymentMethod: 'Cash on Delivery';
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string; note?: string }[];
  createdAt: string;
  canCancel: boolean;
}

export interface SavedOutfit {
  id: string;
  userId: string;
  title: string;
  product: Product;
  userPhotoUrl: string;
  tryOnResultUrl: string;
  savedAt: string;
  notes?: string;
  shareId?: string;
}

export interface FamilyOpinion {
  id: string;
  authorName: string;
  relationship: 'Mother' | 'Sister' | 'Friend' | 'Cousin' | 'Aunt' | 'Family';
  vote: 'love' | 'neutral' | 'dislike';
  comment: string;
  createdAt: string;
}

export interface SharedTryOn {
  shareId: string;
  outfitId: string;
  userPhotoUrl: string;
  tryOnResultUrl: string;
  productName: string;
  brand: string;
  price: number;
  category: string;
  createdAt: string;
  isActive: boolean;
  opinions: FamilyOpinion[];
}

export interface StitchingRateConfig {
  garmentBaseRates: Record<string, number>; // "1-Piece", "2-Piece", "3-Piece", "Lehenga Choli", "Bridal Gown"
  fabricSurcharges: Record<string, number>; // "Lawn": 0, "Silk": 800, "Velvet": 1200, "Organza": 1000
  embellishmentRates: {
    plain: number;
    light: number;
    heavy: number;
  };
  liningRates: {
    none: number;
    lawn: number;
    silk: number;
  };
  customAddons: {
    tasselsAndLace: number;
    piping: number;
    customNeckline: number;
    designerSleeves: number;
  };
}

export interface StitchingEstimate {
  garmentType: string;
  fabric: string;
  embellishmentLevel: 'plain' | 'light' | 'heavy';
  lining: 'none' | 'lawn' | 'silk';
  pieces: string;
  addons: string[];
  baseCost: number;
  fabricExtra: number;
  embellishmentCost: number;
  liningCost: number;
  addonsCost: number;
  totalCost: number;
  breakdown: { label: string; amount: number }[];
}

export interface DulhanEventLook {
  event: 'Mehndi' | 'Barat' | 'Walima';
  themeColor: string;
  traditionNotes: string;
  outfit: Product;
  dupattaOrHijabStyle: string;
  dupattaFabric: string;
  dupattaColor: string;
  jewelrySuggestion: string;
  estimatedStitchingPKR?: number;
}

export interface DulhanWeddingPlan {
  id: string;
  role: 'bride' | 'guest';
  budgetPKR: number;
  events: ('Mehndi' | 'Barat' | 'Walima')[];
  looks: Record<'Mehndi' | 'Barat' | 'Walima', DulhanEventLook | null>;
  includeStitching: boolean;
  totalEstimatedCost: number;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}
