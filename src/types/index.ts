export type RitualCategory = 'Vrata' | 'Samskara' | 'Griha' | 'Festival' | 'Shanti' | 'Daily';

export type RegionalTradition = 
  | 'karnataka-smartha'
  | 'karnataka-madhwa'
  | 'tamil-iyer'
  | 'tamil-iyengar'
  | 'telugu-vaidiki'
  | 'kerala-tantric'
  | 'pan-vedic';

export type ItemCategory = 
  | 'Vessels & Brassware'
  | 'Sacred Powders & Pastes'
  | 'Offerings, Grains & Prasad'
  | 'Lamps, Wicks & Aromatics'
  | 'Sacred Flora & Leaves'
  | 'Fabrics & Sacred Threads';

export interface RitualItem {
  id: string;
  name: string;
  sanskritName?: string;
  localName?: {
    kannada?: string;
    tamil?: string;
    telugu?: string;
    hindi?: string;
  };
  category: ItemCategory;
  quantity: number;
  unit: string;
  purpose: string;
  boxNumber: 1 | 2 | 3 | 4; // Box 01: Preparation, Box 02: Kalasha, Box 03: Offerings, Box 04: Aarti
  isEssential: boolean;
  estimatedPrice: number;
  threeDId?: string; // id for interactive 3d table
  shelfLife?: string;
  storage?: string;
  alternatives?: string[];
}

export interface RitualSubstitution {
  originalItemId: string;
  originalName: string;
  substituteName: string;
  traditionContext: string;
  type: 'traditional' | 'cultural_common' | 'optional_convenience';
  priceDifference: number; // e.g. -50 or +20
  notes: string;
}

export interface PrepStep {
  timing: 'T-24 Hours' | 'T-3 Hours' | 'T-45 Minutes' | 'Commencement';
  title: string;
  instructions: string[];
  itemsNeeded: string[];
}

export interface TraditionVariation {
  id: RegionalTradition;
  regionName: string;
  traditionTitle: string;
  summary: string;
  specificItems: RitualItem[];
  culturalNuances: string[];
}

export interface KitTierConfig {
  tier: 'essential' | 'complete' | 'premium';
  name: string;
  tagline: string;
  price: number;
  vesselQuality: string;
  organicIngredients: boolean;
  brassVesselsIncluded: boolean;
  artisanBackdropIncluded: boolean;
  description: string;
}

export interface Ritual {
  id: string;
  slug: string;
  name: string;
  sanskritName: string;
  tagline: string;
  heroDescription: string;
  category: RitualCategory;
  deity: string;
  typicalDuration: string;
  idealTime: string;
  auspiciousTithi: string;
  image: string;
  accentColor: string;
  baseRequiredItems: RitualItem[];
  optionalItems: RitualItem[];
  traditions: TraditionVariation[];
  substitutions: RitualSubstitution[];
  prepTimeline: PrepStep[];
  tiers: {
    essential: KitTierConfig;
    complete: KitTierConfig;
    premium: KitTierConfig;
  };
  mantraAudioSnippet?: {
    title: string;
    duration: string;
    deity: string;
  };
}

export interface SamagriProduct {
  id: string;
  slug: string;
  sku: string;
  name: string;
  sanskritName: string;
  category: ItemCategory;
  price: number;
  originalPrice?: number;
  weightOrVolume: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  inventoryByHub: {
    blr: number; // Bengaluru
    maa: number; // Chennai
    hyd: number; // Hyderabad
  };
  description: string;
  ritualRelevance: string;
  material?: string;
  origin?: string;
  shelfLife: string;
  storage: string;
  usedInRituals: string[];
  image: string;
  boxSequence: 1 | 2 | 3 | 4;
}

export interface CartCustomizedKit {
  id: string;
  ritualId: string;
  ritualName: string;
  tier: 'essential' | 'complete' | 'premium';
  tradition: RegionalTradition;
  peopleCount: number;
  date: string;
  venue: string;
  basePrice: number;
  finalPrice: number;
  ownedItemIds: string[];
  activeSubstitutions: Record<string, string>; // originalItemId -> substituteName
  items: RitualItem[];
  totalItemsCount: number;
  procuredItemsCount: number;
  savedAmount: number;
}

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  ritualDate?: string;
  notes?: string;
}

export interface PlacedOrder {
  orderId: string;
  createdAt: string;
  customer: OrderCustomerInfo;
  kits: CartCustomizedKit[];
  products: { product: SamagriProduct; quantity: number }[];
  subtotal: number;
  savings: number;
  total: number;
  assignedHub: string;
  boxSequenceStatus: {
    box1: string;
    box2: string;
    box3: string;
    box4: string;
  };
}

export type SouthIndianRegion = 'karnataka' | 'tamil-nadu' | 'andhra-pradesh' | 'telangana' | 'kerala';

export interface FestivalTraditionNote {
  region: string;
  practice: string;
  distinctOfferings: string[];
}

export interface Festival {
  id: string;
  slug: string;
  name: string;
  sanskritName: string;
  regionalNames: {
    kannada?: string;
    tamil?: string;
    telugu?: string;
    malayalam?: string;
  };
  season: string;
  upcomingDate: string;
  tagline: string;
  description: string;
  spiritualSignificance: string;
  regions: SouthIndianRegion[];
  featuredRituals: string[]; // ritual slugs
  featuredKits: string[]; // kit slugs or tier keys
  essentialProducts: string[]; // product slugs
  heroImage: string;
  culturalTraditionNotes: FestivalTraditionNote[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'ops_manager' | 'ritual_scholar';
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  expiresAt: number;
}
