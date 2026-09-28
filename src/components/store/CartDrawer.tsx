'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { 
  X, 
  Trash2, 
  Package, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  QrCode,
  Truck
} from 'lucide-react';
import Link from 'next/link';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartKits, 
    cartProducts, 
    removeKit, 
    removeProduct, 
    updateProductQty, 
    totalAmount, 
    totalSavings, 
    totalItemsCount,
    clearCart 
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: 'Suresh Raghavan',
    phone: '+91 98450 12345',
    address: 'Flat 402, Shravani Heritage, 12th Main, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    ritualDate: '2026-09-15',
  });

  if (!isCartOpen) return null;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderConfirmed(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-temple-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-sandalwood-50 shadow-2xl flex flex-col border-l border-brass-400/40">
          
          {/* Header */}
          <div className="bg-temple-900 px-6 py-5 flex items-center justify-between text-sandalwood-100 border-b border-brass-800">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5 text-brass-400" />
              <div>
                <h2 className="font-serif-title text-lg font-bold text-sandalwood-50">
                  Your Ritual Procurement
                </h2>
                <p className="text-xs text-brass-300">
                  {totalItemsCount} Total Items • Sequenced in Boxes
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                setOrderConfirmed(false);
              }}
              className="p-2 rounded-lg text-sandalwood-400 hover:text-white hover:bg-temple-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {orderConfirmed ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-tulsi-100 text-tulsi-600 flex items-center justify-center mx-auto shadow-brass">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif-title text-2xl font-bold text-temple-900">
                  Puja Ready Order Confirmed!
                </h3>
                <p className="text-sm text-temple-600 max-w-xs mx-auto">
                  Order <strong>#PK-78294</strong> has been routed to Bengaluru Central Fulfillment Hub. Your items will be packed strictly in Box 01 to Box 04 sequence.
                </p>

                <div className="p-4 rounded-xl bg-white border border-brass-200 text-left space-y-2 text-xs text-temple-700">
                  <div className="flex items-center justify-between font-semibold text-temple-900">
                    <span>Target Delivery Date:</span>
                    <span>{shippingAddress.ritualDate} (Morning)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fulfillment Hub:</span>
                    <span className="text-brass-700 font-medium">Bengaluru Hub (Central)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Packaging Method:</span>
                    <span className="font-medium">4-Box Ritual Sequence + QR Digital Guide</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col space-y-2">
                  <Link
                    href="/guide"
                    onClick={() => {
                      setIsCartOpen(false);
                      setOrderConfirmed(false);
                    }}
                    className="w-full py-3 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-900 font-bold text-xs flex items-center justify-center space-x-2 shadow-brass"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Open Digital Ritual Guide</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setOrderConfirmed(false);
                      setIsCartOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl border border-sandalwood-300 text-temple-700 text-xs font-semibold hover:bg-sandalwood-100"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : totalItemsCount === 0 ? (
              <div className="text-center py-16 space-y-4 text-temple-500">
                <Package className="w-16 h-16 mx-auto text-sandalwood-300 stroke-1" />
                <p className="text-base font-serif-title font-bold text-temple-700">
                  No ritual items selected yet
                </p>
                <p className="text-xs max-w-xs mx-auto">
                  Begin by designing your ritual kit or selecting from our verified canonical samagri catalogue.
                </p>
                <Link
                  href="/planner"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brass-500 text-temple-900 font-bold text-xs shadow-brass"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Ritual Planner</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Customized Kits in Cart */}
                {cartKits.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brass-800">
                      Customized Ritual Kits ({cartKits.length})
                    </h3>
                    {cartKits.map((kit) => (
                      <div
                        key={kit.id}
                        className="bg-white rounded-xl border border-brass-300/70 p-4 shadow-sm space-y-3 relative"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brass-100 text-brass-800">
                              {kit.tier} Kit
                            </span>
                            <h4 className="font-serif-title text-base font-bold text-temple-900 mt-1">
                              {kit.ritualName}
                            </h4>
                            <p className="text-xs text-temple-500">
                              For {kit.peopleCount} Attendees • {kit.venue}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeKit(kit.id)}
                            className="text-temple-400 hover:text-vermillion-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Deduplication Reassurance */}
                        {kit.ownedItemIds.length > 0 && (
                          <div className="flex items-center space-x-1.5 text-xs text-tulsi-700 bg-tulsi-50/70 p-2 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>
                              {kit.ownedItemIds.length} items excluded as already owned. Saved ₹{kit.savedAmount}.
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-sandalwood-200">
                          <span className="text-xs text-temple-600">
                            {kit.procuredItemsCount} Items to Procure
                          </span>
                          <span className="font-serif-title text-base font-bold text-temple-900">
                            ₹{kit.finalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Individual Samagri Products */}
                {cartProducts.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brass-800">
                      Individual Samagri ({cartProducts.length})
                    </h3>
                    {cartProducts.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl border border-sandalwood-200 p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-sandalwood-200"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-temple-900 line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-[11px] text-temple-500">
                              Box {product.boxSequence} • {product.weightOrVolume}
                            </p>
                            <span className="text-xs font-bold text-brass-700">
                              ₹{product.price} each
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center border border-sandalwood-300 rounded-lg overflow-hidden text-xs">
                            <button
                              type="button"
                              onClick={() => updateProductQty(product.id, quantity - 1)}
                              className="px-2 py-1 bg-sandalwood-100 hover:bg-sandalwood-200"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-1 font-semibold">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateProductQty(product.id, quantity + 1)}
                              className="px-2 py-1 bg-sandalwood-100 hover:bg-sandalwood-200"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProduct(product.id)}
                            className="text-temple-400 hover:text-vermillion-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4-Box Packaging Guarantee Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-brass-50 to-sandalwood-100 border border-brass-300/50 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-temple-900">
                    <Truck className="w-4 h-4 text-brass-600" />
                    <span>Ritual-Ready Sequenced Packaging</span>
                  </div>
                  <p className="text-[11px] text-temple-600 leading-relaxed">
                    Every order is categorized inside Box 01 (Preparation), Box 02 (Kalasha), Box 03 (Offerings), and Box 04 (Aarti) with QR-guided instructions.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Actions */}
          {!orderConfirmed && totalItemsCount > 0 && (
            <div className="p-6 bg-white border-t border-sandalwood-200 space-y-4">
              <div className="space-y-1.5 text-xs text-temple-600">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-semibold text-temple-900">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-tulsi-700">
                    <span>Already Owned Deductions</span>
                    <span className="font-bold">-₹{totalSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Sequenced Packaging & Delivery</span>
                  <span className="text-tulsi-600 font-semibold">Free (Consecrated)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-sandalwood-200 text-base font-bold text-temple-900">
                  <span>Total Procurement</span>
                  <span className="font-serif-title">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Actions */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold text-sm tracking-wide flex items-center justify-center space-x-2 shadow-temple hover:shadow-brass transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-brass-400" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-brass-400" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-sandalwood-300 hover:border-brass-500 bg-white text-temple-800 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>View Full Cart Breakdown</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
