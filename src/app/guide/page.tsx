'use client';

import React from 'react';
import { DigitalRitualGuideModal } from '@/components/guide/DigitalRitualGuideModal';
import { RitualBoxPackagingView } from '@/components/guide/RitualBoxPackagingView';
import { QrCode, BookOpen, ShieldCheck, Sparkles, Volume2 } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brass-100 text-brass-800 text-xs font-bold uppercase tracking-widest">
          <QrCode className="w-4 h-4 text-brass-600" />
          <span>Scan-to-Prepare Digital Companion</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-temple-900">
          Digital Ritual Guide & Unboxing Sequence
        </h1>
        <p className="text-xs sm:text-sm text-temple-600 max-w-2xl mx-auto leading-relaxed">
          Every Puja Karyam kit comes stamped with a unique batch QR code. Scanning it opens your ceremony’s preparation timeline, box unpacking steps, and audio pronunciation guides.
        </p>
      </div>

      {/* Main Digital Guide Interactive Console */}
      <DigitalRitualGuideModal />

      {/* 4-Box Sequenced Packaging Breakdown */}
      <RitualBoxPackagingView />
    </div>
  );
}
