'use client';

import React, { useState, useMemo } from 'react';
import { RITUALS_DATA } from '@/data/rituals';
import { SAMAGRI_PRODUCTS } from '@/data/products';
import { Search, Sparkles, ArrowRight, Package, Compass, X } from 'lucide-react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

export const IntentSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    // 1. Match Rituals
    const matchedRituals = RITUALS_DATA.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.tagline.toLowerCase().includes(q) ||
        r.deity.toLowerCase().includes(q) ||
        (q.includes('house') && r.slug.includes('griha')) ||
        (q.includes('warming') && r.slug.includes('griha')) ||
        (q.includes('ganesh') && r.slug.includes('ganapati'))
    );

    // 2. Match Products
    const matchedProducts = SAMAGRI_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.ritualRelevance.toLowerCase().includes(q)
    );

    return {
      rituals: matchedRituals,
      products: matchedProducts,
      hasResults: matchedRituals.length > 0 || matchedProducts.length > 0,
    };
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-brass-600">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search by intent: e.g. 'Items for house warming', 'Satyanarayana puja', 'pure camphor'..."
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border border-sandalwood-300 text-sm text-temple-900 placeholder:text-temple-400 focus:outline-none focus:ring-2 focus:ring-brass-500 shadow-sm transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-temple-400 hover:text-temple-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Results Dropdown Prioritizing Ritual -> Kit -> Products */}
      {isFocused && searchResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-sandalwood-50 rounded-2xl border border-brass-400/40 shadow-2xl p-4 z-40 space-y-4 max-h-[70vh] overflow-y-auto">
          {!searchResults.hasResults ? (
            <div className="py-6 text-center text-xs text-temple-500 space-y-2">
              <p className="font-semibold text-temple-700">No direct canonical matches</p>
              <p>Try searching for specific ceremonies like Ganapati Puja, Griha Pravesh, or items like Kalasha.</p>
              <button
                type="button"
                onClick={() => {
                  setIsFocused(false);
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                }}
                className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-temple-900 text-sandalwood-100 text-xs font-semibold"
              >
                Search all catalog items
              </button>
            </div>
          ) : (
            <>
              {/* Priority 1: Rituals Found */}
              {searchResults.rituals.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brass-800 bg-brass-100 px-2 py-0.5 rounded">
                    Ritual Intelligence Matches
                  </span>
                  <div className="space-y-1.5">
                    {searchResults.rituals.map((r) => (
                      <Link
                        key={r.id}
                        href={`/rituals/${r.slug}`}
                        onClick={() => setIsFocused(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-brass-50 border border-sandalwood-200 transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Compass className="w-4 h-4 text-brass-600" />
                          <div>
                            <p className="text-xs font-bold text-temple-900">{r.name}</p>
                            <p className="text-[11px] text-temple-500">{r.tagline}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-xs font-bold text-brass-700">
                          <span>Plan Ritual</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Priority 2: Individual Products */}
              {searchResults.products.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-sandalwood-200">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-temple-600">
                    Individual Samagri Items ({searchResults.products.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchResults.products.map((p) => (
                      <Link
                        key={p.id}
                        href={`/samagri/${p.slug}`}
                        onClick={() => setIsFocused(false)}
                        className="flex items-center space-x-2.5 p-2 rounded-xl bg-white hover:bg-sandalwood-100 border border-sandalwood-200 transition-colors"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-temple-900 truncate">{p.name}</p>
                          <p className="text-[11px] text-brass-700 font-semibold">₹{p.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* View Full Search Page */}
              <div className="pt-2 border-t border-sandalwood-200 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsFocused(false);
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="text-xs font-bold text-brass-700 hover:text-brass-800 inline-flex items-center space-x-1"
                >
                  <span>See all results for &ldquo;{query}&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
