'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  Sparkles, 
  ShoppingBag, 
  MapPin, 
  Menu, 
  X, 
  Compass, 
  ShieldCheck, 
  QrCode,
  Flame
} from 'lucide-react';
import { AskPujaKaryamModal } from '@/components/ai/AskPujaKaryamModal';

export const Navbar: React.FC = () => {
  const { 
    totalItemsCount, 
    totalAmount, 
    setIsCartOpen, 
    selectedRegion, 
    setSelectedRegion 
  } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const regionOptions = [
    { id: 'karnataka-smartha', label: 'Karnataka (ಕರ್ನಾಟಕ)' },
    { id: 'tamil-iyer', label: 'Tamil Nadu (தமிழ்நாடு)' },
    { id: 'telugu-vaidiki', label: 'Andhra & TS (తెలుగు)' },
    { id: 'kerala-tantric', label: 'Kerala (കേരളം)' },
    { id: 'pan-vedic', label: 'Pan-Vedic (North / Central)' },
  ];

  return (
    <>
      {/* Top Auspicious & Operational Ticker */}
      <div className="bg-temple-900 text-sandalwood-200 text-xs py-1.5 px-4 border-b border-brass-800/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate">
            <span className="inline-flex items-center text-brass-400 font-medium">
              <Flame className="w-3.5 h-3.5 mr-1 text-amber-500 animate-flame" />
              Shubha Muhurtham
            </span>
            <span className="hidden sm:inline text-temple-400">|</span>
            <span className="hidden sm:inline text-sandalwood-300">
              Prepared with care for your ritual
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            {/* Regional Tradition Selector */}
            <div className="flex items-center space-x-1 text-sandalwood-300">
              <MapPin className="w-3.5 h-3.5 text-brass-400" />
              <select
                aria-label="Select Tradition / Region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-temple-800 text-sandalwood-100 border border-brass-700/50 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-brass-400 cursor-pointer"
              >
                {regionOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-sandalwood-50/95 backdrop-blur-md border-b border-sandalwood-200 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brass-300 via-brass-500 to-brass-700 flex items-center justify-center shadow-brass transition-transform duration-300 group-hover:scale-105">
                <Flame className="w-6 h-6 text-temple-900 drop-shadow" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-serif-title text-2xl font-bold tracking-wider text-temple-900 group-hover:text-brass-700 transition-colors">
                    PUJA KARYAM
                  </span>
                </div>
                <p className="text-[10px] tracking-widest uppercase font-semibold text-brass-700 -mt-1">
                  Ritual Procurement Platform
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-5 text-sm font-medium text-temple-700">
              <Link
                href="/plan-your-puja"
                className="flex items-center space-x-1.5 hover:text-brass-600 transition-colors font-semibold text-temple-900"
              >
                <Compass className="w-4 h-4 text-brass-500" />
                <span>Plan a Ritual</span>
              </Link>
              <Link
                href="/rituals"
                className="hover:text-brass-600 transition-colors"
              >
                Rituals
              </Link>
              <Link
                href="/samagri"
                className="hover:text-brass-600 transition-colors"
              >
                Puja Samagri
              </Link>
              <Link
                href="/puja-kits"
                className="hover:text-brass-600 transition-colors"
              >
                Puja Kits
              </Link>
              <Link
                href="/festivals"
                className="hover:text-brass-600 transition-colors font-semibold text-brass-800 bg-brass-100/70 px-2.5 py-1 rounded-full border border-brass-300/60"
              >
                Festivals
              </Link>
              <Link
                href="/build-your-kit"
                className="hover:text-brass-600 transition-colors"
              >
                Build Your Kit
              </Link>
              <Link
                href="/search"
                className="hover:text-brass-600 transition-colors"
              >
                Search
              </Link>
            </nav>

            {/* Right CTAs */}
            <div className="flex items-center space-x-3">
              {/* Ask Puja Karyam AI Button */}
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2 rounded-full border border-brass-400 bg-brass-50/60 hover:bg-brass-100/80 text-temple-800 text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow-brass"
              >
                <Sparkles className="w-4 h-4 text-brass-600 animate-pulse" />
                <span>Ask Puja Karyam</span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Shopping cart with ${totalItemsCount} items`}
                className="relative flex items-center space-x-2 px-4 py-2.5 rounded-full bg-temple-900 text-sandalwood-50 hover:bg-temple-800 transition-all shadow-temple active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-brass-300" />
                <span className="text-xs font-semibold hidden md:inline">
                  {totalAmount > 0 ? `₹${totalAmount.toLocaleString('en-IN')}` : 'Kit Cart'}
                </span>
                {totalItemsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-vermillion-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="lg:hidden p-2 rounded-lg text-temple-800 hover:bg-sandalwood-200"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-sandalwood-50 border-b border-sandalwood-200 px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/plan-your-puja"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 p-2.5 rounded-lg bg-brass-100/50 text-temple-900 font-semibold"
            >
              <Compass className="w-5 h-5 text-brass-600" />
              <span>Plan Your Puja</span>
            </Link>
            <Link
              href="/rituals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 text-temple-800 font-medium hover:bg-sandalwood-100 rounded"
            >
              All Rituals
            </Link>
            <Link
              href="/festivals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-2 text-brass-800 font-bold bg-brass-100/50 rounded"
            >
              <span>South Indian Festivals</span>
              <Sparkles className="w-4 h-4 text-brass-600" />
            </Link>
            <Link
              href="/puja-kits"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 text-temple-800 font-medium hover:bg-sandalwood-100 rounded"
            >
              Puja Kits
            </Link>
            <Link
              href="/build-your-kit"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 text-temple-800 font-medium hover:bg-sandalwood-100 rounded"
            >
              Build Your Kit
            </Link>
            <Link
              href="/samagri"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 text-temple-800 font-medium hover:bg-sandalwood-100 rounded"
            >
              Puja Samagri
            </Link>
            <Link
              href="/search"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 text-temple-800 font-medium hover:bg-sandalwood-100 rounded"
            >
              Search
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-2 text-temple-800 font-medium hover:bg-sandalwood-100 rounded"
            >
              <span>View Cart</span>
              <span className="text-xs bg-temple-900 text-white px-2 py-0.5 rounded-full">{totalItemsCount}</span>
            </Link>
            <div className="h-px bg-sandalwood-200 my-2" />
            <Link
              href="/how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 text-temple-600 font-medium hover:bg-sandalwood-100 rounded text-sm"
            >
              How It Works
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 text-temple-600 font-medium hover:bg-sandalwood-100 rounded text-sm"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 text-temple-600 font-medium hover:bg-sandalwood-100 rounded text-sm"
            >
              Contact / Support
            </Link>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAiModalOpen(true);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-brass-500 text-temple-900 font-bold text-sm shadow-brass"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask Puja Karyam AI</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Grounded AI Assistant Modal */}
      <AskPujaKaryamModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </>
  );
};
