'use client';

import React, { useState } from 'react';
import { INVESTOR_ROADMAP } from '@/data/investorRoadmap';
import { 
  Network, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  Sparkles,
  Award
} from 'lucide-react';

export const InvestorInfrastructureSection: React.FC = () => {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  return (
    <section id="infrastructure" className="py-20 bg-temple-900 text-sandalwood-100 relative overflow-hidden border-t border-brass-800">
      {/* Subtle Background Geometry */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-900/80 border border-brass-500/40 text-brass-300 text-xs font-bold uppercase tracking-widest">
            <Network className="w-3.5 h-3.5" />
            <span>Scale & Strategy</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-sandalwood-50">
            From Samagri to Ritual Infrastructure
          </h2>
          <p className="text-sm text-sandalwood-300 leading-relaxed">
            Puja Karyam is not another e-commerce storefront. We are building the proprietary algorithmic and logistical infrastructure that powers traditional rituals globally.
          </p>
        </div>

        {/* 5-Phase Roadmap Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-10">
          {INVESTOR_ROADMAP.map((phase, idx) => {
            const isSelected = activePhaseIndex === idx;
            return (
              <button
                key={phase.phase}
                type="button"
                onClick={() => setActivePhaseIndex(idx)}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-brass-500/10 border-brass-400 shadow-brass ring-1 ring-brass-400'
                    : 'bg-temple-800/40 border-temple-700/60 hover:border-brass-600/60 text-sandalwood-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brass-400">
                    {phase.phase}
                  </span>
                  {phase.status === 'active' && (
                    <span className="w-2 h-2 rounded-full bg-tulsi-500 animate-pulse" />
                  )}
                </div>
                <h4 className="font-serif-title text-xs font-bold text-sandalwood-100 truncate">
                  {phase.timeline.split('—')[0]}
                </h4>
                <p className="text-[10px] text-sandalwood-400 truncate mt-0.5">
                  {phase.badge}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Phase Deep Dive Card */}
        {(() => {
          const current = INVESTOR_ROADMAP[activePhaseIndex];
          return (
            <div className="bg-gradient-to-br from-temple-800 via-temple-850 to-temple-900 rounded-3xl border border-brass-600/40 p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold tracking-widest uppercase text-brass-400 bg-brass-950 px-2.5 py-1 rounded-md border border-brass-700/40">
                    {current.phase} • {current.timeline}
                  </span>
                  <span className="text-xs text-sandalwood-400 font-medium">
                    Status: {current.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-sandalwood-50">
                  {current.title}
                </h3>

                <p className="text-sm text-sandalwood-300 leading-relaxed">
                  {current.description}
                </p>

                {/* Core Capabilities */}
                <div className="space-y-2 pt-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-brass-300">
                    Defensible Moats & Architectural Capabilities:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-sandalwood-200">
                    {current.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-start space-x-2 p-2 rounded-lg bg-temple-800/80 border border-temple-700/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brass-400 flex-shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics & Unit Economics Showcase */}
              <div className="lg:col-span-5 bg-temple-950/80 rounded-2xl p-6 border border-brass-700/40 space-y-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brass-400">
                  Targeted Operating Metrics
                </h4>

                <div className="space-y-3">
                  {current.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-temple-900 border border-brass-800/80 flex items-center justify-between"
                    >
                      <span className="text-xs text-sandalwood-300">Key Milestone {idx + 1}</span>
                      <span className="font-serif-title text-sm font-bold text-brass-300">
                        {metric}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Multi-Hub Logistics Preview */}
                <div className="pt-3 border-t border-temple-800 text-[11px] text-sandalwood-400 space-y-1">
                  <span className="text-brass-300 font-bold block">Connected Regional Hub Network</span>
                  <div className="flex items-center space-x-3 text-xs text-sandalwood-300 pt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-brass-400" />
                      <span>BLR Central</span>
                    </span>
                    <span>→</span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-brass-400" />
                      <span>MAA South</span>
                    </span>
                    <span>→</span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-brass-400" />
                      <span>HYD Deccan</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Bottom Three Moat Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-temple-800">
          <div className="p-6 rounded-2xl bg-temple-800/30 border border-brass-800/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brass-500/20 border border-brass-500/40 flex items-center justify-center text-brass-400">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-serif-title text-base font-bold text-sandalwood-50">
              Proprietary Knowledge Graph
            </h4>
            <p className="text-xs text-sandalwood-300 leading-relaxed">
              Vedic traditions require structured intelligence, not flat category filters. Our knowledge graph maps over 1,200 regional item substitutions and scaling matrices.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-temple-800/30 border border-brass-800/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brass-500/20 border border-brass-500/40 flex items-center justify-center text-brass-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif-title text-base font-bold text-sandalwood-50">
              Trust & Deduplication Engine
            </h4>
            <p className="text-xs text-sandalwood-300 leading-relaxed">
              By deliberately allowing users to uncheck items they already own, we create unprecedented consumer trust, higher repeat rates, and minimal product wastage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-temple-800/30 border border-brass-800/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brass-500/20 border border-brass-500/40 flex items-center justify-center text-brass-400">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-serif-title text-base font-bold text-sandalwood-50">
              Diaspora Global TAM
            </h4>
            <p className="text-xs text-sandalwood-300 leading-relaxed">
              The $180M Indian diaspora market faces acute shortages of authentic ritual materials. Our export-ready sequenced kits unlock global household loyalty.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
