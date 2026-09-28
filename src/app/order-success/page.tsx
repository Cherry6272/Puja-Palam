'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Calendar, 
  QrCode, 
  ArrowRight, 
  ShieldCheck, 
  Truck,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'PK-78294';

  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C59B27', '#B33927', '#FAF7F2'],
      });
    } catch {
      // ignore
    }

    try {
      const saved = localStorage.getItem('pk_last_placed_order');
      if (saved) {
        setOrderData(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Confirmation Hero Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sandalwood-200 shadow-temple text-center space-y-5">
        <div className="w-18 h-18 rounded-full bg-tulsi-100 text-tulsi-600 flex items-center justify-center mx-auto shadow-brass w-16 h-16">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
            Consecrated Procurement Confirmed
          </span>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-temple-900">
            Your Puja Karyam is Being Prepared
          </h1>
          <p className="text-xs sm:text-sm text-temple-600 max-w-lg mx-auto leading-relaxed pt-1">
            Order <strong>#{orderId}</strong> has been received and routed to our nearest regional fulfillment center. All materials will be packed in 4-box ritual sequence.
          </p>
        </div>

        {/* Order Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-4 max-w-2xl mx-auto">
          <div className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-temple-400 block">Order Ref</span>
            <span className="font-mono font-bold text-temple-900">{orderId}</span>
          </div>

          <div className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-temple-400 block">Fulfillment Hub</span>
            <span className="font-bold text-temple-900">
              {orderData?.assignedHub?.split('(')[0] || 'Bengaluru Central'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-temple-400 block">Scheduled Date</span>
            <span className="font-bold text-temple-900">
              {orderData?.customer?.ritualDate || 'Upcoming Muhurta'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-temple-400 block">Total Amount</span>
            <span className="font-bold text-temple-900">
              {orderData?.total ? `₹${orderData.total.toLocaleString('en-IN')}` : '₹3,499'}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Box Sequenced Packaging Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sandalwood-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-title text-xl font-bold text-temple-900">
              4-Box Assembly &amp; Delivery Progress
            </h2>
            <p className="text-xs text-temple-500">
              Consecrated packing strictly in order of ceremonial progression.
            </p>
          </div>
          <span className="text-xs font-bold text-tulsi-700 bg-tulsi-50 px-3 py-1 rounded-full border border-tulsi-200">
            Demo Order State
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-tulsi-50 border border-tulsi-200 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-tulsi-800 uppercase block">Box 01 (Preparation)</span>
            <span className="font-bold text-tulsi-900">Assembled &amp; Inspected</span>
            <p className="text-[11px] text-tulsi-700">Silk asana, Ganga jal, twin brass lamps, wicks</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Box 02 (Kalasha)</span>
            <span className="font-bold text-amber-900">Weighing Ingredients</span>
            <p className="text-[11px] text-amber-700">Kalasha vessel, coconut, kumkum, haldi, navadhanya</p>
          </div>

          <div className="p-4 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-temple-500 uppercase block">Box 03 (Offerings)</span>
            <span className="font-semibold text-temple-800">Scheduled for Fresh Harvest</span>
            <p className="text-[11px] text-temple-500">Marigold garlands &amp; betel leaves strung at 5:00 AM</p>
          </div>

          <div className="p-4 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-temple-500 uppercase block">Box 04 (Aarti)</span>
            <span className="font-semibold text-temple-800">Sealed in QC</span>
            <p className="text-[11px] text-temple-500">Pure Bhimseni camphor, temple loban dhoop, bell</p>
          </div>
        </div>
      </div>

      {/* Next Steps & CTAs */}
      <div className="bg-gradient-to-br from-temple-900 via-temple-850 to-temple-900 rounded-3xl p-8 text-sandalwood-100 border border-brass-600/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 text-brass-400 text-xs font-bold uppercase">
            <QrCode className="w-4 h-4" />
            <span>Digital Companion Ready</span>
          </div>
          <h3 className="font-serif-title text-xl font-bold text-sandalwood-50">
            Open the Digital Ritual Guide
          </h3>
          <p className="text-xs text-sandalwood-300 max-w-md leading-relaxed">
            Preview the step-by-step setup order, unboxing checklist, and Vedic audio mantra player while your kit is prepared.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/guide"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-brass transition-all whitespace-nowrap"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Ritual Guide</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-brass-600/50 hover:bg-temple-800 text-sandalwood-200 font-semibold text-xs flex items-center justify-center transition-colors whitespace-nowrap"
          >
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-temple-500">Loading Order Confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
