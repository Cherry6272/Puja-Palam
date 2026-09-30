'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/hooks/useDataStore';
import { notFound, useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { 
  Compass, 
  ShoppingBag, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Layers, 
  Volume2, 
  ChevronRight,
  Package,
  QrCode
} from 'lucide-react';

export default function RitualDetailPage() {
  const { products: SAMAGRI_PRODUCTS, rituals: RITUALS_DATA, festivals: FESTIVALS_DATA } = useDataStore();

  const params = useParams();
  const slug = params.slug as string;
  const { addCustomizedKit } = useCart();

  const ritual = RITUALS_DATA.find((r) => r.slug === slug);
  if (!ritual) {
    return notFound();
  }

  const [selectedTierKey, setSelectedTierKey] = useState<'essential' | 'complete' | 'premium'>('complete');
  const [selectedTraditionId, setSelectedTraditionId] = useState(ritual.traditions[0]?.id || 'karnataka-smartha');

  const activeTier = ritual.tiers[selectedTierKey];

  const handleQuickProcure = () => {
    addCustomizedKit({
      id: `direct-kit-${Date.now()}`,
      ritualId: ritual.id,
      ritualName: ritual.name,
      tier: selectedTierKey,
      tradition: selectedTraditionId,
      peopleCount: 15,
      date: new Date().toISOString().split('T')[0],
      venue: 'Home Mandir',
      basePrice: activeTier.price,
      finalPrice: activeTier.price,
      ownedItemIds: [],
      activeSubstitutions: {},
      items: ritual.baseRequiredItems,
      totalItemsCount: ritual.baseRequiredItems.length,
      procuredItemsCount: ritual.baseRequiredItems.length,
      savedAmount: 0,
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-temple-500">
        <Link href="/" className="hover:text-brass-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/rituals" className="hover:text-brass-700">Rituals</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-temple-900 font-semibold">{ritual.name}</span>
      </nav>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-sandalwood-200 shadow-temple">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-brass-100 text-brass-800 border border-brass-200">
              {ritual.category}
            </span>
            <span className="text-xs text-temple-500 font-medium">
              Vedic Canon: {ritual.deity}
            </span>
          </div>

          <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-temple-900 leading-tight">
            {ritual.name}
          </h1>

          <p className="font-serif-title text-base text-vermillion-700">
            {ritual.sanskritName}
          </p>

          <p className="text-sm text-temple-600 leading-relaxed max-w-xl">
            {ritual.heroDescription}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200">
              <span className="text-temple-400 block text-[10px] uppercase font-bold">Duration</span>
              <span className="font-bold text-temple-800">{ritual.typicalDuration}</span>
            </div>
            <div className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200">
              <span className="text-temple-400 block text-[10px] uppercase font-bold">Recommended Muhurta</span>
              <span className="font-bold text-temple-800">{ritual.idealTime}</span>
            </div>
            <div className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200 col-span-2 sm:col-span-1">
              <span className="text-temple-400 block text-[10px] uppercase font-bold">Packaging</span>
              <span className="font-bold text-temple-800">4 Sequenced Boxes</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={`/planner?ritual=${ritual.slug}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-brass transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Customize in Ritual Planner</span>
            </Link>

            <button
              type="button"
              onClick={handleQuickProcure}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold text-xs flex items-center justify-center space-x-2 shadow-temple transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-brass-300" />
              <span>Procure {activeTier.name} (₹{activeTier.price.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>

        {/* Visual Showcase Card */}
        <div className="lg:col-span-5 relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-brass-400/50 bg-temple-900">
          <img
            src={ritual.image}
            alt={ritual.name}
            className="w-full h-full object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-temple-950 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-sandalwood-100 flex items-center justify-between text-xs">
            <span className="bg-temple-900/80 px-3 py-1 rounded-full border border-brass-700/50">
              Commonly Used Rituals
            </span>
            <span className="text-brass-300 font-semibold">
              {ritual.baseRequiredItems.length} Required Items
            </span>
          </div>
        </div>
      </div>

      {/* Tier Selector Showcase */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
            Select Preparation Level
          </span>
          <h2 className="font-serif-title text-3xl font-bold text-temple-900">
            Puja Kit Configurations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['essential', 'complete', 'premium'] as const).map((tierKey) => {
            const tier = ritual.tiers[tierKey];
            const isSelected = selectedTierKey === tierKey;

            return (
              <div
                key={tierKey}
                onClick={() => setSelectedTierKey(tierKey)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brass-50/80 border-brass-500 ring-2 ring-brass-400 shadow-brass'
                    : 'bg-white border-sandalwood-200 hover:border-brass-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brass-700 bg-brass-100 px-2 py-0.5 rounded">
                      {tierKey}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-brass-500 text-temple-900 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-serif-title text-xl font-bold text-temple-900 mt-2">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-brass-800 font-medium">
                    {tier.tagline}
                  </p>

                  <p className="font-serif-title text-2xl font-bold text-temple-900 my-4">
                    ₹{tier.price.toLocaleString('en-IN')}
                  </p>

                  <p className="text-xs text-temple-600 leading-relaxed mb-4">
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-temple-700 pt-3 border-t border-sandalwood-200">
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-tulsi-600 flex-shrink-0" />
                    <span>{tier.vesselQuality}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-tulsi-600 flex-shrink-0" />
                    <span>Complete Consumable Samagri</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Required Items Manifest by Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sandalwood-200 shadow-subtle space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
            Full Disclosure
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900 mt-1">
            Complete Canonical Item Manifest
          </h2>
          <p className="text-xs sm:text-sm text-temple-600 mt-1">
            Every item required for {ritual.name}, structured according to its ritual sequence in Boxes 01 to 04.
          </p>
        </div>

        <div className="space-y-3">
          {ritual.baseRequiredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-sandalwood-50/70 border border-sandalwood-200 text-xs text-temple-800"
            >
              <div className="flex items-center space-x-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-temple-900 text-sandalwood-100">
                  Box 0{item.boxNumber}
                </span>
                <div>
                  <span className="font-bold text-temple-900">{item.name}</span>
                  {item.sanskritName && (
                    <span className="text-vermillion-700 ml-2 font-serif-title">
                      ({item.sanskritName})
                    </span>
                  )}
                  <p className="text-[11px] text-temple-500 mt-0.5">
                    {item.purpose}
                  </p>
                </div>
              </div>

              <span className="font-bold text-temple-900 whitespace-nowrap ml-4">
                {item.quantity} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
