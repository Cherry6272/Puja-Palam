'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/hooks/useDataStore';
import Link from 'next/link';
import { SouthIndianRegion } from '@/types';
import { 
  Calendar, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Layers, 
  ShoppingBag,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function FestivalsDirectoryPage() {
  const { products: SAMAGRI_PRODUCTS, rituals: RITUALS_DATA, festivals: FESTIVALS_DATA } = useDataStore();

  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  const seasons = [
    { id: 'all', label: 'All Seasons' },
    { id: 'Shravana', label: 'Shravana (Jul – Aug)' },
    { id: 'Bhadrapada', label: 'Bhadrapada (Aug – Sep)' },
    { id: 'Ashwina', label: 'Ashwina / Dasara (Sep – Oct)' },
    { id: 'Kartika', label: 'Kartika / Deepavali (Oct – Nov)' },
    { id: 'Chaitra', label: 'Chaitra / Ugadi (Mar – Apr)' },
    { id: 'Thai', label: 'Thai / Pongal (Jan)' },
  ];

  const regions: { id: string; label: string }[] = [
    { id: 'all', label: 'All South India' },
    { id: 'karnataka', label: 'Karnataka (ಕರ್ನಾಟಕ)' },
    { id: 'tamil-nadu', label: 'Tamil Nadu (தமிழ்நாடு)' },
    { id: 'andhra-pradesh', label: 'Andhra & Telangana (తెలుగు)' },
    { id: 'kerala', label: 'Kerala (കേരളം)' },
  ];

  const filteredFestivals = FESTIVALS_DATA.filter((fest) => {
    const matchesRegion =
      selectedRegion === 'all' ||
      fest.regions.includes(selectedRegion as SouthIndianRegion);
    const matchesSeason =
      selectedSeason === 'all' || fest.season.includes(selectedSeason);
    return matchesRegion && matchesSeason;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brass-100 border border-brass-300/80 text-brass-800 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-brass-600" />
          <span>Vedic Calendar &amp; Seasonal Traditions</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-temple-900 tracking-tight">
          South Indian Sacred Festivals
        </h1>
        <p className="text-sm sm:text-base text-temple-600 leading-relaxed">
          From Varamahalakshmi and Ganesha Habba to Ugadi, Vishu, and Thai Pongal — discover authentic regional rituals, required samagri manifests, and consecrated festival kits.
        </p>
      </div>

      {/* Seasonal & Regional Filter Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-sandalwood-200 shadow-subtle space-y-4">
        {/* Regions */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-temple-500 mr-2 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-brass-600" />
            Region:
          </span>
          {regions.map((reg) => (
            <button
              key={reg.id}
              type="button"
              onClick={() => setSelectedRegion(reg.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedRegion === reg.id
                  ? 'bg-temple-900 text-sandalwood-50 shadow-temple'
                  : 'bg-sandalwood-100 text-temple-700 hover:bg-sandalwood-200'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>

        {/* Seasons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sandalwood-100">
          <span className="text-xs font-bold uppercase tracking-wider text-temple-500 mr-2 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-brass-600" />
            Season:
          </span>
          {seasons.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSeason(s.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedSeason === s.id
                  ? 'bg-brass-500 text-temple-950 font-bold shadow-xs'
                  : 'text-temple-600 hover:text-temple-900 hover:bg-sandalwood-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Festivals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFestivals.map((fest) => (
          <div
            key={fest.id}
            className="group bg-white rounded-3xl border border-sandalwood-200 overflow-hidden shadow-subtle hover:shadow-brass transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Header */}
            <div className="relative aspect-[16/10] overflow-hidden bg-temple-900">
              <img
                src={fest.heroImage}
                alt={fest.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-temple-950 via-temple-900/40 to-transparent" />

              {/* Season Badge */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-bold">
                <span className="px-2.5 py-1 rounded-full bg-temple-900/80 backdrop-blur-md text-sandalwood-100 border border-brass-700/50 uppercase tracking-wider">
                  {fest.season}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-brass-500 text-temple-950 font-bold">
                  {fest.upcomingDate.split(',')[0]}
                </span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-3 right-3 text-sandalwood-100">
                <p className="font-serif-title text-xs text-brass-300">
                  {fest.sanskritName}
                </p>
                <h3 className="font-serif-title text-xl font-bold text-white line-clamp-1">
                  {fest.name}
                </h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <p className="text-xs text-temple-600 leading-relaxed line-clamp-3">
                  {fest.description}
                </p>

                {/* Cultural practice teaser */}
                {fest.culturalTraditionNotes[0] && (
                  <div className="p-2.5 rounded-xl bg-sandalwood-50 border border-sandalwood-200 text-[11px] text-temple-700">
                    <span className="font-bold text-brass-800 block">
                      {fest.culturalTraditionNotes[0].region} Practice:
                    </span>
                    <span className="line-clamp-1 italic">
                      {fest.culturalTraditionNotes[0].distinctOfferings.slice(0, 2).join(' • ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Regions and Action CTA */}
              <div className="pt-3 border-t border-sandalwood-200 space-y-3">
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {fest.regions.map((r) => (
                    <span key={r} className="px-2 py-0.5 rounded-full bg-sandalwood-100 text-temple-600 capitalize">
                      {r.replace('-', ' ')}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/festivals/${fest.slug}`}
                  className="w-full py-2.5 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 text-xs font-bold flex items-center justify-center space-x-1.5 shadow-temple transition-all group-hover:bg-brass-600 group-hover:text-temple-950"
                >
                  <span>Explore Festival &amp; Procure Kit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
