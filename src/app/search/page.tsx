'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RITUALS_DATA } from '@/data/rituals';
import { SAMAGRI_PRODUCTS } from '@/data/products';
import { FESTIVALS_DATA } from '@/data/festivals';
import { RitualCard } from '@/components/store/RitualCard';
import { ProductCard } from '@/components/store/ProductCard';
import { Search, Compass, Package, ShoppingBag, ArrowRight, Sparkles, X } from 'lucide-react';
import Link from 'next/link';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const results = useMemo(() => {
    const q = initialQuery.toLowerCase().trim();
    if (!q) return null;

    const matchedRituals = RITUALS_DATA.filter((r) => {
      const matchName = r.name.toLowerCase().includes(q);
      const matchTag = r.tagline.toLowerCase().includes(q);
      const matchDeity = r.deity.toLowerCase().includes(q);
      const matchHouse = (q.includes('house') || q.includes('warming') || q.includes('vastu')) && r.slug.includes('griha');
      const matchGanesh = (q.includes('ganesh') || q.includes('vinayaka')) && r.slug.includes('ganapati');
      const matchPooja = q.includes('pooja') || q.includes('puja');
      return matchName || matchTag || matchDeity || matchHouse || matchGanesh || (matchPooja && r.category === 'Vrata');
    });

    const matchedProducts = SAMAGRI_PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchRel = p.ritualRelevance.toLowerCase().includes(q);
      const matchItems = (q.includes('pooja items') || q.includes('samagri')) && p.inStock;
      const matchCamphor = q.includes('camphor') && p.slug.includes('camphor');
      return matchName || matchCat || matchRel || matchItems || matchCamphor;
    });

    const matchedFestivals = FESTIVALS_DATA.filter((f) => {
      const matchName = f.name.toLowerCase().includes(q);
      const matchTag = f.tagline.toLowerCase().includes(q);
      const matchDesc = f.description.toLowerCase().includes(q);
      return matchName || matchTag || matchDesc;
    });

    return {
      rituals: matchedRituals,
      products: matchedProducts,
      festivals: matchedFestivals,
      totalCount: matchedRituals.length + matchedProducts.length + matchedFestivals.length,
    };
  }, [initialQuery]);

  const suggestionPills = [
    'Bhimseni Camphor',
    'Satyanarayana Puja',
    'Griha Pravesh Items',
    'Brass Kalasha',
    'Varalakshmi Vrata',
    'Ghee Diya Wicks',
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Search Bar Header */}
      <div className="max-w-2xl mx-auto space-y-4 text-center">
        <h1 className="font-serif-title text-3xl font-bold text-temple-900">
          Search Canonical Rituals &amp; Samagri
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-brass-600">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ritual or item: 'camphor', 'house warming', 'satyanarayana'..."
            className="w-full pl-12 pr-24 py-4 rounded-2xl bg-white border border-sandalwood-300 text-sm text-temple-900 placeholder:text-temple-400 focus:outline-none focus:ring-2 focus:ring-brass-500 shadow-sm transition-all"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-2.5 bottom-2.5 px-5 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs flex items-center space-x-1 shadow-sm transition-all"
          >
            <span>Search</span>
          </button>
        </form>

        {/* Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-temple-600">
          <span className="font-semibold text-temple-400">Popular:</span>
          {suggestionPills.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => {
                setQuery(pill);
                router.push(`/search?q=${encodeURIComponent(pill)}`);
              }}
              className="px-3 py-1 rounded-full bg-sandalwood-100 hover:bg-brass-100/60 border border-sandalwood-200 text-temple-800 transition-colors"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Results or Empty State */}
      {results ? (
        results.totalCount === 0 ? (
          /* Empty State as required by Section 13 */
          <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white rounded-3xl p-8 border border-sandalwood-200 shadow-subtle">
            <div className="w-14 h-14 rounded-full bg-sandalwood-100 flex items-center justify-center mx-auto text-temple-400">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-serif-title text-xl font-bold text-temple-900">
              No exact matches found
            </h3>
            <p className="text-xs text-temple-600 leading-relaxed">
              We couldn&apos;t find an exact match for &ldquo;<strong>{initialQuery}</strong>&rdquo;. Try searching for a canonical ceremony, puja kit, or authenticated samagri item.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <Link
                href="/rituals"
                className="px-4 py-2 rounded-xl bg-brass-500 text-temple-950 font-bold text-xs shadow-brass"
              >
                Browse All Rituals
              </Link>
              <Link
                href="/samagri"
                className="px-4 py-2 rounded-xl bg-sandalwood-100 hover:bg-sandalwood-200 text-temple-800 font-semibold text-xs border border-sandalwood-300"
              >
                Explore Samagri Store
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-sandalwood-200 pb-3">
              <h2 className="font-serif-title text-xl font-bold text-temple-900">
                Results for &ldquo;{initialQuery}&rdquo; ({results.totalCount})
              </h2>
              <span className="text-xs text-temple-500">
                Prioritized by Ritual &rarr; Kit &rarr; Samagri
              </span>
            </div>

            {/* Priority 1: Ritual Matches */}
            {results.rituals.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-brass-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brass-800">
                    Canonical Rituals ({results.rituals.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {results.rituals.map((r) => (
                    <RitualCard key={r.id} ritual={r} />
                  ))}
                </div>
              </div>
            )}

            {/* Priority 1.5: Festival Matches */}
            {results.festivals.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-sandalwood-200">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-brass-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brass-800">
                    Festivals ({results.festivals.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {results.festivals.map((f) => (
                    <div key={f.id} className="bg-white rounded-xl border border-sandalwood-200 p-4 flex items-center space-x-4 shadow-sm">
                       <img src={f.heroImage} alt={f.name} className="w-16 h-16 rounded-lg object-cover" />
                       <div>
                         <Link href={`/festivals/${f.slug}`} className="font-bold text-temple-900 hover:text-brass-600 transition-colors">{f.name}</Link>
                         <p className="text-xs text-temple-600 line-clamp-2 mt-1">{f.tagline}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Priority 2: Product Matches */}
            {results.products.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-sandalwood-200">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-brass-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brass-800">
                    Authenticated Samagri Items ({results.products.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {results.products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        /* Default Search Discovery View */
        <div className="py-12 text-center text-xs text-temple-500 space-y-2">
          <p>Type any ritual, ceremony, or samagri keyword above to search our Knowledge Graph.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-temple-500">Loading Search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
