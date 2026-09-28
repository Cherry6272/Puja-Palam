'use client';

import React, { useState } from 'react';
import { SamagriProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check, Star, ShieldCheck } from 'lucide-react';

import Link from 'next/link';

interface Props {
  product: SamagriProduct;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { addProduct } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addProduct(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="bg-white rounded-3xl border border-sandalwood-200 overflow-hidden shadow-subtle hover:shadow-brass transition-all duration-300 flex flex-col justify-between group">
      {/* Product Image Link */}
      <Link href={`/samagri/${product.slug}`} className="block relative aspect-square overflow-hidden bg-sandalwood-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-temple-900/80 backdrop-blur-md text-sandalwood-100">
            Box 0{product.boxSequence}
          </span>
        </div>
        {product.originalPrice && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-vermillion-50 text-vermillion-700 border border-vermillion-200">
              Save ₹{product.originalPrice - product.price}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-temple-400 block">
            {product.category}
          </span>
          <Link href={`/samagri/${product.slug}`} className="hover:text-brass-700 transition-colors">
            <h4 className="font-serif-title text-base font-bold text-temple-900 line-clamp-1 mt-0.5">
              {product.name}
            </h4>
          </Link>
          <p className="text-xs font-serif-title text-vermillion-700">
            {product.sanskritName}
          </p>

          <p className="text-xs text-temple-600 mt-2 line-clamp-2 leading-relaxed">
            {product.ritualRelevance}
          </p>

          {/* Used For Ritual Links */}
          {product.usedInRituals && product.usedInRituals.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-1 text-[10px]">
              <span className="text-temple-400 font-bold uppercase">Used in:</span>
              {product.usedInRituals.slice(0, 2).map((rSlug) => (
                <Link
                  key={rSlug}
                  href={`/rituals/${rSlug}`}
                  className="px-1.5 py-0.5 rounded bg-brass-100/80 hover:bg-brass-200 text-brass-900 font-semibold capitalize transition-colors"
                >
                  {rSlug.replace('-', ' ')}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-temple-500 pt-2 border-t border-sandalwood-100 mt-2">
            <span>{product.weightOrVolume}</span>
            <span className="text-tulsi-700 font-medium flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hub Verified</span>
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-sandalwood-200 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="font-serif-title text-lg font-bold text-temple-900">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-temple-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isAdded
                ? 'bg-tulsi-600 text-white shadow-xs'
                : 'bg-temple-900 hover:bg-temple-800 text-sandalwood-50 shadow-temple'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-brass-300" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
