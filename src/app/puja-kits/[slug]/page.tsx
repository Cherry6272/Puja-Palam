'use client';

import React, { useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { RITUALS_DATA } from '@/data/rituals';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { 
  Package, 
  ChevronRight, 
  Check, 
  ShoppingBag, 
  Compass, 
  ShieldCheck, 
  Truck,
  ArrowRight
} from 'lucide-react';

export default function KitDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { addCustomizedKit } = useCart();

  // Look up by exact slug or with '-kit' stripped
  const cleanedSlug = slug.replace(/-kit$/, '');
  const ritual = RITUALS_DATA.find((r) => r.slug === slug || r.slug === cleanedSlug);
  if (!ritual) {
    return notFound();
  }

  const [selectedTierKey, setSelectedTierKey] = useState<'essential' | 'complete' | 'premium'>('complete');
  const activeTier = ritual.tiers[selectedTierKey];

  const handleQuickAdd = () => {
    addCustomizedKit({
      id: `kit-${Date.now()}`,
      ritualId: ritual.id,
      ritualName: `${ritual.name} (${activeTier.name})`,
      tier: selectedTierKey,
      tradition: 'karnataka-smartha',
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
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-temple-500">
        <Link href="/" className="hover:text-brass-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/puja-kits" className="hover:text-brass-700">Puja Kits</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-temple-900 font-semibold">{ritual.name} Kit</span>
      </nav>

      {/* Main Kit Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-sandalwood-200 shadow-temple">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-brass-100 text-brass-800">
              {ritual.category} Kit
            </span>
            <span className="text-xs text-temple-500 font-medium">
              4-Box Sequenced Assembly
            </span>
          </div>

          <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-temple-900">
            {ritual.name} Kit
          </h1>

          <p className="font-serif-title text-base text-vermillion-700">
            {ritual.sanskritName}
          </p>

          <p className="text-sm text-temple-600 leading-relaxed max-w-xl">
            {ritual.tagline}. Pre-packaged according to authentic Vedic sequencing in Boxes 01 to 04 with QR code digital ritual guide integration.
          </p>

          {/* Pricing & CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold text-xs flex items-center justify-center space-x-2 shadow-temple transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-brass-300" />
              <span>Add {activeTier.name} (₹{activeTier.price.toLocaleString('en-IN')})</span>
            </button>

            <Link
              href={`/build-your-kit?ritual=${ritual.slug}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-brass transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Customize / Remove Owned Items</span>
            </Link>
          </div>
        </div>

        {/* Visual Card */}
        <div className="lg:col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-temple-900 border border-brass-400/40 shadow-2xl">
          <img
            src={ritual.image}
            alt={ritual.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-temple-950 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-sandalwood-100 flex items-center justify-between text-xs">
            <span className="bg-temple-900/80 px-3 py-1 rounded-full border border-brass-700/50">
              Sequenced Packaging
            </span>
            <span className="text-brass-300 font-semibold">
              {ritual.baseRequiredItems.length} Materials Included
            </span>
          </div>
        </div>
      </div>

      {/* Tier Switcher */}
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
  );
}
