'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Heart, MapPin, Sparkles, QrCode } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-temple-900 text-sandalwood-200 border-t border-brass-800/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-temple-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brass-300 via-brass-500 to-brass-700 flex items-center justify-center shadow-brass">
                <Flame className="w-5 h-5 text-temple-900" />
              </div>
              <div>
                <span className="font-serif-title text-xl font-bold tracking-wider text-sandalwood-50">
                  PUJA KARYAM
                </span>
                <p className="text-[9px] tracking-widest uppercase font-semibold text-brass-400">
                  Ritual Procurement Platform
                </p>
              </div>
            </Link>

            <p className="text-xs text-sandalwood-300 leading-relaxed max-w-sm">
              From the first item to the final offering, Puja Karyam brings every ritual requirement together — thoughtfully curated, accurately prepared and delivered with ease.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs text-brass-300">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-temple-800 border border-brass-700/40">
                <ShieldCheck className="w-3.5 h-3.5 text-brass-400" />
                <span>100% Shastra Compliant</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-temple-800 border border-brass-700/40">
                <Sparkles className="w-3.5 h-3.5 text-brass-400" />
                <span>Zero Fake Claims</span>
              </span>
            </div>
          </div>

          {/* Canonical Rituals */}
          <div className="space-y-3">
            <h4 className="font-serif-title text-sm font-bold text-sandalwood-50 tracking-wide uppercase">
              Canonical Rituals
            </h4>
            <ul className="space-y-2 text-xs text-sandalwood-300">
              <li>
                <Link href="/rituals/satyanarayana-puja" className="hover:text-brass-300 transition-colors">
                  Sri Satyanarayana Puja
                </Link>
              </li>
              <li>
                <Link href="/rituals/ganapati-puja" className="hover:text-brass-300 transition-colors">
                  Sri Maha Ganapati Puja
                </Link>
              </li>
              <li>
                <Link href="/rituals/griha-pravesh" className="hover:text-brass-300 transition-colors">
                  Griha Pravesh & Vastu
                </Link>
              </li>
              <li>
                <Link href="/rituals/varalakshmi-vrata" className="hover:text-brass-300 transition-colors">
                  Sri Varalakshmi Vrata
                </Link>
              </li>
              <li>
                <Link href="/rituals" className="text-brass-400 hover:text-brass-200 font-semibold">
                  View All 8+ Rituals →
                </Link>
              </li>
            </ul>
          </div>

          {/* South Indian Festivals */}
          <div className="space-y-3">
            <h4 className="font-serif-title text-sm font-bold text-sandalwood-50 tracking-wide uppercase">
              Festivals
            </h4>
            <ul className="space-y-2 text-xs text-sandalwood-300">
              <li>
                <Link href="/festivals/varalakshmi-vrata" className="hover:text-brass-300 transition-colors">
                  Varamahalakshmi Vrata
                </Link>
              </li>
              <li>
                <Link href="/festivals/ganesh-chaturthi" className="hover:text-brass-300 transition-colors">
                  Ganesha Habba / Vinayaka
                </Link>
              </li>
              <li>
                <Link href="/festivals/gowri-habba" className="hover:text-brass-300 transition-colors">
                  Swarna Gowri Habba
                </Link>
              </li>
              <li>
                <Link href="/festivals/ugadi" className="hover:text-brass-300 transition-colors">
                  Ugadi / Yugadi New Year
                </Link>
              </li>
              <li>
                <Link href="/festivals/vishu" className="hover:text-brass-300 transition-colors">
                  Vishu (Kerala New Dawn)
                </Link>
              </li>
              <li>
                <Link href="/festivals" className="text-brass-400 hover:text-brass-200 font-semibold">
                  All 10 Festivals →
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Innovations */}
          <div className="space-y-3">
            <h4 className="font-serif-title text-sm font-bold text-sandalwood-50 tracking-wide uppercase">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-sandalwood-300">
              <li>
                <Link href="/plan-your-puja" className="hover:text-brass-300 transition-colors">
                  Plan a Ritual
                </Link>
              </li>
              <li>
                <Link href="/build-your-kit" className="hover:text-brass-300 transition-colors">
                  Build Your Own Kit
                </Link>
              </li>
              <li>
                <Link href="/puja-kits" className="hover:text-brass-300 transition-colors">
                  Pre-Packaged Kits
                </Link>
              </li>
              <li>
                <Link href="/samagri" className="hover:text-brass-300 transition-colors">
                  Puja Samagri Catalogue
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-brass-300 transition-colors font-semibold text-brass-300">
                  How Puja Karyam Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brass-300 transition-colors">
                  About Puja Karyam
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brass-300 transition-colors">
                  Support &amp; Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Logistics & Hubs */}
          <div className="space-y-3">
            <h4 className="font-serif-title text-sm font-bold text-sandalwood-50 tracking-wide uppercase">
              Fulfillment Hubs
            </h4>
            <ul className="space-y-2 text-xs text-sandalwood-300">
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-brass-400" />
                <span>Bengaluru Central (HAL 2nd Stage)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-brass-400" />
                <span>Chennai South (Mylapore)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-brass-400" />
                <span>Hyderabad Deccan (Secunderabad)</span>
              </li>
              <li className="pt-2 text-[11px] text-sandalwood-400 leading-relaxed">
                Fresh flower garlands packed JIT at 5:30 AM on ceremony morning.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers and Integrity */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-temple-400 space-y-4 md:space-y-0">
          <p>
            © {new Date().getFullYear()} Puja Karyam Technologies Pvt. Ltd. All rights reserved.
          </p>

          <p className="text-center md:text-right max-w-lg text-[11px] text-temple-400 leading-normal">
            Puja Karyam provides ritual procurement and preparation assistance. We do not replace ordained Vedic pandits or traditional purohits; we support households and priests with guaranteed, pure materials.
          </p>
        </div>
      </div>
    </footer>
  );
};
