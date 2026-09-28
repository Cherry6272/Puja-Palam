'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RITUALS_DATA } from '@/data/rituals';
import { useCart } from '@/context/CartContext';
import { RegionalTradition } from '@/types';
import { 
  Compass, 
  Check, 
  ShoppingBag, 
  Trash2, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Layers, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

function BuildYourKitContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get('ritual') || RITUALS_DATA[0].slug;

  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug);
  const [selectedTradition, setSelectedTradition] = useState<RegionalTradition>('karnataka-smartha');
  const [selectedTier, setSelectedTier] = useState<'essential' | 'complete' | 'premium'>('complete');
  const [peopleCount, setPeopleCount] = useState(15);
  const [ownedItemIds, setOwnedItemIds] = useState<string[]>([]);
  const [activeSubstitutions, setActiveSubstitutions] = useState<Record<string, string>>({});

  const { addCustomizedKit } = useCart();

  const ritual = useMemo(() => {
    return (
      RITUALS_DATA.find((r) => r.slug === selectedSlug || r.id === selectedSlug) ||
      RITUALS_DATA[0]
    );
  }, [selectedSlug]);

  // Scaled items based on guest count
  const scaledItems = useMemo(() => {
    const scaleFactor = Math.max(1, peopleCount / 10);
    return ritual.baseRequiredItems.map((item) => {
      let scaledQty = item.quantity;
      if (item.unit.includes('grams') && item.category === 'Offerings, Grains & Prasad') {
        scaledQty = Math.round(item.quantity * scaleFactor);
      } else if (item.unit === 'leaves' || item.name.includes('Betel')) {
        scaledQty = Math.round(item.quantity * (peopleCount / 8));
      }
      return {
        ...item,
        quantity: Math.max(1, scaledQty),
      };
    });
  }, [ritual, peopleCount]);

  // Financial calculations
  const basePrice = ritual.tiers[selectedTier].price;

  const ownedSavings = useMemo(() => {
    return scaledItems
      .filter((i) => ownedItemIds.includes(i.id))
      .reduce((sum, i) => sum + Math.round(i.estimatedPrice * (selectedTier === 'premium' ? 1.4 : 1)), 0);
  }, [scaledItems, ownedItemIds, selectedTier]);

  const finalPrice = Math.max(650, basePrice - ownedSavings);

  const toggleOwned = (id: string) => {
    setOwnedItemIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleAddKitToCart = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#C59B27', '#B33927'],
      });
    } catch {
      // ignore
    }

    addCustomizedKit({
      id: `custom-kit-${Date.now()}`,
      ritualId: ritual.id,
      ritualName: `${ritual.name} (Custom Kit)`,
      tier: selectedTier,
      tradition: selectedTradition,
      peopleCount,
      date: new Date().toISOString().split('T')[0],
      venue: 'Home Mandir',
      basePrice,
      finalPrice,
      ownedItemIds,
      activeSubstitutions,
      items: scaledItems,
      totalItemsCount: scaledItems.length,
      procuredItemsCount: scaledItems.filter((i) => !ownedItemIds.includes(i.id)).length,
      savedAmount: ownedSavings,
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-100 text-brass-800 text-xs font-bold uppercase tracking-widest">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Kit Customizer</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-temple-900">
          Build Your Own Puja Kit
        </h1>
        <p className="text-xs sm:text-sm text-temple-600 max-w-2xl mx-auto leading-relaxed">
          Select your ritual, customize devotee quantities, and uncheck items you already own at home. Watch the procurement price and packaging manifest update in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Configuration Controls & Checklist */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Ritual Selection */}
          <div className="bg-white rounded-3xl p-6 border border-sandalwood-200 shadow-subtle space-y-3">
            <h3 className="font-serif-title text-base font-bold text-temple-900">
              1. Select Ceremony
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RITUALS_DATA.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSelectedSlug(r.slug);
                    setOwnedItemIds([]);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    ritual.id === r.id
                      ? 'bg-brass-50 border-brass-500 font-bold text-temple-950 ring-1 ring-brass-400'
                      : 'border-sandalwood-200 text-temple-700 hover:bg-sandalwood-50'
                  }`}
                >
                  <span className="text-xs line-clamp-1">{r.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Configuration: Attendees & Preparation Tier */}
          <div className="bg-white rounded-3xl p-6 border border-sandalwood-200 shadow-subtle grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-temple-800 uppercase">
                <span>Devotees Attending</span>
                <span className="text-brass-700 font-serif-title text-sm font-bold">{peopleCount} People</span>
              </div>
              <input
                type="range"
                min={2}
                max={60}
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-sandalwood-200 rounded-lg appearance-none cursor-pointer accent-brass-600"
              />
              <span className="text-[11px] text-temple-500 block">
                Automatically adjusts Tamboolam leaves & fresh flower weights
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-temple-800 uppercase block">
                Preparation Tier
              </span>
              <div className="grid grid-cols-3 gap-1 bg-sandalwood-100 p-1 rounded-xl text-xs">
                {(['essential', 'complete', 'premium'] as const).map((tierKey) => (
                  <button
                    key={tierKey}
                    type="button"
                    onClick={() => setSelectedTier(tierKey)}
                    className={`py-1.5 rounded-lg font-bold capitalize transition-colors ${
                      selectedTier === tierKey
                        ? 'bg-white text-temple-900 shadow-xs'
                        : 'text-temple-600 hover:text-temple-900'
                    }`}
                  >
                    {tierKey}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-temple-500 block">
                Base Price: ₹{ritual.tiers[selectedTier].price}
              </span>
            </div>
          </div>

          {/* 3. "Already Have This" Interactive Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-sandalwood-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-title text-lg font-bold text-temple-900">
                  Requirements Checklist &amp; Deduplication
                </h3>
                <p className="text-xs text-temple-600">
                  Mark items you already own at home to deduct them from procurement.
                </p>
              </div>

              {ownedSavings > 0 && (
                <span className="text-xs font-bold text-tulsi-700 bg-tulsi-100 px-3 py-1 rounded-full">
                  Saved ₹{ownedSavings}
                </span>
              )}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {scaledItems.map((item) => {
                const isOwned = ownedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleOwned(item.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isOwned
                        ? 'bg-tulsi-50/50 border-tulsi-300 text-temple-400 line-through'
                        : 'bg-sandalwood-50/70 border-sandalwood-200 text-temple-800 hover:border-brass-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isOwned
                            ? 'bg-tulsi-600 border-tulsi-600 text-white'
                            : 'border-sandalwood-400 bg-white'
                        }`}
                      >
                        {isOwned && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div>
                        <span className="font-bold">{item.name}</span>
                        <span className="text-[11px] text-temple-500 block">
                          Box 0{item.boxNumber} • {item.purpose}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold block">
                        {item.quantity} {item.unit}
                      </span>
                      <span className={isOwned ? 'text-tulsi-700 font-bold not-italic' : 'text-temple-500'}>
                        {isOwned ? `-₹${item.estimatedPrice} Deducted` : `₹${item.estimatedPrice}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Live Kit Procurement Summary Box */}
        <div className="lg:col-span-4 bg-gradient-to-br from-temple-900 via-temple-850 to-temple-900 rounded-3xl p-6 text-sandalwood-100 border border-brass-600/40 shadow-2xl space-y-6 sticky top-28">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brass-400">
              Live Kit Manifest
            </span>
            <h3 className="font-serif-title text-xl font-bold text-sandalwood-50 mt-1">
              Your Customized Kit
            </h3>
            <p className="text-xs text-sandalwood-300">
              {ritual.name} ({selectedTier.toUpperCase()})
            </p>
          </div>

          {/* Status Breakdown */}
          <div className="space-y-2 text-xs text-sandalwood-200 pt-2 border-t border-brass-800">
            <div className="flex justify-between">
              <span>Required Items:</span>
              <span className="font-semibold">{scaledItems.length} Items</span>
            </div>
            <div className="flex justify-between text-tulsi-400">
              <span>Already Have (Deducted):</span>
              <span className="font-bold">{ownedItemIds.length} Items</span>
            </div>
            <div className="flex justify-between text-brass-300">
              <span>To Procure New:</span>
              <span className="font-bold">{scaledItems.length - ownedItemIds.length} Items</span>
            </div>
            <div className="flex justify-between">
              <span>Packaging:</span>
              <span className="font-semibold">4 Sequenced Boxes</span>
            </div>
          </div>

          {/* Pricing Calculation */}
          <div className="pt-4 border-t border-brass-800 space-y-2">
            <div className="flex justify-between text-xs text-sandalwood-300">
              <span>Tier Base Price:</span>
              <span>₹{basePrice.toLocaleString('en-IN')}</span>
            </div>
            {ownedSavings > 0 && (
              <div className="flex justify-between text-xs text-tulsi-400 font-bold">
                <span>Deduction Savings:</span>
                <span>-₹{ownedSavings.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-brass-800 text-sandalwood-50">
              <span className="text-sm font-semibold">Estimated Total:</span>
              <span className="font-serif-title text-2xl font-bold text-brass-300">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Final CTA */}
          <button
            type="button"
            onClick={handleAddKitToCart}
            className="w-full py-3.5 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-brass transition-all active:scale-98"
          >
            <ShoppingBag className="w-4 h-4 text-temple-950" />
            <span>ADD KIT TO CART (₹{finalPrice.toLocaleString('en-IN')})</span>
          </button>

          <div className="text-[11px] text-sandalwood-400 text-center leading-normal">
            Consecrated morning delivery • Includes Digital QR Guide
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuildYourKitPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-temple-500">Loading Kit Builder...</div>}>
      <BuildYourKitContent />
    </Suspense>
  );
}
