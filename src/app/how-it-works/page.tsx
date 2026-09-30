'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Compass, 
  Layers, 
  CheckCircle2, 
  Truck, 
  QrCode, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Check,
  ShoppingBag 
} from 'lucide-react';
import { RitualBoxPackagingView } from '@/components/guide/RitualBoxPackagingView';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Consult the Ritual Knowledge Graph',
      subtitle: 'Canonical Vedic intelligence without guesswork',
      desc: 'Whether performing Griha Pravesh, Varalakshmi Vrata, or Satyanarayana Swamy Puja, select your ceremony and regional tradition (Karnataka Smartha, Tamil Iyer, Telugu Vaidiki, Kerala Tantric). Samptrapthi instantly maps the exact list of 25+ sacred items prescribed by tradition.',
      features: [
        'Precise item quantities tailored to devotee headcount',
        'Specific regional leaves, powders, and vessel requirements',
        'Zero missing materials on ceremony day',
      ],
    },
    {
      number: '02',
      title: 'Personalize with "I Have This" Deduplication',
      subtitle: 'Pay only for what you actually need to procure',
      desc: 'Most Indian homes already own brass diyas, a Kalasha vessel, or a copper Panchapatra. Our signature deduplication engine lets you uncheck items you already possess. We calculate the price deduction in real-time, eliminating redundant clutter.',
      features: [
        'Instant live price reduction for owned items',
        'Zero waste: no redundant brassware accumulation',
        'Customized procurement manifest generated in seconds',
      ],
    },
    {
      number: '03',
      title: '4-Box Ritual-Ready Sequenced Packing',
      subtitle: 'Items organized chronologically as the priest requests them',
      desc: 'Instead of an unorganized carton of mixed bags, Samptrapthi packs every order into four distinct, sequentially labeled boxes matching the natural procedural stages of the puja.',
      features: [
        'Box 01: Preparation (Shuddhi, Red Silk Peeta Asana, Ganga Jal, Lamps, Wicks)',
        'Box 02: Kalasha (Brass Kalasha, Crowned Coconut, Mango leaves, Sacred Powders, Akshata)',
        'Box 03: Offerings & Florals (Fresh Marigold garlands, Betel leaves, Supari, Prasad mix)',
        'Box 04: Mangala Aarti (Bhimseni Camphor, Dhoop, Pancha-Aarti lamp, Bell)',
      ],
    },
    {
      number: '04',
      title: 'Consecrated JIT Delivery & Digital QR Guide',
      subtitle: 'Fresh flowers available where supported, with audio mantra companion',
      desc: 'Dry consumables and brassware are sealed in advance from our regional hubs in Bengaluru, Chennai, and Hyderabad. Box 03 fresh floral garlands are strung and packed hours before your auspicious morning muhurtha. Scan the box QR code for step-by-step setup guidance and authentic Sanskrit mantra audio.',
      features: [
        'Guaranteed delivery before your scheduled muhurtham',
        'Panchamrita dry kit and certified unadulterated edible camphor',
        'Digital QR Companion with multilingual pronunciation audio',
      ],
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brass-100 border border-brass-300/80 text-brass-800 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-brass-600" />
          <span>The Samptrapthi Standard</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-temple-900 tracking-tight">
          How Samptrapthi Works
        </h1>
        <p className="text-sm sm:text-base text-temple-600 leading-relaxed">
          From the first item to the final offering, we transform ritual procurement into a modern, serene experience—rooted in cultural reverence, single-origin purity, and logistical precision.
        </p>
      </div>

      {/* 4 Process Pillars */}
      <div className="space-y-10">
        {steps.map((step, idx) => (
          <div
            key={step.number}
            className={`flex flex-col lg:flex-row items-center gap-8 bg-white rounded-3xl p-6 sm:p-10 border border-sandalwood-200 shadow-subtle ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Number & Highlight */}
            <div className="lg:w-1/3 flex flex-col justify-center items-start space-y-3">
              <span className="font-serif-title text-6xl sm:text-7xl font-bold text-brass-500/80">
                {step.number}
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900 leading-tight">
                {step.title}
              </h2>
              <p className="text-xs font-semibold text-brass-700 uppercase tracking-wider">
                {step.subtitle}
              </p>
            </div>

            {/* Description & Features */}
            <div className="lg:w-2/3 space-y-4">
              <p className="text-sm text-temple-700 leading-relaxed">
                {step.desc}
              </p>

              <div className="space-y-2 pt-2 border-t border-sandalwood-100">
                {step.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start space-x-2 text-xs text-temple-800">
                    <CheckCircle2 className="w-4 h-4 text-tulsi-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual 4-Box Packaging Component */}
      <RitualBoxPackagingView />

      {/* Multi-Hub Fulfillment Map & Guarantee */}
      <div className="bg-temple-900 rounded-3xl p-8 sm:p-12 text-sandalwood-100 border border-brass-800 shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brass-400">
            Fulfillment Network
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-sandalwood-50">
            Tri-City Dedicated Regional Hubs
          </h2>
          <p className="text-xs sm:text-sm text-sandalwood-300">
            Curated ritual materials are stored under climate-controlled mandir conditions and dispatched directly across Karnataka, Tamil Nadu, and Telangana/AP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-temple-800/60 border border-temple-700 space-y-2">
            <div className="flex items-center space-x-2 text-brass-400 font-bold">
              <MapPin className="w-4 h-4" />
              <span>Bengaluru Central Hub</span>
            </div>
            <p className="text-sandalwood-300">HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038</p>
            <p className="text-tulsi-400 font-semibold pt-1">✓ Serving Greater Bengaluru &amp; Mysore</p>
          </div>

          <div className="p-5 rounded-2xl bg-temple-800/60 border border-temple-700 space-y-2">
            <div className="flex items-center space-x-2 text-brass-400 font-bold">
              <MapPin className="w-4 h-4" />
              <span>Chennai South Hub</span>
            </div>
            <p className="text-sandalwood-300">Luz Church Road, Mylapore, Chennai, TN 600004</p>
            <p className="text-tulsi-400 font-semibold pt-1">✓ Serving Greater Chennai &amp; Kanchipuram</p>
          </div>

          <div className="p-5 rounded-2xl bg-temple-800/60 border border-temple-700 space-y-2">
            <div className="flex items-center space-x-2 text-brass-400 font-bold">
              <MapPin className="w-4 h-4" />
              <span>Hyderabad Deccan Hub</span>
            </div>
            <p className="text-sandalwood-300">RP Road, Secunderabad, Telangana 500003</p>
            <p className="text-tulsi-400 font-semibold pt-1">✓ Serving Hyderabad, Secunderabad &amp; Cyberabad</p>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/plan-your-puja"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold text-sm shadow-temple flex items-center justify-center space-x-2"
        >
          <Compass className="w-4 h-4 text-brass-400" />
          <span>Plan Your Ritual Now</span>
          <ArrowRight className="w-4 h-4 text-brass-400" />
        </Link>

        <Link
          href="/samagri"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-sandalwood-100 border border-sandalwood-300 text-temple-900 font-bold text-sm shadow-subtle flex items-center justify-center space-x-2"
        >
          <ShoppingBag className="w-4 h-4 text-brass-600" />
          <span>Browse Sacred Samagri</span>
        </Link>
      </div>
    </div>
  );
}
