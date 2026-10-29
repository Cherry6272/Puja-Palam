'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useDataStore } from '@/hooks/useDataStore';
import { useSearchParams, useRouter } from 'next/navigation';
import { RitualCard } from '@/components/store/RitualCard';
import { ProductCard } from '@/components/store/ProductCard';
import { Search, Compass, Package, ShoppingBag, ArrowRight, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function SearchPageContent({ initialQueryFromProp }: { initialQueryFromProp?: string }) {
  const {
    products: SAMAGRI_PRODUCTS,
    rituals: RITUALS_DATA,
    festivals: FESTIVALS_DATA,
    isLoading,
    error,
    refetch,
  } = useDataStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const urlParam = searchParams?.get('q');
  const initialQuery = (urlParam !== null && urlParam !== undefined ? urlParam : (initialQueryFromProp || '')).trim();

  const [query, setQuery] = useState(initialQuery);

  // Restore query on back/forward browser navigation
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/search');
    }
  };

  const results = useMemo(() => {
    const q = initialQuery.toLowerCase().trim();
    if (!q) return null;

    const matchedRituals = RITUALS_DATA.filter((r) => {
      const matchName = r.name.toLowerCase().includes(q);
      const matchTag = r.tagline?.toLowerCase().includes(q);
      const matchDeity = r.deity?.toLowerCase().includes(q);
      const matchSanskrit = r.sanskritName?.toLowerCase().includes(q);
      const matchCategory = r.category?.toLowerCase().includes(q);
      const matchDesc = r.heroDescription?.toLowerCase().includes(q);
      const matchHouse = (q.includes('house') || q.includes('warming') || q.includes('vastu')) && (r.slug.includes('griha') || r.slug.includes('vastu'));
      const matchGanesh = (q.includes('ganesh') || q.includes('vinayaka')) && (r.slug.includes('ganapati') || r.slug.includes('mahaganputi'));
      const matchPooja = q.includes('pooja') || q.includes('puja');
      const matchItems = r.baseRequiredItems?.some((item) => item.name.toLowerCase().includes(q));
      return matchName || matchTag || matchDeity || matchSanskrit || matchCategory || matchDesc || matchHouse || matchGanesh || matchItems || (matchPooja && r.category === 'Vrata');
    });

    const matchedProducts = SAMAGRI_PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      const matchRel = p.ritualRelevance?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchSlug = p.slug?.toLowerCase().includes(q);
      const matchItems = (q.includes('pooja items') || q.includes('samagri')) && p.inStock;
      const matchCamphor = q.includes('camphor') && p.slug.includes('camphor');
      return matchName || matchCat || matchRel || matchDesc || matchSlug || matchItems || matchCamphor;
    });

    const matchedFestivals = FESTIVALS_DATA.filter((f) => {
      const matchName = f.name.toLowerCase().includes(q);
      const matchTag = f.tagline?.toLowerCase().includes(q);
      const matchDesc = f.description?.toLowerCase().includes(q);
      const matchSanskrit = f.sanskritName?.toLowerCase().includes(q);
      return matchName || matchTag || matchDesc || matchSanskrit;
    });

    return {
      rituals: matchedRituals,
      products: matchedProducts,
      festivals: matchedFestivals,
      totalCount: matchedRituals.length + matchedProducts.length + matchedFestivals.length,
    };
  }, [initialQuery, RITUALS_DATA, SAMAGRI_PRODUCTS, FESTIVALS_DATA]);

  const suggestionPills = [
    'Bhimseni Camphor',
    'Satyanarayana Puja',
    'Griha Pravesh',
    'Varalakshmi',
    'Pure Cow Ghee Diya Wicks',
    'Brass Kalasha',
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
            className="absolute right-2.5 top-2.5 bottom-2.5 px-5 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs flex items-center space-x-1 shadow-sm transition-all cursor-pointer"
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
              className="px-3 py-1 rounded-full bg-sandalwood-100 hover:bg-brass-100/60 border border-sandalwood-200 text-temple-800 transition-colors cursor-pointer"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* State 1: Global Error with Retry */}
      {error && !SAMAGRI_PRODUCTS.length && !RITUALS_DATA.length ? (
        <div className="max-w-md mx-auto py-12 text-center space-y-4 bg-white rounded-3xl p-8 border border-vermillion-200 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-vermillion-50 text-vermillion-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif-title text-xl font-bold text-temple-900">
            Catalogue Service Unavailable
          </h3>
          <p className="text-xs text-temple-600 leading-relaxed">
            {error}. We could not retrieve the canonical catalogue at this time.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-brass-500 text-temple-950 font-bold text-xs flex items-center justify-center space-x-2 mx-auto shadow-brass"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : /* State 2: Active Loading */
      isLoading && initialQuery && !RITUALS_DATA.length ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-brass-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-temple-600">Searching canonical catalogue...</p>
        </div>
      ) : /* State 3: Search Query Provided */
      results ? (
        results.totalCount === 0 ? (
          /* Empty Results State */
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
          /* Results Populated */
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
                    <div key={f.id} className="bg-white rounded-2xl border border-sandalwood-200 p-4 flex items-center space-x-4 shadow-sm hover:border-brass-400 transition-all">
                      <img src={f.heroImage} alt={f.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brass-700 bg-brass-100 px-2 py-0.5 rounded">
                          {f.season}
                        </span>
                        <Link href={`/festivals/${f.slug}`} className="block font-serif-title text-base font-bold text-temple-900 hover:text-brass-700 transition-colors mt-1">
                          {f.name}
                        </Link>
                        <p className="text-xs text-temple-600 line-clamp-1 mt-0.5">{f.tagline}</p>
                        <p className="text-[11px] text-temple-400 mt-1">Auspicious Date: {f.upcomingDate}</p>
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
        /* State 4: Default Search Discovery View (Empty Query) */
        <div className="py-16 text-center text-xs text-temple-500 space-y-2 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-sandalwood-100 flex items-center justify-center mx-auto text-temple-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <p className="font-semibold text-temple-700">Enter a ritual, ceremony or product name above.</p>
          <p className="text-temple-500">
            Search our authentic knowledge graph to view prescribed materials, kit configurations, and Vedic instructions.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const queryFromUrl = searchParams?.q || '';
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-temple-500">Loading Search...</div>}>
      <SearchPageContent initialQueryFromProp={queryFromUrl} />
    </Suspense>
  );
}
