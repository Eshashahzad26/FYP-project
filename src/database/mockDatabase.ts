import { 
  Product, 
  BrandInfo, 
  UserProfile, 
  StitchingRateConfig, 
  Order, 
  SavedOutfit, 
  SharedTryOn, 
  AdminAuditLog 
} from './types.ts';

export const INITIAL_BRANDS: BrandInfo[] = [
  {
    id: 'b1',
    name: 'Khaadi',
    logo: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=150&auto=format&fit=crop&q=80',
    description: 'Pioneer of contemporary Pakistani hand-woven fabric, ethnic prints, and modern fusion kurtis.',
    sizeChart: [
      { size: 'XS', bust: 34, waist: 26, hips: 36, shoulder: 13.5, length: 38 },
      { size: 'S',  bust: 36, waist: 28, hips: 38, shoulder: 14.0, length: 39 },
      { size: 'M',  bust: 39, waist: 31, hips: 41, shoulder: 14.5, length: 40 },
      { size: 'L',  bust: 42, waist: 34, hips: 44, shoulder: 15.0, length: 41 },
      { size: 'XL', bust: 46, waist: 38, hips: 48, shoulder: 15.5, length: 42 },
    ]
  },
  {
    id: 'b2',
    name: 'Sapphire',
    logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&auto=format&fit=crop&q=80',
    description: 'High-street luxury fashion house celebrated for pure silk jacquards and tailored ready-to-wear.',
    sizeChart: [
      { size: 'XS', bust: 33, waist: 25, hips: 35, shoulder: 13.5, length: 37 },
      { size: 'S',  bust: 35, waist: 27, hips: 37, shoulder: 14.0, length: 38 },
      { size: 'M',  bust: 38, waist: 30, hips: 40, shoulder: 14.5, length: 40 },
      { size: 'L',  bust: 41, waist: 33, hips: 43, shoulder: 15.5, length: 41 },
      { size: 'XL', bust: 45, waist: 37, hips: 47, shoulder: 16.0, length: 42 },
    ]
  },
  {
    id: 'b3',
    name: 'Maria.B',
    logo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&auto=format&fit=crop&q=80',
    description: 'Pakistan’s foremost couturier renowned for opulent bridal wear, intricate zardozi, and couture lehengas.',
    sizeChart: [
      { size: 'XS', bust: 34, waist: 26, hips: 36, shoulder: 14.0, length: 40 },
      { size: 'S',  bust: 36, waist: 28, hips: 38, shoulder: 14.5, length: 41 },
      { size: 'M',  bust: 39, waist: 31, hips: 42, shoulder: 15.0, length: 42 },
      { size: 'L',  bust: 43, waist: 35, hips: 45, shoulder: 15.5, length: 43 },
      { size: 'XL', bust: 47, waist: 39, hips: 49, shoulder: 16.5, length: 44 },
    ]
  },
  {
    id: 'b4',
    name: 'Sana Safinaz',
    logo: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=150&auto=format&fit=crop&q=80',
    description: 'Iconic fashion powerhouse known for elegant silhouettes, pastel luxury pret, and modern bridal glam.',
    sizeChart: [
      { size: 'XS', bust: 33.5, waist: 25.5, hips: 35.5, shoulder: 13.5, length: 39 },
      { size: 'S',  bust: 35.5, waist: 27.5, hips: 37.5, shoulder: 14.0, length: 40 },
      { size: 'M',  bust: 38.5, waist: 30.5, hips: 41.0, shoulder: 14.5, length: 41 },
      { size: 'L',  bust: 42.0, waist: 34.0, hips: 44.5, shoulder: 15.0, length: 42 },
      { size: 'XL', bust: 46.0, waist: 38.0, hips: 48.0, shoulder: 16.0, length: 43 },
    ]
  },
  {
    id: 'b5',
    name: 'Baroque',
    logo: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=150&auto=format&fit=crop&q=80',
    description: 'Specialists in heavily embroidered chiffon and velvet ensembles tailored for festive Pakistani soirees.',
    sizeChart: [
      { size: 'XS', bust: 34, waist: 26, hips: 36, shoulder: 14.0, length: 38 },
      { size: 'S',  bust: 36, waist: 28, hips: 38, shoulder: 14.5, length: 39 },
      { size: 'M',  bust: 39, waist: 31, hips: 41, shoulder: 15.0, length: 40 },
      { size: 'L',  bust: 42, waist: 34, hips: 44, shoulder: 15.5, length: 41 },
      { size: 'XL', bust: 46, waist: 38, hips: 48, shoulder: 16.0, length: 42 },
    ]
  },
  {
    id: 'b6',
    name: 'Gul Ahmed',
    logo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&auto=format&fit=crop&q=80',
    description: 'Heritage textile giant crafting premium lawn, breathable cotton, and timeless 3-piece traditional suits.',
    sizeChart: [
      { size: 'XS', bust: 34.5, waist: 26.5, hips: 36.5, shoulder: 14.0, length: 39 },
      { size: 'S',  bust: 36.5, waist: 28.5, hips: 38.5, shoulder: 14.5, length: 40 },
      { size: 'M',  bust: 39.5, waist: 31.5, hips: 41.5, shoulder: 15.0, length: 41 },
      { size: 'L',  bust: 43.0, waist: 35.0, hips: 45.0, shoulder: 15.5, length: 42 },
      { size: 'XL', bust: 47.0, waist: 39.0, hips: 49.0, shoulder: 16.0, length: 43 },
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Rose Dust Embroidered Organza 3-Piece',
    brand: 'Maria.B',
    category: 'Shalwar Kameez',
    price: 14850,
    originalPrice: 17500,
    color: 'Rose Pink',
    colorHex: '#C57D93',
    fabric: 'Organza',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 3, S: 8, M: 12, L: 5, XL: 2 },
    inStock: true,
    occasion: 'Semi-Formal',
    pieces: '3-Piece',
    popularity: 96,
    createdAt: '2026-03-10',
    isActive: true,
    description: 'Delicate floral threadwork with sequin embellishments on soft organza, accompanied by a pure raw silk trouser and embroidered scalloped border dupatta.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-2',
    name: 'Sultana Crimson Zardozi Bridal Lehenga',
    brand: 'Maria.B',
    category: 'Bridal Wear',
    price: 185000,
    originalPrice: 210000,
    color: 'Crimson Red',
    colorHex: '#8B1425',
    fabric: 'Velvet',
    sizes: ['S', 'M', 'L'],
    stock: { XS: 0, S: 2, M: 3, L: 1, XL: 0 },
    inStock: true,
    occasion: 'Barat',
    pieces: '3-Piece',
    popularity: 99,
    createdAt: '2026-02-15',
    isActive: true,
    description: 'Heavily handcrafted bridal lehenga choli with dabka, kora, antique tilla, and swarovski stones. Paired with a double dupatta in crimson velvet and golden tissue.',
    images: [
      'https://images.unsplash.com/photo-1546804784-896d0dca3805?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-3',
    name: 'Marigold Sunshine Festive Angrakha',
    brand: 'Baroque',
    category: 'Lehenga',
    price: 32500,
    originalPrice: 38000,
    color: 'Mustard Gold',
    colorHex: '#D49B24',
    fabric: 'Chiffon',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: { XS: 4, S: 6, M: 7, L: 3, XL: 0 },
    inStock: true,
    occasion: 'Mehndi',
    pieces: '3-Piece',
    popularity: 93,
    createdAt: '2026-03-01',
    isActive: true,
    description: 'Vibrant mustard-yellow pure chiffon angrakha with mirrorwork, gotta patti accents, and contrasting emerald green banarsi dupatta perfect for Mehndi festivities.',
    images: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-4',
    name: 'Pistachio Sage Walima Elegance Gown',
    brand: 'Sana Safinaz',
    category: 'Bridal Wear',
    price: 145000,
    originalPrice: 160000,
    color: 'Sage Mint',
    colorHex: '#8DA38B',
    fabric: 'Net',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: { XS: 1, S: 3, M: 4, L: 2, XL: 0 },
    inStock: true,
    occasion: 'Walima',
    pieces: '2-Piece',
    popularity: 94,
    createdAt: '2026-01-20',
    isActive: true,
    description: 'Serene sage green floor-length luxury bridal gown layered with French net, pearl tassels, silver cut-dana embroidery, and an elongated dramatic trail.',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-5',
    name: 'Midnight Black Regal Embroidered Abaya',
    brand: 'Sapphire',
    category: 'Abaya',
    price: 11990,
    originalPrice: 13500,
    color: 'Midnight Black',
    colorHex: '#1C1A1B',
    fabric: 'Silk',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 5, S: 10, M: 14, L: 8, XL: 4 },
    inStock: true,
    occasion: 'Daily Wear',
    pieces: '2-Piece',
    popularity: 91,
    createdAt: '2026-02-28',
    isActive: true,
    description: 'Premium Korean Nidha silk open-front abaya adorned with intricate tone-on-tone lace trims, cuff buttons, and an inclusive coordinating black chiffon hijab.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-6',
    name: 'Blush Pink Summer Lawn Pret Kurti',
    brand: 'Khaadi',
    category: 'Kurti',
    price: 3890,
    originalPrice: 4500,
    color: 'Blush Pink',
    colorHex: '#EBB3C3',
    fabric: 'Lawn',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 12, S: 25, M: 30, L: 18, XL: 9 },
    inStock: true,
    occasion: 'Casual',
    pieces: '1-Piece',
    popularity: 98,
    createdAt: '2026-03-12',
    isActive: true,
    description: 'Airy summer lawn straight-cut kurti with contemporary cross-stitch neckline and subtle lace insets on the sleeves. Perfect for university and casual outings.',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-7',
    name: 'Royal Teal Jacquard Festive 3-Piece',
    brand: 'Gul Ahmed',
    category: 'Shalwar Kameez',
    price: 8990,
    originalPrice: 10500,
    color: 'Deep Teal',
    colorHex: '#115E59',
    fabric: 'Jacquard',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 4, S: 11, M: 9, L: 6, XL: 3 },
    inStock: true,
    occasion: 'Eid',
    pieces: '3-Piece',
    popularity: 92,
    createdAt: '2026-03-05',
    isActive: true,
    description: 'Lustrous woven jacquard shirt with gold zari neckline, embroidered organza border patch, dyed cambric trouser, and an exquisite jacquard dupatta.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-8',
    name: 'Ivory Cream Chiffon Kalidar with Foil Mirror',
    brand: 'Baroque',
    category: 'Shalwar Kameez',
    price: 16500,
    originalPrice: 18900,
    color: 'Ivory Cream',
    colorHex: '#F6F1E5',
    fabric: 'Chiffon',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: { XS: 3, S: 7, M: 8, L: 4, XL: 0 },
    inStock: true,
    occasion: 'Wedding Guest',
    pieces: '3-Piece',
    popularity: 95,
    createdAt: '2026-03-02',
    isActive: true,
    description: 'Flared 16-kali flowy chiffon frock encrusted with foil mirror embroidery and resham accents. Features an embroidered net dupatta and raw silk churidar.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546804784-896d0dca3805?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-9',
    name: 'Plum Velvet Heavily Embellished Kurti',
    brand: 'Sapphire',
    category: 'Kurti',
    price: 9490,
    originalPrice: 11000,
    color: 'Plum Wine',
    colorHex: '#581C3F',
    fabric: 'Velvet',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 2, S: 5, M: 8, L: 4, XL: 2 },
    inStock: true,
    occasion: 'Formal',
    pieces: '1-Piece',
    popularity: 88,
    createdAt: '2026-01-15',
    isActive: true,
    description: 'Micro-velvet regal kurti in deep plum with antique gold marori embroidery along the ban neckline and bell sleeves.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-10',
    name: 'Lavender Mist Modest Flare Abaya',
    brand: 'Sana Safinaz',
    category: 'Abaya',
    price: 13500,
    originalPrice: 15000,
    color: 'Soft Lavender',
    colorHex: '#CBB2CD',
    fabric: 'Chiffon',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 4, S: 6, M: 8, L: 3, XL: 1 },
    inStock: true,
    occasion: 'Eid',
    pieces: '2-Piece',
    popularity: 90,
    createdAt: '2026-02-10',
    isActive: true,
    description: 'Two-tier flared modest abaya in pastel lavender georgette chiffon with delicate French lace cuffs and matching pashmina-soft hijab.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&auto=format&fit=crop&q=80'
    ]
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-sana-01',
  name: 'Sana Tariq',
  email: 'sana.tariq@gmail.com',
  phone: '+92 301 4589211',
  profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  favoriteColors: ['Rose Pink', 'Emerald Green', 'Midnight Black', 'Ivory'],
  preferredStyles: ['Classic Traditional', 'Subtle Embroidery', 'Modest Cut', 'A-Line Shalwar Kameez'],
  styleProfileNotes: [
    'Prefers organza and chiffon dupattas for formal events',
    'Medium warm skin tone matches well with rich jewel tones and warm pastels',
    'Comfortable in size M across Khaadi and S in Sapphire'
  ],
  measurements: {
    heightCm: 165,
    bustInches: 37,
    waistInches: 29.5,
    hipsInches: 39.5,
    shoulderInches: 14.5
  },
  bodyAnalysis: {
    bodyShape: 'Hourglass',
    measurements: {
      heightCm: 165,
      bustInches: 37,
      waistInches: 29.5,
      hipsInches: 39.5,
      shoulderInches: 14.5
    },
    skinTone: 'Medium',
    skinUndertone: 'Warm',
    confidenceScore: 0.94,
    notes: 'Measurements estimated via pose detection landmarks with ±5 cm tolerance. Skin tone classified from facial cheek and forehead keypoints.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    analyzedAt: '2026-03-12T14:30:00Z'
  },
  addresses: [
    {
      id: 'addr-1',
      title: 'Home (Lahore)',
      recipientName: 'Sana Tariq',
      phone: '+92 301 4589211',
      addressLine: 'House 42, Block G, Phase 5, DHA',
      city: 'Lahore',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'Office (Gulberg)',
      recipientName: 'Sana Tariq',
      phone: '+92 301 4589211',
      addressLine: 'Suite 304, Mall 1, Main Boulevard, Gulberg III',
      city: 'Lahore',
      isDefault: false
    }
  ],
  role: 'customer'
};

