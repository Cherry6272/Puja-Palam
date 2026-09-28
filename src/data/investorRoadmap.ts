export interface RoadmapPhase {
  phase: string;
  timeline: string;
  badge: string;
  title: string;
  description: string;
  metrics: string[];
  capabilities: string[];
  status: 'active' | 'in_progress' | 'future';
}

export const INVESTOR_ROADMAP: RoadmapPhase[] = [
  {
    phase: 'Phase 01',
    timeline: 'Today — Live Platform',
    badge: 'Foundation',
    title: 'Precision Samagri & Ritual Procurement',
    description: 'Transforming unstructured ritual lists into standardized, guaranteed-complete kits categorized across 4 sequential ritual boxes. Zero guesswork for the user.',
    metrics: ['₹2,450 Avg Order Value', '99.4% Kit Accuracy', '48% Repeat Ritual Rate'],
    capabilities: [
      'Proprietary Ritual Knowledge Graph for 8+ Vedic rituals',
      'Interactive 3D Ritual Table assembly experience',
      '"I Have This" inventory deduplication algorithm',
      '4-Box ritual sequence packaging architecture',
    ],
    status: 'active',
  },
  {
    phase: 'Phase 02',
    timeline: 'Next — Q3 2026',
    badge: 'Intelligence',
    title: 'Grounded AI Planning & Digital QR Companions',
    description: 'Contextual AI assistant that translates conversational family needs into curated procurement lists, backed by physical QR codes that guide preparation step-by-step.',
    metrics: ['< 30s Kit Generation', '85% QR Guide Engagement', '3 Regional Hubs (BLR/MAA/HYD)'],
    capabilities: [
      'Retrieval-grounded natural language ritual assistant',
      'Dynamic guest-count scaling algorithm',
      'Audio mantra preview & timeline guides on mobile',
      'Fresh floral just-in-time morning fulfillment',
    ],
    status: 'in_progress',
  },
  {
    phase: 'Phase 03',
    timeline: 'Then — 2027',
    badge: 'Expansion',
    title: 'Household Inventory & Computer Vision Shelf Scan',
    description: 'Allowing households to snap a photo of their mandir shelf to instantly identify owned brassware, eliminating duplicate purchases and maximizing consumer trust.',
    metrics: ['70% Faster Checkout', '90%+ Item Recognition Accuracy', 'Pan-South India Next-Day'],
    capabilities: [
      'Computer vision puja shelf asset recognition (prototype in R&D)',
      'Annual ritual subscription engine for recurring vratas',
      'Private-label single-source organic camphor & cold-pressed oils',
      'Temple & community hall bulk procurement tier',
    ],
    status: 'future',
  },
  {
    phase: 'Phase 04',
    timeline: 'Scale — 2028',
    badge: 'Omni-Channel',
    title: 'Pan-Indian Hub Network & Institutional B2B',
    description: 'Establishing cold-chain flora hubs and dark stores across 12 tier-1 cities, supplying temples, wedding planners, and corporate festival events.',
    metrics: ['12 Fulfilment Hubs', '30-Minute Dark Store Delivery for Auspicious Timings', 'B2B Temple Accounts'],
    capabilities: [
      'Automated dark store packing lines by ritual sequence',
      'B2B Pandit portal with custom client kit sharing',
      'Ethical temple flower recycling & circular samagri loop',
      'Institutional contract supply for major temple trusts',
    ],
    status: 'future',
  },
  {
    phase: 'Phase 05',
    timeline: 'Long Term — 2029+',
    badge: 'Global Infrastructure',
    title: 'Global Ritual Infrastructure for Diaspora Communities',
    description: 'Fulfilling authenticated Vedic ritual materials to Indian diaspora across North America, UK, Europe, UAE, and Singapore with full agricultural clearance and authentic regional variations.',
    metrics: ['$180M Global TAM Addressable', 'Direct Air Freight Consecration Hubs', 'Multi-Language Global Portals'],
    capabilities: [
      'Cross-border customs-compliant dehydrated sacred flora & herbs',
      'Diaspora time-zone synchronized Panchang calendar engine',
      'Global pandit-family co-procurement synchronization',
      'End-to-end ritual preservation ecosystem',
    ],
    status: 'future',
  },
];
