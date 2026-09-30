'use client';

import React, { useState, useMemo } from 'react';
import { useDataStore } from '@/hooks/useDataStore';
import { ProductCard } from '@/components/store/ProductCard';
import { IntentSearchBar } from '@/components/store/IntentSearchBar';
import { ItemCategory } from '@/types';
import { ShoppingBag, Filter, ArrowUpDown, ShieldCheck } from 'lucide-react';

export default function SamagriPage() {
  const { products: SAMAGRI_PRODUCTS, rituals: RITUALS_DATA, festivals: FESTIVALS_DATA } = useDataStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high'>('recommended');

  const categories = [
    'All',
    'Vessels & Brassware',
    'Sacred Powders & Pastes',
    'Offerings, Grains & Prasad',
    'Lamps, Wicks & Aromatics',
    'Sacred Flora & Leaves',
  ];

  const processedProducts = useMemo(() => {
    let list = SAMAGRI_PRODUCTS;
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    const sorted = [...list];
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }, [selectedCategory, sortBy]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-100 text-brass-800 text-xs font-bold uppercase tracking-widest">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Authenticated Samagri Store</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-temple-900">
          Pure Ritual Ingredients & Brassware
        </h1>
        <p className="text-xs sm:text-sm text-temple-600 max-w-2xl mx-auto leading-relaxed">
          Single-origin Kasturi turmeric, temple-grade Madurai kumkum, pure Bhimseni camphor flakes, and heavy cast brass vessels. Guaranteed unadulterated.
        </p>

        <div className="pt-2 max-w-xl mx-auto">
          <IntentSearchBar />
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-b border-sandalwood-200 pb-4">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
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

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 self-end sm:self-auto text-xs text-temple-700">
          <ArrowUpDown className="w-3.5 h-3.5 text-brass-600" />
          <span className="font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-sandalwood-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-temple-900 focus:outline-none focus:ring-1 focus:ring-brass-400"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {processedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
