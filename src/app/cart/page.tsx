'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  Package, 
  Truck, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function CartPage() {
  const { 
    cartKits, 
    cartProducts, 
    removeKit, 
    removeProduct, 
    updateProductQty, 
    clearCart,
    totalAmount, 
    totalSavings, 
    totalItemsCount 
  } = useCart();

  if (totalItemsCount === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="text-center space-y-4 max-w-md bg-white rounded-3xl p-8 sm:p-12 border border-sandalwood-200 shadow-subtle">
          <Package className="w-16 h-16 mx-auto text-sandalwood-300 stroke-1" />
          <h1 className="font-serif-title text-2xl font-bold text-temple-900">
            Your Cart is Empty
          </h1>
          <p className="text-xs text-temple-600 leading-relaxed">
            You have not added any ritual kits or samagri materials yet. Begin by planning your ceremony or exploring our verified catalogue.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/plan-your-puja"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brass-500 text-temple-950 font-bold text-xs shadow-brass"
            >
              Plan My Puja
            </Link>
            <Link
              href="/samagri"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sandalwood-100 hover:bg-sandalwood-200 text-temple-800 font-bold text-xs border border-sandalwood-300"
            >
              Explore Samagri
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-temple-500">
        <Link href="/" className="hover:text-brass-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-temple-900 font-semibold">Shopping Cart</span>
      </nav>

      <div className="flex items-center justify-between border-b border-sandalwood-200 pb-4">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-temple-900">
            Your Ritual Procurement Cart
          </h1>
          <p className="text-xs text-temple-500 mt-1">
            {totalItemsCount} total items • Sequenced across Box 01 to 04
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-vermillion-700 hover:underline font-semibold"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items (Kits + Individual Samagri) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Kits Section */}
          {cartKits.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brass-800">
                Customized Ritual Kits ({cartKits.length})
              </h3>
              {cartKits.map((kit) => (
                <div
                  key={kit.id}
                  className="bg-white rounded-3xl border border-brass-300/70 p-6 shadow-subtle space-y-4 relative"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brass-100 text-brass-800">
                        {kit.tier} Kit
                      </span>
                      <h4 className="font-serif-title text-lg font-bold text-temple-900 mt-1">
                        {kit.ritualName}
                      </h4>
                      <p className="text-xs text-temple-500">
                        Configured for {kit.peopleCount} Devotees • Venue: {kit.venue}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeKit(kit.id)}
                      className="p-1.5 rounded-lg text-temple-400 hover:text-vermillion-600 hover:bg-vermillion-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Deduplication savings notice */}
                  {kit.ownedItemIds.length > 0 && (
                    <div className="flex items-center space-x-2 text-xs text-tulsi-800 bg-tulsi-50/80 p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-tulsi-600 flex-shrink-0" />
                      <span>
                        {kit.ownedItemIds.length} items marked as already owned at home. Saved ₹{kit.savedAmount}.
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-sandalwood-100">
                    <span className="text-xs text-temple-600">
                      {kit.procuredItemsCount} Materials to be Delivered (4 Sequenced Boxes)
                    </span>
                    <span className="font-serif-title text-xl font-bold text-temple-900">
                      ₹{kit.finalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products Section */}
          {cartProducts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brass-800">
                Individual Samagri ({cartProducts.length})
              </h3>
              {cartProducts.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-sandalwood-200 p-4 sm:p-5 flex items-center justify-between shadow-subtle"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-sandalwood-200"
                    />
                    <div>
                      <Link href={`/samagri/${product.slug}`} className="hover:text-brass-700">
                        <h4 className="text-sm font-bold text-temple-900">
                          {product.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-vermillion-700 font-serif-title">
                        {product.sanskritName}
                      </p>
                      <p className="text-[11px] text-temple-500 mt-0.5">
                        Box 0{product.boxSequence} • {product.weightOrVolume}
                      </p>
                      <span className="text-xs font-bold text-brass-700">
                        ₹{product.price} each
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-sandalwood-300 rounded-xl overflow-hidden bg-sandalwood-50 text-xs">
                      <button
                        type="button"
                        onClick={() => updateProductQty(product.id, quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-sandalwood-200 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 font-bold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateProductQty(product.id, quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-sandalwood-200 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      className="text-temple-400 hover:text-vermillion-600 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-sandalwood-200 shadow-temple space-y-6 sticky top-28">
          <h3 className="font-serif-title text-xl font-bold text-temple-900 pb-2 border-b border-sandalwood-200">
            Order Summary
          </h3>

          <div className="space-y-2 text-xs text-temple-600">
            <div className="flex justify-between">
              <span>Items Total ({totalItemsCount} units)</span>
              <span className="font-bold text-temple-900">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-tulsi-700 font-bold">
                <span>Already Owned Deductions</span>
                <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Consecrated Packing &amp; Dispatch</span>
              <span className="text-tulsi-600 font-semibold">Free</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-sandalwood-200 text-base font-bold text-temple-900">
              <span>Total Payable</span>
              <span className="font-serif-title">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold text-xs flex items-center justify-center space-x-2 shadow-temple transition-all text-center"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 text-brass-300" />
          </Link>

          <div className="pt-2 flex items-center space-x-2 text-[11px] text-temple-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-brass-600" />
            <span>Multi-Hub Delivery: Bengaluru, Chennai, Hyderabad</span>
          </div>
        </div>
      </div>
    </div>
  );
}
