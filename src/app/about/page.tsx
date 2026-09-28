'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Flame, 
  ShieldCheck, 
  Compass, 
  MapPin, 
  Layers, 
  Heart, 
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-brass-100 text-brass-800 text-xs font-bold uppercase tracking-widest">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Heritage × Design × Technology</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-temple-900 leading-tight">
          Everything Your Ritual Needs. Thoughtfully Prepared.
        </h1>
        <p className="text-xs sm:text-sm text-temple-600 leading-relaxed max-w-2xl mx-auto">
          Puja Karyam was founded on a simple observation: families know what sacred ceremonies they wish to observe, but navigating the 30+ scattered, unstandardized materials creates unnecessary anxiety. We transform ritual procurement into a modern, serene experience.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-sandalwood-200 shadow-subtle space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brass-100 text-brass-800 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6 text-brass-700" />
          </div>
          <h3 className="font-serif-title text-xl font-bold text-temple-900">
            Ritual Knowledge Graph
          </h3>
          <p className="text-xs text-temple-600 leading-relaxed">
            Our proprietary knowledge graph understands traditions—from Karnataka Smartha and Tamil Iyer to Telugu Vaidiki and Kerala Tantric canons—ensuring exact regional item matches and appropriate substitutions.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-sandalwood-200 shadow-subtle space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brass-100 text-brass-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 text-brass-700" />
          </div>
          <h3 className="font-serif-title text-xl font-bold text-temple-900">
            Purity Without Compromise
          </h3>
          <p className="text-xs text-temple-600 leading-relaxed">
            Every product is single-origin: stone-ground Salem turmeric, slaked-lime Madurai kumkum, pure A2 Gir cow ghee wicks, and 100% botanical Bhimseni camphor crystals. No synthetic dyes or cheap filler adulterants.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-sandalwood-200 shadow-subtle space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brass-100 text-brass-800 flex items-center justify-center font-bold">
            <MapPin className="w-6 h-6 text-brass-700" />
          </div>
          <h3 className="font-serif-title text-xl font-bold text-temple-900">
            Tri-City Hub Network
          </h3>
          <p className="text-xs text-temple-600 leading-relaxed">
            Fulfillment hubs in Bengaluru Central, Chennai South, and Hyderabad Deccan assemble materials into 4 sequenced boxes and pack fresh morning florals hours before your auspicious muhurta.
          </p>
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="bg-gradient-to-br from-temple-900 via-temple-850 to-temple-900 rounded-3xl p-8 sm:p-12 text-sandalwood-100 border border-brass-600/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-serif-title text-2xl font-bold text-sandalwood-50">
            Ready to plan your next family ceremony?
          </h3>
          <p className="text-xs text-sandalwood-300 max-w-md leading-relaxed">
            Try our guided planner to customize your ritual kit and remove items you already own at home.
          </p>
        </div>
        <Link
          href="/plan-your-puja"
          className="px-8 py-4 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs flex items-center space-x-2 shadow-brass transition-all whitespace-nowrap"
        >
          <Compass className="w-4 h-4" />
          <span>Plan My Ritual</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