export const INITIAL_STITCHING_RATES: StitchingRateConfig = {
  garmentBaseRates: {
    '1-Piece (Kurti / Shirt)': 1200,
    '2-Piece (Shirt + Trouser)': 2200,
    '3-Piece (Shirt + Shalwar + Dupatta)': 3200,
    'Kalidar / Flared Frock': 4500,
    'Lehenga Choli Set': 8500,
    'Bridal Gown / Maxi': 18000
  },
  fabricSurcharges: {
    'Lawn / Cotton': 0,
    'Chiffon': 400,
    'Organza': 800,
    'Silk / Jacquard': 950,
    'Velvet': 1400,
    'Net': 700
  },
  embellishmentRates: {
    plain: 0,
    light: 700,   // Dori piping, buttons, sleeve lace
    heavy: 2800   // Full neckline handwork, pearl tassels, hem scallops
  },
  liningRates: {
    none: 0,
    lawn: 600,
    silk: 1300
  },
  customAddons: {
    tasselsAndLace: 500,
    piping: 350,
    customNeckline: 600,
    designerSleeves: 550
  }
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'HAA-2026-9481',
    userId: 'usr-sana-01',
    userName: 'Sana Tariq',
    userEmail: 'sana.tariq@gmail.com',
    userPhone: '+92 301 4589211',
    deliveryAddress: {
      id: 'addr-1',
      title: 'Home (Lahore)',
      recipientName: 'Sana Tariq',
      phone: '+92 301 4589211',
      addressLine: 'House 42, Block G, Phase 5, DHA',
      city: 'Lahore',
      isDefault: true
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Rose Dust Embroidered Organza 3-Piece',
        brand: 'Maria.B',
        price: 14850,
        size: 'M',
        color: 'Rose Pink',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80'
      }
    ],
    paymentMethod: 'Cash on Delivery',
    subtotal: 14850,
    shippingFee: 250,
    total: 15100,
    status: 'Out for Delivery',
    statusHistory: [
      { status: 'Pending', timestamp: '2026-03-10T10:00:00Z', note: 'Order placed via COD' },
      { status: 'Confirmed', timestamp: '2026-03-10T14:30:00Z', note: 'Inventory verified by warehouse' },
      { status: 'Out for Delivery', timestamp: '2026-03-12T09:00:00Z', note: 'Dispatched via TCS courier (Tracking: TCS-992144)' }
    ],
    createdAt: '2026-03-10T10:00:00Z',
    canCancel: false
  },
  {
    id: 'ord-102',
    orderNumber: 'HAA-2026-8910',
    userId: 'usr-sana-01',
    userName: 'Sana Tariq',
    userEmail: 'sana.tariq@gmail.com',
    userPhone: '+92 301 4589211',
    deliveryAddress: {
      id: 'addr-1',
      title: 'Home (Lahore)',
      recipientName: 'Sana Tariq',
      phone: '+92 301 4589211',
      addressLine: 'House 42, Block G, Phase 5, DHA',
      city: 'Lahore',
      isDefault: true
    },
    items: [
      {
        productId: 'prod-6',
        productName: 'Blush Pink Summer Lawn Pret Kurti',
        brand: 'Khaadi',
        price: 3890,
        size: 'M',
        color: 'Blush Pink',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&auto=format&fit=crop&q=80'
      }
    ],
    paymentMethod: 'Cash on Delivery',
    subtotal: 3890,
    shippingFee: 250,
    total: 4140,
    status: 'Delivered',
    statusHistory: [
      { status: 'Pending', timestamp: '2026-02-18T11:15:00Z' },
      { status: 'Confirmed', timestamp: '2026-02-18T16:00:00Z' },
      { status: 'Out for Delivery', timestamp: '2026-02-20T08:30:00Z' },
      { status: 'Delivered', timestamp: '2026-02-21T13:45:00Z', note: 'Received by customer, payment collected via Cash on Delivery.' }
    ],
    createdAt: '2026-02-18T11:15:00Z',
    canCancel: false
  }
];

