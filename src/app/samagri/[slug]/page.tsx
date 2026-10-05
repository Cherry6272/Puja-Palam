'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/hooks/useDataStore';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/store/ProductCard';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  Package, 
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';

export default function ProductDetailPage() {
  const { products: SAMAGRI_PRODUCTS, rituals: RITUALS_DATA, festivals: FESTIVALS_DATA, isLoading } = useDataStore();

  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { addProduct } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brass-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const product = SAMAGRI_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
  if (!product) {
    return notFound();
  }

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Related rituals where this item is used
  const relatedRituals = RITUALS_DATA.filter((r) =>
    product.usedInRituals.includes(r.slug) || product.usedInRituals.includes(r.id)
  );

  // Related products from the same category
  const relatedProducts = SAMAGRI_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addProduct(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addProduct(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-temple-500">
        <Link href="/" className="hover:text-brass-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/samagri" className="hover:text-brass-700">Samagri</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-temple-900 font-semibold">{product.name}</span>
      </nav>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-sandalwood-200 shadow-temple">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 relative aspect-square rounded-2xl overflow-hidden bg-sandalwood-100 border border-sandalwood-200">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-temple-900/80 backdrop-blur-md text-sandalwood-100">
              Box 0{product.boxSequence} • Ritual Sequenced
            </span>
          </div>
          {product.originalPrice && (
            <div className="absolute top-4 right-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-vermillion-100 text-vermillion-800 border border-vermillion-200">
                Save ₹{product.originalPrice - product.price}
              </span>
            </div>
          )}
        </div>

        {/* Right: Details & Buying Actions */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-brass-100 text-brass-800">
                {product.category}
              </span>
              <span className="text-xs text-tulsi-700 font-medium flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Vedic Authentic • Pure Origin</span>
              </span>
            </div>

            <h1 className="font-serif-title text-2xl sm:text-4xl font-bold text-temple-900">
              {product.name}
            </h1>

            <p className="font-serif-title text-base text-vermillion-700 font-medium">
              {product.sanskritName}
            </p>

            <div className="flex items-baseline space-x-3 pt-2">
              <span className="font-serif-title text-3xl font-bold text-temple-900">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-temple-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              <span className="text-xs text-tulsi-700 font-bold bg-tulsi-50 px-2 py-0.5 rounded">
                Inclusive of all taxes
              </span>
            </div>

            <p className="text-sm text-temple-700 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-2 pt-3 text-xs text-temple-700">
              <div className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200">
                <span className="text-[10px] text-temple-400 uppercase font-bold block">Pack Size / Weight</span>
                <span className="font-bold text-temple-900">{product.weightOrVolume}</span>
              </div>
              <div className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200">
                <span className="text-[10px] text-temple-400 uppercase font-bold block">Shelf Life</span>
                <span className="font-bold text-temple-900">{product.shelfLife}</span>
              </div>
              {product.material && (
                <div className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200">
                  <span className="text-[10px] text-temple-400 uppercase font-bold block">Material / Purity</span>
                  <span className="font-bold text-temple-900">{product.material}</span>
                </div>
              )}
              {product.origin && (
                <div className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200">
                  <span className="text-[10px] text-temple-400 uppercase font-bold block">Origin</span>
                  <span className="font-bold text-temple-900">{product.origin}</span>
                </div>
              )}
            </div>

            {/* Storage & Usage Instructions */}
            <div className="p-3.5 rounded-xl bg-brass-50/60 border border-brass-200 text-xs text-temple-700 space-y-1">
              <span className="font-bold text-temple-900 block">Ceremonial Significance:</span>
              <p className="text-brass-900 italic">&ldquo;{product.ritualRelevance}&rdquo;</p>
              <p className="text-[11px] text-temple-500 pt-1">
                <strong>Storage:</strong> {product.storage}
              </p>
            </div>
          </div>

          {/* Quantity Controls and Buying Actions */}
          <div className="pt-4 border-t border-sandalwood-200 space-y-3">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-temple-700 uppercase tracking-wider">
                Quantity
              </span>
              <div className="flex items-center border border-sandalwood-300 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 bg-sandalwood-100 hover:bg-sandalwood-200 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2 font-bold text-sm text-temple-900 min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 bg-sandalwood-100 hover:bg-sandalwood-200 text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-brass transition-all active:scale-98"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-temple-950" />
                    <span>Added to Cart ({quantity})</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-temple-950" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold text-xs flex items-center justify-center space-x-2 shadow-temple transition-all active:scale-98"
              >
                <Truck className="w-4 h-4 text-brass-300" />
                <span>Buy Now → Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Rituals where this item is required */}
      {relatedRituals.length > 0 && (
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
              Canonical Relationships
            </span>
            <h3 className="font-serif-title text-2xl font-bold text-temple-900 mt-1">
              Rituals Requiring This Item
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedRituals.map((r) => (
              <Link
                key={r.id}
                href={`/rituals/${r.slug}`}
                className="p-4 rounded-2xl bg-white border border-sandalwood-200 hover:border-brass-400 p-4 transition-all shadow-subtle flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-brass-700 uppercase">{r.category}</span>
                  <h4 className="font-serif-title text-base font-bold text-temple-900">{r.name}</h4>
                  <p className="text-[11px] text-temple-500">{r.typicalDuration}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-brass-600" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Products in the same Category */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brass-700">
              Complementary Offerings
            </span>
            <h3 className="font-serif-title text-2xl font-bold text-temple-900 mt-1">
              Related in {product.category}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
