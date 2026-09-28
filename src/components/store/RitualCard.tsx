'use client';

import React from 'react';
import Link from 'next/link';
import { Ritual } from '@/types';
import { Compass, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  ritual: Ritual;
}

export const RitualCard: React.FC<Props> = ({ ritual }) => {
  return (
    <div className="group bg-white rounded-3xl border border-sandalwood-200 overflow-hidden shadow-subtle hover:shadow-brass transition-all duration-300 flex flex-col justify-between">
      {/* Visual Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-temple-900">
        <img
          src={ritual.image}
          alt={ritual.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-temple-950 via-temple-900/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-temple-900/80 backdrop-blur-md text-sandalwood-100 border border-brass-700/50">
            {ritual.category}
          </span>
          <span className="text-[10px] font-semibold text-brass-300 bg-temple-950/80 px-2 py-0.5 rounded-full">
            {ritual.deity}
          </span>
        </div>

        {/* Bottom Sanskrit & Tagline overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-sandalwood-100">
          <p className="font-serif-title text-xs text-brass-300">
            {ritual.sanskritName}
          </p>
          <h3 className="font-serif-title text-xl font-bold text-white line-clamp-1">
            {ritual.name}
          </h3>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <p className="text-xs text-temple-600 leading-relaxed line-clamp-2">
            {ritual.tagline}
          </p>

          <div className="mt-3 pt-3 border-t border-sandalwood-100 flex items-center justify-between text-xs text-temple-500">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-brass-600" />
              <span>{ritual.typicalDuration}</span>
            </span>
            <span className="font-semibold text-temple-700">
              {ritual.baseRequiredItems.length} Required Items
            </span>
          </div>
        </div>

        {/* Tiers Pricing & CTAs */}
        <div className="pt-2 border-t border-sandalwood-200">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-[11px] text-temple-500 uppercase tracking-wider">
              Kit Tiers From
            </span>
            <span className="font-serif-title text-lg font-bold text-temple-900">
              ₹{ritual.tiers.essential.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/rituals/${ritual.slug}`}
              className="px-3 py-2 rounded-xl border border-sandalwood-300 hover:border-brass-500 text-temple-800 text-xs font-semibold text-center transition-colors"
            >
              View Details
            </Link>

            <Link
              href={`/planner?ritual=${ritual.slug}`}
              className="px-3 py-2 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 text-xs font-bold text-center flex items-center justify-center space-x-1 transition-all shadow-temple"
            >
              <span>Customize</span>
              <ArrowRight className="w-3 h-3 text-brass-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
