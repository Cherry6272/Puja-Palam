'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RITUALS_DATA } from '@/data/rituals';
import { SAMAGRI_PRODUCTS } from '@/data/products';
import { RitualCard } from '@/components/store/RitualCard';
import { ProductCard } from '@/components/store/ProductCard';
import { IntentSearchBar } from '@/components/store/IntentSearchBar';
import { ItemCategory } from '@/types';
import { Filter, Sparkles, Compass, ShoppingBag, Layers } from 'lucide-react';
import Link from 'next/link';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'rituals' | 'kits' | 'samagri') || 'rituals';

  const [activeTab, setActiveTab] = useState<'rituals' | 'kits' | 'samagri'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Vessels & Brassware',
    'Sacred Powders & Pastes',
    'Offerings, Grains & Prasad',
    'Lamps, Wicks & Aromatics',
    'Sacred Flora & Leaves',
  ];

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return SAMAGRI_PRODUCTS;
    return SAMAGRI_PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-100 text-brass-800 text-xs font-bold uppercase">
          <Layers className="w-3.5 h-3.5" />
          <span>Structured Ritual Catalog</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-temple-900">
          Everything Required. Thoughtfully Organized.
        </h1>
        <p className="text-xs sm:text-sm text-temple-600 max-w-xl mx-auto">
          Explore canonical ritual packages, complete ceremonial kits, or individually authenticated pure samagri.
        </p>

        <div className="pt-3 max-w-xl mx-auto">
          <IntentSearchBar />
        </div>
      </div>

      {/* Main Tabs: Rituals vs Kits vs Samagri */}
      <div className="flex items-center justify-center border-b border-sandalwood-200">
        <button
          type="button"
          onClick={() => setActiveTab('rituals')}
          className={`py-4 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'rituals'
              ? 'border-brass-600 text-brass-800'
              : 'border-transparent text-temple-500 hover:text-temple-900'
          }`}
        >
          Rituals ({RITUALS_DATA.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kits')}
          className={`py-4 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'kits'
              ? 'border-brass-600 text-brass-800'
              : 'border-transparent text-temple-500 hover:text-temple-900'
          }`}
        >
          Puja Kits ({RITUALS_DATA.length * 3} Configurations)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('samagri')}
          className={`py-4 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'samagri'
              ? 'border-brass-600 text-brass-800'
              : 'border-transparent text-temple-500 hover:text-temple-900'
          }`}
        >
          Samagri Store ({SAMAGRI_PRODUCTS.length} Verified SKUs)
        </button>
      </div>

      {/* Tab 1: Rituals Grid */}
      {activeTab === 'rituals' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RITUALS_DATA.map((ritual) => (
            <RitualCard key={ritual.id} ritual={ritual} />
          ))}
        </div>
      )}

      {/* Tab 2: Kits Grid */}
      {activeTab === 'kits' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RITUALS_DATA.map((ritual) => (
              <div
                key={ritual.id}
                className="bg-white rounded-3xl border border-sandalwood-200 p-6 shadow-subtle space-y-4 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brass-100 text-brass-800">
                    Complete Kit Package
                  </span>
                  <h3 className="font-serif-title text-xl font-bold text-temple-900 mt-2">
                    {ritual.name} Kit
                  </h3>
                  <p className="text-xs text-vermillion-700 font-serif-title">
                    {ritual.sanskritName}
                  </p>
                  <p className="text-xs text-temple-600 mt-2 leading-relaxed">
                    {ritual.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-sandalwood-100 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-temple-500">Essential (Consumables):</span>
                    <span className="font-bold text-temple-900">₹{ritual.tiers.essential.price}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-brass-800 font-semibold">Complete (Vessels + Items):</span>
                    <span className="font-bold text-brass-800">₹{ritual.tiers.complete.price}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-temple-500">Heirloom Royal:</span>
                    <span className="font-bold text-temple-900">₹{ritual.tiers.premium.price}</span>
                  </div>

                  <Link
                    href={`/planner?ritual=${ritual.slug}`}
                    className="w-full py-2.5 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 text-xs font-bold text-center block transition-colors shadow-temple"
                  >
                    Customize Kit in Planner →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Samagri Store Grid */}
      {activeTab === 'samagri' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brass-500 text-temple-950 font-bold shadow-xs'
                    : 'bg-white border border-sandalwood-300 text-temple-700 hover:bg-sandalwood-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-temple-500">Loading Catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
