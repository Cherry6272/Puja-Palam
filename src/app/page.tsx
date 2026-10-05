'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/hooks/useDataStore';
import Link from 'next/link';
import { RitualTableCanvas } from '@/components/3d/RitualTableCanvas';
import { RitualCard } from '@/components/store/RitualCard';
import { ProductCard } from '@/components/store/ProductCard';
import { IntentSearchBar } from '@/components/store/IntentSearchBar';
import { RitualBoxPackagingView } from '@/components/guide/RitualBoxPackagingView';
import { 
  Compass, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Layers, 
  Clock, 
  MapPin, 
  Calendar, 
  Flower2, 
  CheckCircle2,
  Home as HomeIcon,
  Heart,
  SunMedium,
  ChevronRight,
  Truck
} from 'lucide-react';
import { AskPujaKaryamModal } from '@/components/ai/AskPujaKaryamModal';

export default function HomePage() {
  const { products: SAMAGRI_PRODUCTS, rituals: RITUALS_DATA, festivals: FESTIVALS_DATA } = useDataStore();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('festival');
  const [selectedRegionTab, setSelectedRegionTab] = useState<'karnataka' | 'tamil' | 'telugu' | 'kerala'>('karnataka');

  // Occasions data for "What are you preparing for?"
  const occasions = [
    {
      id: 'festival',
      label: 'Upcoming Festival',
      icon: Sparkles,
      title: 'Varamahalakshmi Vrata & Ganesha Habba',
      desc: 'Seasonal observances honoring Goddess Lakshmi and Lord Ganapati with authentic regional customs.',
      recommendedRitual: 'varalakshmi-vrata',
      recommendedKitTitle: 'Varalakshmi Vrata Complete Kit',
      badge: 'Current Season',
    },
    {
      id: 'home',
      label: 'New Home (Griha Pravesh)',
      icon: HomeIcon,
      title: 'Griha Pravesh & Vastu Shuddhi',
      desc: 'Consecrate your new apartment, villa, or ancestral home with sacred Agni and planetary balance.',
      recommendedRitual: 'griha-pravesh',
      recommendedKitTitle: 'Complete Housewarming Kit',
      badge: 'Milestone Ceremony',
    },
    {
      id: 'family',
      label: 'Family Prosperity & Vrata',
      icon: Heart,
      title: 'Sri Satyanarayana Swamy Puja',
      desc: 'Full moon (Purnima) thanksgiving for family prosperity, truth, and domestic happiness.',
      recommendedRitual: 'satyanarayana-puja',
      recommendedKitTitle: 'Sri Satyanarayana Sacred Kit',
      badge: 'Purnima / Monthly',
    },
    {
      id: 'daily',
      label: 'Daily Mandir Replenishment',
      icon: SunMedium,
      title: 'Nitya Puja Sacred Consumables',
      desc: 'Single-origin Salem turmeric, Madurai temple kumkum, pure cow ghee wicks, and Bhimseni camphor.',
      recommendedRitual: 'ganapati-puja',
      recommendedKitTitle: 'Daily Mandir Samagri Pack',
      badge: 'Pure Consumables',
    },
  ];

  const activeOccasionData = occasions.find((o) => o.id === selectedOccasion) || occasions[0];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brass-200/40 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brass-100 border border-brass-300/80 text-brass-800 text-xs font-bold uppercase tracking-widest shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brass-600" />
            <span>The Ritual Procurement Platform</span>
          </div>

          <h1 className="font-serif-title text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-temple-900 leading-[1.1]">
            Your ritual.{' '}
            <span className="bg-gradient-to-r from-brass-600 via-brass-500 to-amber-600 bg-clip-text text-transparent">
              Everything it needs.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-temple-700 max-w-2xl mx-auto leading-relaxed">
            From the first item to the final offering, Samptrapthi brings every ritual requirement together — thoughtfully curated, accurately prepared and delivered with ease.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/plan-your-puja"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold text-sm tracking-wide shadow-temple hover:shadow-brass transition-all flex items-center justify-center space-x-2 group active:scale-95"
            >
              <Compass className="w-4 h-4 text-brass-300 group-hover:rotate-45 transition-transform" />
              <span>PLAN A RITUAL</span>
              <ArrowRight className="w-4 h-4 text-brass-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/samagri"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-sandalwood-100 border border-sandalwood-300 text-temple-900 font-bold text-sm tracking-wide shadow-subtle transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4 text-brass-600" />
              <span>EXPLORE SAMAGRI</span>
            </Link>
          </div>

          <div className="pt-6">
            <IntentSearchBar />
          </div>

          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
            <div className="flex items-center space-x-2 text-xs text-temple-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-tulsi-600 flex-shrink-0" />
              <span>Region-Aware Ritual Requirements</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-temple-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-tulsi-600 flex-shrink-0" />
              <span>&ldquo;I Have This&rdquo; Deduplication</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-temple-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-tulsi-600 flex-shrink-0" />
              <span>4-Box Sequenced Packaging</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-temple-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-tulsi-600 flex-shrink-0" />
              <span>Prepared with Care for Your Ritual</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ENTRY POINT B: WHAT ARE YOU PREPARING FOR? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sandalwood-200 shadow-subtle space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
              Personalized Guidance
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
              What are you preparing for?
            </h2>
            <p className="text-xs sm:text-sm text-temple-600">
              Select your occasion. Samptrapthi configures the exact Vedic requirements and deducts items you already own at home.
            </p>
          </div>

          {/* Occasion Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {occasions.map((occ) => {
              const Icon = occ.icon;
              const isSelected = selectedOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => setSelectedOccasion(occ.id)}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                    isSelected
                      ? 'bg-temple-900 border-temple-900 text-sandalwood-50 shadow-temple'
                      : 'bg-sandalwood-50 border-sandalwood-200 text-temple-800 hover:bg-sandalwood-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-brass-400' : 'text-brass-600'}`} />
                  <div>
                    <p className="text-xs font-bold leading-tight">{occ.label}</p>
                    <span className={`text-[10px] font-medium block mt-0.5 ${isSelected ? 'text-brass-300' : 'text-temple-500'}`}>
                      {occ.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Occasion Showcase Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-brass-50 via-sandalwood-50 to-brass-50 border border-brass-300/70 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] uppercase font-bold text-brass-800 bg-brass-200/80 px-2.5 py-0.5 rounded-full">
                Recommended Observance
              </span>
              <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-temple-900">
                {activeOccasionData.title}
              </h3>
              <p className="text-xs text-temple-700 leading-relaxed">
                {activeOccasionData.desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Link
                href={`/rituals/${activeOccasionData.recommendedRitual}`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-sandalwood-300 hover:border-brass-500 bg-white text-temple-900 text-xs font-bold text-center shadow-xs"
              >
                Inspect Requirements
              </Link>
              <Link
                href={`/build-your-kit?ritual=${activeOccasionData.recommendedRitual}`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 text-xs font-bold text-center shadow-temple flex items-center justify-center space-x-1.5"
              >
                <span>Build Custom Kit</span>
                <ArrowRight className="w-3.5 h-3.5 text-brass-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEASONAL FESTIVAL FEATURE (VARAMAHALAKSHMI & GANESHA HABBA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-temple-950 border border-brass-800 shadow-2xl p-6 sm:p-10 lg:p-12 text-sandalwood-100">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1615865417491-9941019fbc00?auto=format&fit=crop&w=1200&q=80"
              alt="Festival Season"
              className="w-full h-full object-cover object-center opacity-25 blur-xs"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-temple-950 via-temple-950/90 to-transparent" />
          </div>

          <div className="relative max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-900/80 border border-brass-600/50 text-brass-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-brass-400" />
              <span>Current Sacred Season • Shravana &amp; Bhadrapada</span>
            </div>

            <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Varamahalakshmi Vrata &amp; Ganesha Habba
            </h2>

            <p className="text-xs sm:text-sm text-sandalwood-200 leading-relaxed">
              Observed across Karnataka, Tamil Nadu, Andhra Pradesh, and Telangana. From Morada Bagina winnowing trays and nine-knot Thorana cords to 21 sacred patri leaves—procure authentic materials without last-minute panic.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/festivals/varalakshmi-vrata"
                className="px-6 py-3 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs shadow-brass flex items-center space-x-2 active:scale-98"
              >
                <span>Explore Varamahalakshmi Kit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/festivals"
                className="px-5 py-3 rounded-xl border border-brass-700/60 bg-temple-900/80 hover:bg-temple-800 text-sandalwood-100 text-xs font-bold"
              >
                View All 10 South Indian Festivals →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENTRY POINT A: EXPLORE BY RITUAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
              Entry Point A • Direct Selection
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-temple-900 mt-1">
              Shop by Sacred Ritual
            </h2>
            <p className="text-sm text-temple-600 mt-1">
              Structured Vedic packages tailored for authentic family observances.
            </p>
          </div>

          <Link
            href="/rituals"
            className="text-xs font-bold text-brass-700 hover:text-brass-900 flex items-center space-x-1"
          >
            <span>View All Canonical Rituals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RITUALS_DATA.map((ritual) => (
            <RitualCard key={ritual.id} ritual={ritual} />
          ))}
        </div>
      </section>

      {/* 5. 3D RITUAL TABLE: SEE WHAT YOUR RITUAL NEEDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
            Interactive Ritual Visualizer
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-temple-900">
            See your ritual come together.
          </h2>
          <p className="text-xs sm:text-sm text-temple-600">
            Switch ceremonies to observe procedural items assemble on the altar. Click any brass vessel or offering to view its Vedic purpose, box number, and add it directly to your kit.
          </p>
        </div>

        <RitualTableCanvas />
      </section>

      {/* 6. ENTRY POINT C: PUJA SAMAGRI ESSENTIALS (WITH "USED FOR" LINKS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
              Entry Point C • Pure Samagri
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-temple-900 mt-1">
              Single-Origin Puja Samagri
            </h2>
            <p className="text-sm text-temple-600 mt-1">
              Procure individual items. Every single item connects back to the ceremonies where it is required.
            </p>
          </div>

          <Link
            href="/samagri"
            className="text-xs font-bold text-brass-700 hover:text-brass-900 flex items-center space-x-1"
          >
            <span>View Full Samagri Store</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMAGRI_PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. BUILD YOUR KIT CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brass-100 via-sandalwood-100 to-brass-100 rounded-3xl p-8 sm:p-12 border border-brass-300/70 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-brass-800">
              Zero Waste &amp; Deduplication
            </span>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
              Have things at home? Uncheck them. We deduct the price.
            </h3>
            <p className="text-xs sm:text-sm text-temple-700 leading-relaxed">
              Our signature &ldquo;I Have This&rdquo; engine ensures you never repurchase Kalasha vessels, lamps, or spoons you already own. Scale to guest count, uncheck owned items, and order only what you need.
            </p>
          </div>

          <Link
            href="/build-your-kit"
            className="px-7 py-4 rounded-2xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold text-sm shadow-temple flex items-center space-x-2 flex-shrink-0 active:scale-98"
          >
            <Layers className="w-4 h-4 text-brass-400" />
            <span>Launch Kit Builder</span>
            <ArrowRight className="w-4 h-4 text-brass-400" />
          </Link>
        </div>
      </section>

      {/* 8. SOUTH INDIA REGIONAL TRADITIONS DEEP DIVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sandalwood-200 shadow-subtle space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
              Cultural Authenticity
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
              Rituals Across South India
            </h2>
            <p className="text-xs sm:text-sm text-temple-600">
              We never enforce a generic checklist. Karnataka, Tamil Nadu, Andhra/Telangana, and Kerala observances receive their authentic prescribed materials.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'karnataka' as const, label: 'Karnataka (ಕರ್ನಾಟಕ)' },
              { id: 'tamil' as const, label: 'Tamil Nadu (தமிழ்நாடு)' },
              { id: 'telugu' as const, label: 'Andhra & Telangana (తెలుగు)' },
              { id: 'kerala' as const, label: 'Kerala (കേരളം)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRegionTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRegionTab === tab.id
                    ? 'bg-temple-900 text-sandalwood-50 shadow-temple'
                    : 'bg-sandalwood-100 text-temple-700 hover:bg-sandalwood-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Selected Region Content */}
          <div className="p-6 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {selectedRegionTab === 'karnataka' && (
              <>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-temple-900">Mysore &amp; Smartha Tradition</h4>
                  <p className="text-temple-600 leading-relaxed">
                    Celebrated with Arishina-Kunkuma sacred thresholds, silver Mukhavada Kalasha crowns, and Chigali-Thambittu offerings.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-temple-900">Signature Ritual Items</h4>
                  <p className="text-temple-600 leading-relaxed">
                    Twin bamboo Morada Bagina winnowing trays, Turmeric Gowri idol, raw jaggery, Sakkare Acchu figures, and coconut toranam.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-temple-900">Featured Observances</h4>
                  <p className="text-brass-800 font-semibold">
                    Varamahalakshmi Habba • Ganesha Habba • Swarna Gowri • Ugadi • Mysore Dasara
                  </p>
                </div>
              </>
            )}

            {selectedRegionTab === 'tamil' && (
              <>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-temple-900">Mylapore &amp; Thanjavur Purity</h4>
                  <p className="text-temple-600 leading-relaxed">
                    Strict Agamic temple traditions, Nachiyar Koil bell-metal Kuthuvilakku lighting, and sacred yellow Nombu Saradu cords.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-temple-900">Signature Ritual Items</h4>
                  <p className="text-temple-600 leading-relaxed">
                    Madurai stone-ground Kumkum, Nachiyar Koil brass lamps, Mavilai Thoranam, Manjal Kizhangu, and Vetrilai-Pakku with dakshina coins.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-temple-900">Featured Observances</h4>
                  <p className="text-brass-800 font-semibold">
                    Varalakshmi Nombu • Vinayagar Chaturthi • Thai Pongal • Karthigai Deepam • Puthandu
                  </p>
                </div>
              </>
            )}

            {selectedRegionTab === 'telugu' && (
              <>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-temple-900">Vaidiki Vedic Precision</h4>
                  <p className="text-temple-600 leading-relaxed">
                    Eka Vimshathi Patri offerings, Godavari delta traditions, and Palavelli canopy installations decorated with seasonal harvest.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-temple-900">Signature Ritual Items</h4>
                  <p className="text-temple-600 leading-relaxed">
                    21 medicinal leaf Patri set, Pasupu Ganapati invocation, Poornam Boorelu prasad samagri, and Bevu-Bella / Ugadi Pachadi mix.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-temple-900">Featured Observances</h4>
                  <p className="text-brass-800 font-semibold">
                    Vinayaka Chavithi • Varalakshmi Vratam • Ugadi Panduga • Makara Sankranti
                  </p>
                </div>
              </>
            )}

            {selectedRegionTab === 'kerala' && (
              <>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-temple-900">Tantric &amp; Temple Canon</h4>
                  <p className="text-temple-600 leading-relaxed">
                    Cast bronze Uruli vessels, bell-metal Nilavilakku lamp lighting at Brahma Muhurta, and fragrant Kani Konna flower bunches.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-temple-900">Signature Ritual Items</h4>
                  <p className="text-temple-600 leading-relaxed">
                    Aranmula metal mirror, heavy cast Nilavilakku, golden Kani Vellarikka cucumber, unpolished raw rice, and Betel bunches.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-temple-900">Featured Observances</h4>
                  <p className="text-brass-800 font-semibold">
                    Vishu (Vishukkani) • Ganapathi Homam • Ashtami Rohini • Bhagavathi Seva
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 9. HOW IT WORKS (SECTION 21 & 38) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
            The Flow
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-temple-900">
            How Samptrapthi Works
          </h2>
          <p className="text-sm text-temple-600">
            Moving you from &ldquo;I need to perform a puja&rdquo; to &ldquo;Everything required is taken care of.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Choose or Consult', desc: 'Select from verified Vedic rituals with regional and tradition variations.' },
            { step: '02', title: 'Personalize & Exclude', desc: 'Scale by guest count and uncheck items you already own at home.' },
            { step: '03', title: '4-Box Packaging', desc: 'Procure pure samagri organized strictly into Box 01 to Box 04 sequence.' },
            { step: '04', title: 'Prepared With Care', desc: 'Delivered directly to your door with authentic samagri and Digital QR Guide.' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-sandalwood-200 shadow-subtle space-y-2 relative"
            >
              <span className="font-serif-title text-2xl font-bold text-brass-500">
                {item.step}
              </span>
              <h3 className="font-serif-title text-base font-bold text-temple-900">
                {item.title}
              </h3>
              <p className="text-xs text-temple-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Box Packaging Guarantee */}
      <RitualBoxPackagingView />

      {/* 10. GROUNDED AI ASSISTANT TRIGGER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brass-100 via-sandalwood-100 to-brass-100 rounded-3xl p-8 sm:p-12 border border-brass-300/60 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-200 text-brass-900 text-xs font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded AI Architecture</span>
            </div>
            <h2 className="font-serif-title text-3xl font-bold text-temple-900">
              &ldquo;Ask Samptrapthi&rdquo; AI Assistant
            </h2>
            <p className="text-xs sm:text-sm text-temple-700 leading-relaxed">
              Natural language queries like <em>&ldquo;What do I need for Varalakshmi Vrata for 6 people? I already have a brass diya&rdquo;</em> are strictly grounded in our canonical Knowledge Graph — never hallucinatory or dogmatic.
            </p>
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 text-xs font-bold flex items-center space-x-2 shadow-temple transition-all"
            >
              <Sparkles className="w-4 h-4 text-brass-300" />
              <span>Try AI Assistance</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brass-300 shadow-md space-y-3 max-w-xs w-full text-xs text-temple-700">
            <div className="flex items-center space-x-2 text-temple-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-brass-600" />
              <span>Strict Canonical Grounding</span>
            </div>
            <div className="p-2.5 rounded-lg bg-sandalwood-50 border border-sandalwood-200 text-[11px] italic">
              &ldquo;User query → Knowledge Graph retrieval → Quantity scaling algorithm → 4-Box Sequenced Cart&rdquo;
            </div>
            <div className="flex items-center space-x-1.5 text-tulsi-700 font-medium text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero LLM hallucination of religious mandates</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Modal */}
      <AskPujaKaryamModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
