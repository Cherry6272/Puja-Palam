'use client';

import React, { useState, useMemo } from 'react';
import { RITUALS_DATA } from '@/data/rituals';
import { RitualCard } from '@/components/store/RitualCard';
import { IntentSearchBar } from '@/components/store/IntentSearchBar';
import { RitualCategory } from '@/types';
import { Compass, Sparkles, Filter, Layers, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RitualsIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Vrata', 'Samskara', 'Griha', 'Festival'];

  const filteredRituals = useMemo(() => {
    if (selectedCategory === 'All') return RITUALS_DATA;
    return RITUALS_DATA.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-100 text-brass-800 text-xs font-bold uppercase tracking-widest">
          <Compass className="w-3.5 h-3.5" />
          <span>Vedic Canon Directory</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-temple-900">
          Canonical Vedic Rituals
        </h1>
        <p className="text-xs sm:text-sm text-temple-600 max-w-2xl mx-auto leading-relaxed">
          Explore structured requirements for South and Pan-Indian ceremonies. Every ritual translates directly into an itemized, 4-box sequenced procurement kit.
        </p>

        <div className="pt-2 max-w-xl mx-auto">
          <IntentSearchBar />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-brass-500 text-temple-950 shadow-brass'
                : 'bg-white border border-sandalwood-300 text-temple-700 hover:bg-sandalwood-100'
            }`}
          >
            {cat === 'All' ? 'All Rituals' : `${cat} Rituals`}
          </button>
        ))}
      </div>

      {/* Rituals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRituals.map((ritual) => (
          <RitualCard key={ritual.id} ritual={ritual} />
        ))}
      </div>

      {/* Custom Ritual Consultation Card */}
      <div className="bg-gradient-to-r from-brass-100 via-sandalwood-100 to-brass-100 rounded-3xl p-8 border border-brass-300 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif-title text-xl font-bold text-temple-900">
            Need an unlisted family ritual or temple festival kit?
          </h3>
          <p className="text-xs text-temple-600">
            Our Vedic scholars and regional procurement coordinators curate bespoke samagri kits.
          </p>
        </div>
        <Link
          href="/plan-your-puja"
          className="px-6 py-3 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 text-xs font-bold flex items-center space-x-2 shadow-temple transition-all whitespace-nowrap"
        >
          <span>Use Custom Planner</span>
          <ArrowRight className="w-4 h-4 text-brass-400" />
        </Link>
      </div>
    </div>
  );
}
