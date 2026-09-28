'use client';

import React, { useState } from 'react';
import { 
  Package, 
  QrCode, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Volume2, 
  BookOpen 
} from 'lucide-react';
import Link from 'next/link';

export const RitualBoxPackagingView: React.FC = () => {
  const [activeBox, setActiveBox] = useState<number>(1);

  const boxes = [
    {
      boxNumber: 1,
      title: 'BOX 01 — PREPARATION',
      sanskrit: 'शुद्धि एवं आसन',
      timing: 'T-24 Hours & T-3 Hours',
      purpose: 'Sanctifying the mandapa, laying the altar silk asana, and preparing the twin deepas.',
      badge: 'Unpack First',
      color: 'from-amber-700/20 to-brass-500/10',
      borderColor: 'border-amber-600/40',
      items: [
        'Consecrated Ganga Jal Bottle (100ml)',
        'Traditional Red Silk Peeta Altar Cloth',
        'Twin Heavy Brass Kuthuvilakku Lamps',
        'Hand-rolled Cow Ghee Wicks (50 pcs)',
        'Cast Brass Puja Bell with Nandi Finial',
      ],
      instructions:
        'Wipe the wooden altar with Ganga Jal, spread the sacred silk cloth, and place twin oil lamps on either side facing east.',
    },
    {
      boxNumber: 2,
      title: 'BOX 02 — KALASHA SPHERES',
      sanskrit: 'कलश एवं नवग्रह स्थापना',
      timing: 'T-45 Minutes',
      purpose: 'Constructing the cosmic Kalasha vessel and cardinal planetary grain mandalas.',
      badge: 'Core Sthapana',
      color: 'from-vermillion-700/20 to-brass-500/10',
      borderColor: 'border-vermillion-600/40',
      items: [
        'Hand-buffed Solid Brass Kalasha Vessel',
        'Select Crown Coconut with Intact Shika',
        '5 Fresh Mango Leaves / Reusable Brass Thoranam',
        'Pure Madurai Kumkum & Salem Haldi Powders',
        'Turmeric Coated Sacred Akshata Grains',
        'Navadhanya 9-Planetary Grain Packs',
        'Consecrated Red Sacred Moli Raksha Sutra',
      ],
      instructions:
        'Fill Kalasha with fresh water and sacred coin, insert 5 mango leaves upward, crown with coconut, and tie 5 rounds of Moli thread around the vessel neck.',
    },
    {
      boxNumber: 3,
      title: 'BOX 03 — OFFERINGS & ARHANA',
      sanskrit: 'नैवेद्य एवं पुष्पाञ्जलि',
      timing: 'Commencement & Katha',
      purpose: 'Floral adorning, 108 Ashtottara archana, and divine food offerings.',
      badge: 'Fresh Pack',
      color: 'from-tulsi-700/20 to-brass-500/10',
      borderColor: 'border-tulsi-600/40',
      items: [
        'Fresh Golden Marigold Garland & Petals (500g)',
        'Selected Fresh Betel Leaves (25 Nagavalli)',
        'Whole Sacred Areca Nuts (Supari)',
        'Dry Fruits Panchamrita Mix Kit',
        'Biodegradable Areca Leaf Prasad Bowls',
      ],
      instructions:
        'Drape marigold garland around the Kalasha and place betel leaves with areca nuts in sets of two for Tamboolam offerings.',
    },
    {
      boxNumber: 4,
      title: 'BOX 04 — MANGALA AARTI',
      sanskrit: 'मङ्गल नीराजनम्',
      timing: 'Finale',
      purpose: 'Sublime smokeless flame, fragrant dhoop offering, and final blessings.',
      badge: 'Unpack for Finale',
      color: 'from-temple-700/20 to-brass-500/10',
      borderColor: 'border-temple-600/40',
      items: [
        'Pure Bhimseni Edible Crystal Flake Camphor',
        'Temple Loban Frankincense Dhoop Sticks',
        'Handcrafted Brass Pancha-Aarti Lamp',
        'Solid Brass Dhoop Incense Stand',
        'Sacred Coins for Harathi Dakshina',
      ],
      instructions:
        'Light pure Bhimseni camphor on the aarti thali. Ring the brass bell in steady rhythm while circling the flame clockwise three times.',
    },
  ];

  return (
    <section className="py-16 bg-sandalwood-100/60 border-y border-sandalwood-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-100 border border-brass-300 text-brass-800 text-xs font-bold uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" />
            <span>Operational Innovation</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-temple-900">
            Ritual-Ready Sequenced Packaging
          </h2>
          <p className="text-sm text-temple-600 leading-relaxed">
            Instead of dumping 30 random items into a cardboard box, Puja Karyam organizes every ritual into four chronologically sequenced boxes with QR guide integration.
          </p>
        </div>

        {/* 4-Box Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {boxes.map((box) => {
            const isSelected = activeBox === box.boxNumber;
            return (
              <button
                key={box.boxNumber}
                type="button"
                onClick={() => setActiveBox(box.boxNumber)}
                className={`p-5 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? `bg-white ${box.borderColor} ring-2 ring-brass-400 shadow-brass`
                    : 'bg-white/80 border-sandalwood-200 hover:border-brass-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-temple-900 text-sandalwood-100 uppercase">
                    {box.badge}
                  </span>
                  <QrCode className="w-4 h-4 text-brass-600" />
                </div>

                <h3 className="font-serif-title text-base font-bold text-temple-900">
                  {box.title}
                </h3>
                <p className="text-xs font-serif-title text-vermillion-700 mt-0.5">
                  {box.sanskrit}
                </p>
                <p className="text-[11px] text-temple-500 mt-2 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-brass-600" />
                  <span>{box.timing}</span>
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Box Detailed Deep Dive */}
        {(() => {
          const box = boxes.find((b) => b.boxNumber === activeBox)!;
          return (
            <div className="bg-white rounded-3xl border border-brass-400/40 p-6 sm:p-10 shadow-temple grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-brass-700 bg-brass-100 px-2.5 py-1 rounded-full uppercase">
                    Sequential Unpacking Order
                  </span>
                  <span className="text-xs text-temple-500">• {box.timing}</span>
                </div>

                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
                  {box.title}
                </h3>

                <p className="text-sm text-temple-700 leading-relaxed">
                  {box.purpose}
                </p>

                {/* Box Contents Checklist */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-temple-800">
                    What is inside this sealed chamber:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {box.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 text-xs text-temple-800 p-2 rounded-lg bg-sandalwood-50 border border-sandalwood-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-tulsi-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action */}
                <div className="pt-4 flex items-center space-x-4">
                  <Link
                    href="/guide"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-temple-900 text-sandalwood-50 font-bold text-xs shadow-temple hover:bg-temple-800 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-brass-300" />
                    <span>Open Digital Ritual Guide</span>
                  </Link>
                </div>
              </div>

              {/* Box 3D Physical Representation Graphic */}
              <div className="lg:col-span-5 bg-gradient-to-br from-temple-900 via-temple-800 to-temple-900 rounded-2xl p-6 text-sandalwood-100 border border-brass-600/30 flex flex-col justify-between aspect-square sm:aspect-auto sm:h-80 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-brass-400">
                    PUJA KARYAM BOX 0{box.boxNumber}
                  </span>
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                    <QrCode className="w-6 h-6 text-brass-300" />
                  </div>
                </div>

                <div className="my-auto text-center space-y-2">
                  <Package className="w-16 h-16 text-brass-400 mx-auto stroke-1 animate-float" />
                  <p className="font-serif-title text-xl font-bold text-sandalwood-50">
                    {box.title}
                  </p>
                  <p className="text-xs text-brass-300 font-medium">
                    {box.sanskrit}
                  </p>
                </div>

                <div className="pt-3 border-t border-brass-800 text-[11px] text-sandalwood-300 flex items-center justify-between">
                  <span>Batch Consecrated: Yes</span>
                  <span>Fulfillment: Sequence Checked</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
};