export const INITIAL_SAVED_OUTFITS: SavedOutfit[] = [
  {
    id: 'outfit-sana-1',
    userId: 'usr-sana-01',
    title: 'Maria.B Organza Try-On for Eid',
    product: INITIAL_PRODUCTS[0],
    userPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    tryOnResultUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80',
    savedAt: '2026-03-11T12:00:00Z',
    notes: 'The drape and neckline match perfectly! Recommended size M.',
    shareId: 'share-dulhan-781'
  }
];

export const INITIAL_SHARED_TRYONS: SharedTryOn[] = [
  {
    shareId: 'share-dulhan-781',
    outfitId: 'outfit-sana-1',
    userPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    tryOnResultUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80',
    productName: 'Rose Dust Embroidered Organza 3-Piece',
    brand: 'Maria.B',
    price: 14850,
    category: 'Shalwar Kameez',
    createdAt: '2026-03-11T12:10:00Z',
    isActive: true,
    opinions: [
      {
        id: 'op-1',
        authorName: 'Ami (Mother)',
        relationship: 'Mother',
        vote: 'love',
        comment: 'Beta this color looks so graceful on you! The rose pink suits your complexion so well. Mashallah!',
        createdAt: '2026-03-11T13:20:00Z'
      },
      {
        id: 'op-2',
        authorName: 'Ayesha (Sister)',
        relationship: 'Sister',
        vote: 'love',
        comment: '10/10! The embroidery on the dupatta is gorgeous. Order it before size M runs out!',
        createdAt: '2026-03-11T14:05:00Z'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-1',
    adminName: 'Admin (Zara)',
    action: 'Price Update',
    details: 'Updated price of Sultana Crimson Zardozi from PKR 195,000 to PKR 185,000',
    timestamp: '2026-03-11T09:15:00Z'
  },
  {
    id: 'log-2',
    adminName: 'Admin (Zara)',
    action: 'Stock Adjustment',
    details: 'Added 10 units to Khaadi Summer Lawn Kurti Size S & M',
    timestamp: '2026-03-10T16:40:00Z'
  },
  {
    id: 'log-3',
    adminName: 'Admin (Zara)',
    action: 'Order Status Change',
    details: 'Order HAA-2026-9481 marked as Out for Delivery',
    timestamp: '2026-03-12T09:00:00Z'
  }
];
