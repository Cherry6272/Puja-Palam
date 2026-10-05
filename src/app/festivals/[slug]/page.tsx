'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/hooks/useDataStore';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { dataStore } from '@/lib/dataStore';
import { useCart } from '@/context/CartContext';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  ShoppingBag, 
  ArrowRight, 
  Compass, 
  Layers, 
  Clock, 
  ChevronRight,
  Truck
} from 'lucide-react';

export default function FestivalDetailPage() {
  const { products: SAMAGRI_PRODUCTS, rituals: RITUALS_DATA, festivals: FESTIVALS_DATA, isLoading } = useDataStore();

  const params = useParams();
  const slug = params.slug as string;
  const { addProduct, addCustomizedKit } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brass-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const festival = FESTIVALS_DATA.find((f) => f.slug === slug);
  if (!festival) {
    return notFound();
  }

  const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
  const activeTradition = festival.culturalTraditionNotes[selectedRegionIndex] || festival.culturalTraditionNotes[0];

  // Resolve associated products and rituals
  const products = dataStore.getProducts();
  const rituals = dataStore.getRituals();

  const essentialProducts = products.filter((p) =>
    festival.essentialProducts.includes(p.slug) || festival.essentialProducts.includes(p.id)
  );

  const featuredRitual = rituals.find((r) =>
    festival.featuredRituals.includes(r.slug) || festival.featuredRituals.includes(r.id)
  ) || rituals[0];

  const handleQuickAddProduct = (product: any) => {
    addProduct(product);
  };

  const handleQuickAddFestivalKit = () => {
    if (!featuredRitual) return;
    const tier = featuredRitual.tiers.complete;
    addCustomizedKit({
      id: `festival-kit-${Date.now()}`,
      ritualId: featuredRitual.id,
      ritualName: `${festival.name} Complete Preparation Kit`,
      tier: 'complete',
      tradition: 'karnataka-smartha',
      peopleCount: 15,
      date: festival.upcomingDate,
      venue: 'Home Mandir',
      basePrice: tier.price,
      finalPrice: tier.price,
      ownedItemIds: [],
      activeSubstitutions: {},
      items: featuredRitual.baseRequiredItems,
      totalItemsCount: featuredRitual.baseRequiredItems.length,
      procuredItemsCount: featuredRitual.baseRequiredItems.length,
      savedAmount: 0,
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-temple-500">
        <Link href="/" className="hover:text-brass-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/festivals" className="hover:text-brass-700">Festivals</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-temple-900 font-semibold">{festival.name}</span>
      </nav>

      {/* 1. HERO SECTION */}
      <div className="relative rounded-3xl overflow-hidden bg-temple-950 border border-brass-800 text-sandalwood-100 shadow-2xl">
        <div className="absolute inset-0">
          <img
            src={festival.heroImage}
            alt={festival.name}
            className="w-full h-full object-cover object-center opacity-30 blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-temple-950 via-temple-950/90 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-12 lg:p-16 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-900/80 border border-brass-600/50 text-brass-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-brass-400" />
            <span>{festival.season}</span>
          </div>

          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {festival.name}
          </h1>

          <p className="font-serif-title text-base sm:text-lg text-brass-300">
            {festival.sanskritName}
          </p>

          <p className="text-sm sm:text-base text-sandalwood-200 leading-relaxed max-w-2xl">
            {festival.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center space-x-1.5 bg-temple-900/80 px-3.5 py-2 rounded-xl border border-brass-700/40 text-brass-300">
              <Calendar className="w-4 h-4 text-brass-400" />
              <span>Auspicious Date: {festival.upcomingDate}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-temple-900/80 px-3.5 py-2 rounded-xl border border-brass-700/40 text-sandalwood-200">
              <Truck className="w-4 h-4 text-tulsi-400" />
              <span>Fresh Flowers Available (Select Regions)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. WHY THE OCCASION MATTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-sandalwood-200 shadow-subtle space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
            Sacred Heritage &amp; Puranic Context
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
            Why {festival.name} Matters
          </h2>
          <p className="text-sm text-temple-700 leading-relaxed">
            {festival.description}
          </p>
          <div className="p-4 rounded-2xl bg-brass-50/70 border border-brass-200 text-xs text-temple-800 italic leading-relaxed">
            &ldquo;{festival.spiritualSignificance}&rdquo;
          </div>
        </div>

        {/* Quick Kit CTA Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-temple-900 to-temple-850 rounded-3xl p-6 text-sandalwood-100 border border-brass-600/40 shadow-xl space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-brass-500 text-temple-950 px-2.5 py-0.5 rounded-full inline-block">
            Festival Ready
          </span>
          <h3 className="font-serif-title text-xl font-bold text-sandalwood-50">
            Complete {festival.name} Puja Kit
          </h3>
          <p className="text-xs text-sandalwood-300 leading-relaxed">
            Everything required for authentic family observance—4-box sequenced packaging, sacred powders, Kalasha essentials, and fresh floral morning delivery.
          </p>
          <div className="pt-2 border-t border-temple-800 flex items-baseline justify-between">
            <span className="text-xs text-sandalwood-400 uppercase font-semibold">Complete Tier</span>
            <span className="font-serif-title text-2xl font-bold text-brass-300">
              ₹{featuredRitual?.tiers.complete.price.toLocaleString('en-IN')}
            </span>
          </div>
          <button
            type="button"
            onClick={handleQuickAddFestivalKit}
            className="w-full py-3 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-brass transition-all active:scale-98"
          >
            <ShoppingBag className="w-4 h-4 text-temple-950" />
            <span>Procure Complete Festival Kit</span>
          </button>
        </div>
      </div>

      {/* 3. SELECT YOUR TRADITION / REGION */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sandalwood-200 shadow-subtle space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
            Regional Traditions
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900 mt-1">
            Regional Nuances &amp; Authentic Customs
          </h2>
          <p className="text-xs sm:text-sm text-temple-600 mt-1">
            South Indian festivals are celebrated with distinct regional beauty. Select your family tradition to view prescribed offerings.
          </p>
        </div>

        {/* Region Switcher Pills */}
        <div className="flex flex-wrap gap-2">
          {festival.culturalTraditionNotes.map((note, idx) => (
            <button
              key={note.region}
              type="button"
              onClick={() => setSelectedRegionIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedRegionIndex === idx
                  ? 'bg-temple-900 text-sandalwood-50 shadow-temple'
                  : 'bg-sandalwood-100 text-temple-700 hover:bg-sandalwood-200'
              }`}
            >
              {note.region} ({note.practice})
            </button>
          ))}
        </div>

        {/* Selected Tradition Detail */}
        {activeTradition && (
          <div className="p-6 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brass-600" />
              <h3 className="font-serif-title text-lg font-bold text-temple-900">
                {activeTradition.region} Traditional Observance: {activeTradition.practice}
              </h3>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-temple-700">
                Prescribed Regional Offerings &amp; Items:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {activeTradition.distinctOfferings.map((offering, idx) => (
                  <div key={idx} className="flex items-start space-x-2 p-2.5 rounded-xl bg-white border border-sandalwood-200 text-xs text-temple-800">
                    <Check className="w-4 h-4 text-tulsi-600 flex-shrink-0 mt-0.5" />
                    <span>{offering}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. ESSENTIAL FESTIVAL SAMAGRI */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
              Procure What You Need
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900 mt-1">
              Essential Samagri for {festival.name}
            </h2>
          </div>
          <Link
            href="/samagri"
            className="text-xs font-bold text-brass-700 hover:text-brass-900 flex items-center space-x-1"
          >
            <span>Browse Full Samagri Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {essentialProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-sandalwood-200 p-4 shadow-subtle flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-[4/3] rounded-xl object-cover"
                />
                <span className="text-[10px] uppercase font-bold text-brass-800 bg-brass-100 px-2 py-0.5 rounded">
                  Box 0{product.boxSequence}
                </span>
                <h4 className="font-bold text-xs text-temple-900 line-clamp-1">
                  {product.name}
                </h4>
                <p className="text-[11px] text-temple-500 line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="pt-2 border-t border-sandalwood-100 flex items-center justify-between">
                <span className="font-serif-title text-base font-bold text-temple-900">
                  ₹{product.price}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickAddProduct(product)}
                  className="px-3 py-1.5 rounded-lg bg-temple-900 hover:bg-temple-800 text-sandalwood-50 text-xs font-bold shadow-xs"
                >
                  + Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. BUILD YOUR OWN KIT CTA */}
      <div className="bg-gradient-to-r from-brass-100 via-sandalwood-100 to-brass-100 rounded-3xl p-8 sm:p-12 border border-brass-300/70 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-brass-800">
            Zero Waste &amp; Deduplication
          </span>
          <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
            Already have brass lamps or Kalasha at home?
          </h3>
          <p className="text-xs sm:text-sm text-temple-700 leading-relaxed">
            Use our interactive Kit Builder to uncheck items you already own. We calculate the price deduction in real-time and assemble only what you need.
          </p>
        </div>

        <Link
          href={`/build-your-kit?ritual=${featuredRitual?.slug || 'satyanarayana-puja'}`}
          className="px-6 py-3.5 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold text-xs flex items-center space-x-2 shadow-temple flex-shrink-0"
        >
          <Layers className="w-4 h-4 text-brass-400" />
          <span>Customize in Kit Builder</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
