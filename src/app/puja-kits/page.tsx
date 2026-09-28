'use client';

import React from 'react';
import { RITUALS_DATA } from '@/data/rituals';
import Link from 'next/link';
import { Package, Compass, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function PujaKitsPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-100 text-brass-800 text-xs font-bold uppercase tracking-widest">
          <Package className="w-3.5 h-3.5" />
          <span>Curated Ceremonial Kits</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-temple-900">
          Complete Puja-Ready Kits
        </h1>
        <p className="text-xs sm:text-sm text-temple-600 max-w-2xl mx-auto leading-relaxed">
          Standardized according to Vedic sequence. Available across Essential (consumables), Complete (with heavy brassware), and Premium Heirloom configurations.
        </p>
      </div>

      {/* Grid of Kits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {RITUALS_DATA.map((ritual) => (
          <div
            key={ritual.id}
            className="bg-white rounded-3xl border border-sandalwood-200 overflow-hidden shadow-subtle hover:shadow-brass transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-temple-900">
              <img
                src={ritual.image}
                alt={ritual.name}
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-temple-900/80 backdrop-blur-md text-sandalwood-100 border border-brass-700/50">
                  {ritual.category}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-sandalwood-100">
                <p className="font-serif-title text-xs text-brass-300">{ritual.sanskritName}</p>
                <h3 className="font-serif-title text-lg font-bold text-white line-clamp-1">{ritual.name} Kit</h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-xs text-temple-600 leading-relaxed line-clamp-2">
                  {ritual.tagline}
                </p>

                {/* Tiers Breakdown */}
                <div className="mt-4 pt-3 border-t border-sandalwood-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-temple-500">Essential (Consumables):</span>
                    <span className="font-bold text-temple-900">₹{ritual.tiers.essential.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brass-800 font-semibold">Complete (Vessels Included):</span>
                    <span className="font-bold text-brass-800">₹{ritual.tiers.complete.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-temple-500">Heirloom Royal:</span>
                    <span className="font-bold text-temple-900">₹{ritual.tiers.premium.price}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-sandalwood-200">
                <Link
                  href={`/puja-kits/${ritual.slug}`}
                  className="px-3 py-2.5 rounded-xl border border-sandalwood-300 hover:border-brass-400 text-temple-800 text-xs font-semibold text-center transition-colors"
                >
                  View Kit
                </Link>

                <Link
                  href={`/build-your-kit?ritual=${ritual.slug}`}
                  className="px-3 py-2.5 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 text-xs font-bold text-center flex items-center justify-center space-x-1 shadow-temple transition-all"
                >
                  <span>Customize</span>
                  <ArrowRight className="w-3 h-3 text-brass-400" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
