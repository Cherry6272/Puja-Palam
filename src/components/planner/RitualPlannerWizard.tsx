'use client';

import React, { useState, useMemo } from 'react';
import { useDataStore } from '@/hooks/useDataStore';
import { Ritual, RegionalTradition, RitualSubstitution } from '@/types';
import { useCart } from '@/context/CartContext';
import { IHaveThisToggle } from './IHaveThisToggle';
import { SmartSubstitutionModal } from './SmartSubstitutionModal';
import { 
  Compass, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Users, 
  Home, 
  ShieldCheck, 
  ShoppingBag, 
  Sparkles,
  Package,
  Layers,
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  initialRitualSlug?: string;
}

export const RitualPlannerWizard: React.FC<Props> = ({ initialRitualSlug }) => {
  const { products: SAMAGRI_PRODUCTS, rituals: RITUALS_DATA, festivals: FESTIVALS_DATA, isLoading } = useDataStore();

  const { addCustomizedKit } = useCart();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRitualId, setSelectedRitualId] = useState<string>(() => {
    if (initialRitualSlug && RITUALS_DATA.length > 0) {
      const match = RITUALS_DATA.find((r) => r.slug === initialRitualSlug);
      if (match) return match.id;
    }
    return RITUALS_DATA[0]?.id || '';
  });

  const [selectedRegion, setSelectedRegion] = useState<RegionalTradition>('karnataka-smartha');
  const [ritualDate, setRitualDate] = useState('2026-09-18');
  const [peopleCount, setPeopleCount] = useState(15);
  const [venue, setVenue] = useState('Home Mandir');
  const [ownedItemIds, setOwnedItemIds] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<'essential' | 'complete' | 'premium'>('complete');
  const [activeSubstitutions, setActiveSubstitutions] = useState<Record<string, string>>({});
  const [inspectingSub, setInspectingSub] = useState<RitualSubstitution | null>(null);

  // Selected ritual object
  const ritual = useMemo(() => {
    if (isLoading || RITUALS_DATA.length === 0) return null;
    return RITUALS_DATA.find((r) => r.id === selectedRitualId) || RITUALS_DATA[0];
  }, [selectedRitualId, RITUALS_DATA, isLoading]);

  // Scaled items based on guest count
  const scaledItems = useMemo(() => {
    if (!ritual) return [];
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

  React.useEffect(() => {
    if (!isLoading && RITUALS_DATA.length > 0 && !selectedRitualId) {
      if (initialRitualSlug) {
        const match = RITUALS_DATA.find((r) => r.slug === initialRitualSlug);
        if (match) {
          setSelectedRitualId(match.id);
          return;
        }
      }
      setSelectedRitualId(RITUALS_DATA[0].id);
    }
  }, [isLoading, RITUALS_DATA, initialRitualSlug, selectedRitualId]);

  // Financial calculations
  const tierConfig = ritual ? ritual.tiers[selectedTier] : null;
  const basePrice = tierConfig ? tierConfig.price : 0;

  // Deduction for owned items
  const ownedSavings = useMemo(() => {
    if (!ritual) return 0;
    return ritual.baseRequiredItems
      .filter((i) => ownedItemIds.includes(i.id))
      .reduce((sum, i) => sum + Math.round(i.estimatedPrice * (selectedTier === 'premium' ? 1.4 : 1)), 0);
  }, [ritual, ownedItemIds, selectedTier]);

  const finalProcurementPrice = Math.max(650, basePrice - ownedSavings);

  const toggleOwnedItem = (itemId: string) => {
    setOwnedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleMakePujaReady = () => {
    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#C59B27', '#B33927', '#FAF7F2'],
      });
    } catch {
      // ignore
    }

    addCustomizedKit({
      id: `kit-${Date.now()}`,
      ritualId: ritual.id,
      ritualName: ritual.name,
      tier: selectedTier,
      tradition: selectedRegion,
      peopleCount,
      date: ritualDate,
      venue,
      basePrice,
      finalPrice: finalProcurementPrice,
      ownedItemIds,
      activeSubstitutions,
      items: scaledItems,
      totalItemsCount: scaledItems.length + ritual.optionalItems.length,
      procuredItemsCount: scaledItems.filter((i) => !ownedItemIds.includes(i.id)).length,
      savedAmount: ownedSavings,
    });
  };

  if (isLoading || !ritual) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-32 mx-4 sm:mx-6 lg:mx-8 bg-white rounded-3xl border border-sandalwood-200 shadow-xl max-w-5xl lg:mx-auto mt-8">
        <div className="w-8 h-8 border-4 border-brass-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-temple-600">Initializing Planner...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Wizard Step Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-brass-500 text-temple-950 font-bold text-xs flex items-center justify-center shadow-brass">
              {currentStep}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
              Step {currentStep} of 8
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-temple-500 font-medium">
            <span>{Math.round((currentStep / 8) * 100)}% Complete</span>
            {ownedSavings > 0 && (
              <span className="text-tulsi-700 bg-tulsi-100 px-2.5 py-0.5 rounded-full font-bold">
                Saved ₹{ownedSavings}
              </span>
            )}
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full h-1.5 bg-sandalwood-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brass-400 to-brass-600 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="bg-white rounded-3xl border border-sandalwood-200 shadow-temple p-6 sm:p-10 relative">
        
        {/* Step 1: Select Ritual */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
                Which sacred ritual are you performing?
              </h2>
              <p className="text-sm text-temple-600 mt-1">
                Select your intended ceremony to load its canonical Vedic requirement manifest.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {RITUALS_DATA.map((r) => {
                const isSelected = selectedRitualId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRitualId(r.id)}
                    className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-brass-50/70 border-brass-500 ring-2 ring-brass-400 shadow-brass'
                        : 'border-sandalwood-200 hover:border-brass-300 hover:bg-sandalwood-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-temple-100 text-temple-800">
                        {r.category}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-brass-500 text-temple-900 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-serif-title text-lg font-bold text-temple-900 mt-2">
                      {r.name}
                    </h3>
                    <p className="text-xs text-vermillion-700 font-serif-title mt-0.5">
                      {r.sanskritName}
                    </p>
                    <p className="text-xs text-temple-600 mt-2 line-clamp-2 leading-relaxed">
                      {r.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Regional Tradition */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
                Which regional tradition applies?
              </h2>
              <p className="text-sm text-temple-600 mt-1">
                Different South and Pan-Indian traditions observe specific grain alignments, flower preferences, and sankalpa mantras.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  id: 'karnataka-smartha',
                  title: 'Karnataka Smartha Tradition',
                  region: 'Karnataka',
                  desc: 'Panchamrita Abhisheka, Kadubu offering for Ganapati, and 5-Chapter Satyanarayana Katha recitation.',
                },
                {
                  id: 'tamil-iyer',
                  title: 'Tamil Vadama / Iyer Tradition',
                  region: 'Tamil Nadu',
                  desc: 'Mavilai entrance thoranam, Sevvanthi & Shenbagam florals, Vethalai Paakku tamboolam distribution.',
                },
                {
                  id: 'telugu-vaidiki',
                  title: 'Telugu Vaidiki Tradition',
                  region: 'Andhra & Telangana',
                  desc: 'Navagranthi Thoram 9-knot yellow thread binding, Ravva Prasadam, and Chalividi-Vadapappu offerings.',
                },
                {
                  id: 'kerala-tantric',
                  title: 'Kerala Tantric / Temple Tradition',
                  region: 'Kerala',
                  desc: 'Nilavilakku twin brass illumination, special sesame kootu oil, and ceremonial Uruli offerings.',
                },
                {
                  id: 'pan-vedic',
                  title: 'Pan-Vedic / North Indian Tradition',
                  region: 'Pan-Indian',
                  desc: 'Havan kund Agnihotra samagri, Kalash sthapana with red coconut cloth, and Shanti path.',
                },
              ].map((t) => {
                const isSelected = selectedRegion === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedRegion(t.id as RegionalTradition)}
                    className={`w-full p-4 rounded-xl border text-left flex items-start justify-between transition-all ${
                      isSelected
                        ? 'bg-brass-50/80 border-brass-500 ring-1 ring-brass-400'
                        : 'border-sandalwood-200 hover:border-brass-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-brass-700 bg-brass-100 px-2 py-0.5 rounded">
                          {t.region}
                        </span>
                        <h4 className="font-serif-title text-base font-bold text-temple-900">
                          {t.title}
                        </h4>
                      </div>
                      <p className="text-xs text-temple-600 mt-1 leading-relaxed max-w-xl">
                        {t.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-brass-500 text-temple-900 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Date of Ritual */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
                When is the ritual scheduled?
              </h2>
              <p className="text-sm text-temple-600 mt-1">
                We calibrate floral freshness and same-day consecrated delivery around your target date.
              </p>
            </div>

            <div className="max-w-md space-y-4 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-temple-700">
                Ceremony Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={ritualDate}
                  onChange={(e) => setRitualDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-sandalwood-300 text-temple-900 font-semibold text-sm focus:ring-2 focus:ring-brass-400 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-brass-50 border border-brass-200/80 text-xs text-temple-700 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-temple-900">
                  <Calendar className="w-4 h-4 text-brass-600" />
                  <span>Auspicious Almanac (Panchanga) Match</span>
                </div>
                <p className="text-[11px] text-temple-600">
                  Ideal timings for {ritual.name}: <strong>{ritual.idealTime}</strong>. Recommended Tithi: {ritual.auspiciousTithi}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Number of People / Gathering Size */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
                How many devotees will attend?
              </h2>
              <p className="text-sm text-temple-600 mt-1">
                Quantities of fresh betel leaves, areca nuts, naivedyam dry mixes, and floral strings scale automatically.
              </p>
            </div>

            <div className="max-w-lg space-y-6 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-temple-700">
                  Expected Attendees
                </span>
                <span className="font-serif-title text-3xl font-bold text-brass-700">
                  {peopleCount} People
                </span>
              </div>

              <input
                type="range"
                min={2}
                max={80}
                step={1}
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-sandalwood-200 rounded-lg appearance-none cursor-pointer accent-brass-600"
              />

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-sandalwood-100/70 border border-sandalwood-200">
                  <span className="text-[10px] text-temple-500 uppercase block">Tamboolam Leaves</span>
                  <span className="font-bold text-temple-900">{Math.round(peopleCount * 1.5)} Leaves</span>
                </div>
                <div className="p-3 rounded-xl bg-sandalwood-100/70 border border-sandalwood-200">
                  <span className="text-[10px] text-temple-500 uppercase block">Fresh Marigolds</span>
                  <span className="font-bold text-temple-900">{peopleCount > 25 ? '1.2 Kg' : '500g'}</span>
                </div>
                <div className="p-3 rounded-xl bg-sandalwood-100/70 border border-sandalwood-200">
                  <span className="text-[10px] text-temple-500 uppercase block">Prasad Bowls</span>
                  <span className="font-bold text-temple-900">{peopleCount} Units</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Venue */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
                Where will the ceremony take place?
              </h2>
              <p className="text-sm text-temple-600 mt-1">
                Venue context determines whether threshold toranams, floor protection mats, or havan smoke management are required.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { id: 'Home Mandir', label: 'Home Mandir / Prayer Corner', desc: 'Standard residential setup with tabletop altar and indoor low-smoke camphor' },
                { id: 'New Apartment', label: 'New Apartment (Griha Pravesh)', desc: 'Includes entrance doorway threshold sanctifiers and milk boiling vessel' },
                { id: 'Independent House / Villa', label: 'Independent Villa / Courtyard', desc: 'Includes outdoor rangoli powders and larger sacred mango leaf toranam' },
                { id: 'Community Hall / Temple', label: 'Community Hall / Temple Mantapa', desc: 'Large format brassware with high-capacity camphor and floral allocations' },
              ].map((v) => {
                const isSelected = venue === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVenue(v.id)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-brass-50/80 border-brass-500 ring-2 ring-brass-400'
                        : 'border-sandalwood-200 hover:border-brass-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif-title text-base font-bold text-temple-900">
                        {v.label}
                      </h4>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-brass-500 text-temple-900 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-temple-600 mt-2 leading-relaxed">
                      {v.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: "I Have This" Household Inventory Deduplication */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
                  What items do you already have?
                </h2>
                <p className="text-sm text-temple-600 mt-1">
                  Check items you already own at home. We automatically remove them to reduce waste and lower kit price.
                </p>
              </div>

              {ownedSavings > 0 && (
                <div className="bg-tulsi-100 text-tulsi-800 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                  <Check className="w-3.5 h-3.5 text-tulsi-700" />
                  <span>Deducted ₹{ownedSavings} from total</span>
                </div>
              )}
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 pt-2">
              {scaledItems.map((item) => {
                const isOwned = ownedItemIds.includes(item.id);
                return (
                  <IHaveThisToggle
                    key={item.id}
                    itemId={item.id}
                    itemName={item.name}
                    isOwned={isOwned}
                    price={item.estimatedPrice}
                    onToggle={toggleOwnedItem}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Step 7: Kit Tier (Essential / Complete / Premium) */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
                Choose your preparation tier
              </h2>
              <p className="text-sm text-temple-600 mt-1">
                We clearly disclose all vessel gauges, organic ingredients, and included brassware.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {(['essential', 'complete', 'premium'] as const).map((tierKey) => {
                const tier = ritual.tiers[tierKey];
                const isSelected = selectedTier === tierKey;

                return (
                  <button
                    key={tierKey}
                    type="button"
                    onClick={() => setSelectedTier(tierKey)}
                    className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-brass-50/80 border-brass-500 ring-2 ring-brass-400 shadow-brass'
                        : 'border-sandalwood-200 hover:border-brass-300'
                    }`}
                  >
                    <div>
                      {tierKey === 'complete' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-brass-500 text-temple-900 px-2 py-0.5 rounded absolute top-3 right-3 shadow-xs">
                          Most Recommended
                        </span>
                      )}

                      <h4 className="font-serif-title text-lg font-bold text-temple-900">
                        {tier.name}
                      </h4>
                      <p className="text-xs text-brass-800 font-medium mt-0.5">
                        {tier.tagline}
                      </p>

                      <p className="font-serif-title text-2xl font-bold text-temple-900 my-3">
                        ₹{tier.price.toLocaleString('en-IN')}
                      </p>

                      <p className="text-xs text-temple-600 leading-relaxed mb-4">
                        {tier.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-temple-700 pt-3 border-t border-sandalwood-200">
                      <div className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-tulsi-600 flex-shrink-0" />
                        <span>{tier.vesselQuality}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-tulsi-600 flex-shrink-0" />
                        <span>Organic Single-Source Ingredients</span>
                      </div>
                      {tier.artisanBackdropIncluded && (
                        <div className="flex items-center space-x-1.5 font-semibold text-brass-800">
                          <Check className="w-3.5 h-3.5 text-brass-600 flex-shrink-0" />
                          <span>Artisan Mandap Backdrop Included</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 8: Final Ritual Checklist Manifest */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
                  Customized Ritual Manifest
                </span>
                <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900 mt-1">
                  Your {ritual.name} Checklist
                </h2>
                <p className="text-xs text-temple-600">
                  Scheduled for {ritualDate} • {venue} • {peopleCount} Devotees
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-temple-500">Estimated Total Procurement</span>
                <p className="font-serif-title text-3xl font-bold text-temple-900">
                  ₹{finalProcurementPrice.toLocaleString('en-IN')}
                </p>
                {ownedSavings > 0 && (
                  <p className="text-xs text-tulsi-700 font-bold">
                    -₹{ownedSavings} (Already Owned Deduction)
                  </p>
                )}
              </div>
            </div>

            {/* Checklist Statistics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-sandalwood-100 border border-sandalwood-200">
                <span className="text-[10px] uppercase font-bold text-temple-500">Total Items</span>
                <p className="font-serif-title text-xl font-bold text-temple-900">
                  {scaledItems.length + ritual.optionalItems.length}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-brass-50 border border-brass-300">
                <span className="text-[10px] uppercase font-bold text-brass-700">To Procure</span>
                <p className="font-serif-title text-xl font-bold text-temple-900">
                  {scaledItems.filter((i) => !ownedItemIds.includes(i.id)).length} Items
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-tulsi-50 border border-tulsi-200">
                <span className="text-[10px] uppercase font-bold text-tulsi-700">Already Owned</span>
                <p className="font-serif-title text-xl font-bold text-tulsi-800">
                  {ownedItemIds.length} Items
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-sandalwood-100 border border-sandalwood-200">
                <span className="text-[10px] uppercase font-bold text-temple-500">Packaging</span>
                <p className="font-serif-title text-xl font-bold text-temple-900">
                  4 Sequenced Boxes
                </p>
              </div>
            </div>

            {/* Manifest List by Box Sequence */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-temple-800">
                Box 01 to Box 04 Sequenced Manifest
              </h3>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {scaledItems.map((item) => {
                  const isOwned = ownedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between text-xs p-3 rounded-xl border ${
                        isOwned
                          ? 'bg-tulsi-50/40 border-tulsi-200 text-temple-400 line-through'
                          : 'bg-white border-sandalwood-200 text-temple-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sandalwood-200 text-temple-800">
                          Box 0{item.boxNumber}
                        </span>
                        <span className="font-medium">{item.name}</span>
                        {isOwned && (
                          <span className="text-[10px] bg-tulsi-100 text-tulsi-800 font-bold px-2 py-0.5 rounded not-italic">
                            Owned
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-temple-700">
                          {item.quantity} {item.unit}
                        </span>
                        <span className="text-temple-500">
                          ₹{item.estimatedPrice}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Canonical Substitution available notice if present */}
            {ritual.substitutions.length > 0 && (
              <div className="p-3.5 rounded-xl bg-brass-50 border border-brass-200 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-brass-600" />
                  <span className="text-temple-800">
                    Traditional alternative available: {ritual.substitutions[0].originalName} → {ritual.substitutions[0].substituteName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectingSub(ritual.substitutions[0])}
                  className="font-bold text-brass-800 hover:underline"
                >
                  Review Substitute
                </button>
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls Navigation Bar */}
        <div className="mt-8 pt-6 border-t border-sandalwood-200 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-5 py-2.5 rounded-xl border border-sandalwood-300 hover:bg-sandalwood-100 text-xs font-bold text-temple-800 flex items-center space-x-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-6 py-2.5 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-900 text-xs font-bold flex items-center space-x-2 shadow-brass transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleMakePujaReady}
              className="px-7 py-3 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 text-xs font-bold flex items-center space-x-2 shadow-temple transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-brass-300" />
              <span>Make It Puja-Ready</span>
            </button>
          )}
        </div>
      </div>

      {/* Smart Substitution Inspector Modal */}
      {inspectingSub && (
        <SmartSubstitutionModal
          isOpen={!!inspectingSub}
          onClose={() => setInspectingSub(null)}
          substitution={inspectingSub}
          isActive={!!activeSubstitutions[inspectingSub.originalItemId]}
          onApply={(sub) => {
            setActiveSubstitutions((prev) => ({
              ...prev,
              [sub.originalItemId]: sub.substituteName,
            }));
          }}
          onRevert={(sub) => {
            setActiveSubstitutions((prev) => {
              const updated = { ...prev };
              delete updated[sub.originalItemId];
              return updated;
            });
          }}
        />
      )}
    </div>
  );
};
