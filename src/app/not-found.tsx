'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ShoppingBag, Flame, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-12 border border-sandalwood-200 shadow-temple text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-brass-100 flex items-center justify-center mx-auto text-brass-700 shadow-xs">
          <Flame className="w-8 h-8 text-amber-600 animate-flame" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
            Path Uncharted
          </span>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-temple-900">
            This Ritual Path Doesn&apos;t Exist
          </h1>
          <p className="text-xs sm:text-sm text-temple-600 leading-relaxed max-w-sm mx-auto">
            The page you are looking for may have moved or was never consecrated into our ritual knowledge graph.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/rituals"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-brass transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>EXPLORE RITUALS</span>
          </Link>

          <Link
            href="/samagri"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sandalwood-100 hover:bg-sandalwood-200 text-temple-800 font-bold text-xs flex items-center justify-center space-x-2 border border-sandalwood-300 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-brass-600" />
            <span>CONTINUE SHOPPING</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-sandalwood-200">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs text-temple-500 hover:text-temple-900 font-medium"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
