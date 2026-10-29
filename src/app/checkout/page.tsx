'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { dataStore } from '@/lib/dataStore';
import { PlacedOrder } from '@/types';
import { 
  ShieldCheck, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ArrowRight,
  Package
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartKits, cartProducts, totalAmount, totalSavings, totalItemsCount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    ritualDate: '',
    deliverySlot: 'morning-consecrated',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Safely restore previously saved customer record if one genuinely exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pk_saved_customer');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setFormData((prev) => ({
            ...prev,
            name: parsed.name || '',
            phone: parsed.phone || '',
            email: parsed.email || '',
            address: parsed.address || '',
            city: parsed.city || '',
            pincode: parsed.pincode || '',
          }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // If cart is empty, show empty redirect
  if (totalItemsCount === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-white rounded-3xl p-8 border border-sandalwood-200 shadow-subtle">
          <Package className="w-16 h-16 mx-auto text-sandalwood-300 stroke-1" />
          <h2 className="font-serif-title text-2xl font-bold text-temple-900">
            No Items in Cart
          </h2>
          <p className="text-xs text-temple-600 leading-relaxed">
            Please add ritual materials or kits before proceeding to checkout.
          </p>
          <Link
            href="/samagri"
            className="inline-block px-6 py-3 rounded-xl bg-brass-500 text-temple-950 font-bold text-xs shadow-brass"
          >
            Explore Samagri Store
          </Link>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full name is required (minimum 2 characters).';
    }

    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      errs.phone = 'Mobile phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.email.trim()) {
      errs.email = 'A valid email address is required for receipt & digital companion.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address = 'Delivery address is required (minimum 5 characters).';
    }

    if (!formData.city.trim()) {
      errs.city = 'City is required.';
    }

    if (!formData.pincode.trim() || !/^[1-9]\d{5}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Valid 6-digit Indian Pincode is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent repeated submissions
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    const orderId = `PK-${Math.floor(10000 + Math.random() * 90000)}`;
    const placedOrder: PlacedOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      customer: formData,
      kits: cartKits,
      products: cartProducts,
      subtotal: totalAmount + totalSavings,
      savings: totalSavings,
      total: totalAmount,
      assignedHub:
        formData.city.toLowerCase().includes('chennai')
          ? 'Chennai South (Mylapore)'
          : formData.city.toLowerCase().includes('hyderabad')
          ? 'Hyderabad Deccan (Secunderabad)'
          : 'Bengaluru Central (Indiranagar)',
      boxSequenceStatus: {
        box1: 'Scheduled for Assembly',
        box2: 'Scheduled for Assembly',
        box3: 'Fresh Flowers Available Where Supported',
        box4: 'Queued for Aarti Packing',
      },
    };

    const res = await dataStore.addOrder(placedOrder);
    if (!res.success) {
      setSubmitError(res.error || 'Failed to place order. Database write failed.');
      setIsSubmitting(false);
      return;
    }

    // Save customer preferences locally for convenience on future checkouts
    try {
      localStorage.setItem('pk_saved_customer', JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      }));
    } catch {
      // ignore
    }

    clearCart();
    router.push(`/order-success?orderId=${orderId}`);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-temple-500">
        <Link href="/" className="hover:text-brass-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/cart" className="hover:text-brass-700">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-temple-900 font-semibold">Checkout</span>
      </nav>

      <div className="border-b border-sandalwood-200 pb-4">
        <h1 className="font-serif-title text-3xl font-bold text-temple-900">
          Delivery &amp; Consecration Details
        </h1>
        <p className="text-xs text-temple-500 mt-1">
          Review your ritual items and specify authentic delivery preferences.
        </p>
      </div>

      {submitError && (
        <div className="p-4 rounded-2xl bg-vermillion-50 border border-vermillion-200 text-vermillion-800 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-vermillion-600" />
          <div>
            <span className="font-bold block">Order Submission Error</span>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer & Address Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sandalwood-200 shadow-subtle space-y-5">
            <h2 className="font-serif-title text-xl font-bold text-temple-900">
              1. Devotee &amp; Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-temple-700 block">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-xs text-temple-900 focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-vermillion-500 ring-vermillion-200' : 'border-sandalwood-300 focus:ring-brass-400'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-[11px] text-vermillion-600">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-temple-700 block">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-xs text-temple-900 focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-vermillion-500 ring-vermillion-200' : 'border-sandalwood-300 focus:ring-brass-400'
                  }`}
                  placeholder="10-digit mobile number"
                />
                {errors.phone && <p className="text-[11px] text-vermillion-600">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold uppercase text-temple-700 block">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-xs text-temple-900 focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-vermillion-500 ring-vermillion-200' : 'border-sandalwood-300 focus:ring-brass-400'
                  }`}
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-[11px] text-vermillion-600">{errors.email}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sandalwood-200 shadow-subtle space-y-5">
            <h2 className="font-serif-title text-xl font-bold text-temple-900">
              2. Delivery Address &amp; Ceremony Timing
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold uppercase text-temple-700 block">
                  Street Address / House / Flat *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-xs text-temple-900 focus:outline-none focus:ring-2 ${
                    errors.address ? 'border-vermillion-500 ring-vermillion-200' : 'border-sandalwood-300 focus:ring-brass-400'
                  }`}
                  placeholder="Apartment name, street, landmark..."
                />
                {errors.address && <p className="text-[11px] text-vermillion-600">{errors.address}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-temple-700 block">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-xs text-temple-900 focus:outline-none focus:ring-2 ${
                    errors.city ? 'border-vermillion-500 ring-vermillion-200' : 'border-sandalwood-300 focus:ring-brass-400'
                  }`}
                  placeholder="e.g. Bengaluru, Chennai, Hyderabad"
                />
                {errors.city && <p className="text-[11px] text-vermillion-600">{errors.city}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-temple-700 block">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-xs text-temple-900 focus:outline-none focus:ring-2 ${
                    errors.pincode ? 'border-vermillion-500 ring-vermillion-200' : 'border-sandalwood-300 focus:ring-brass-400'
                  }`}
                  placeholder="6-digit pincode"
                />
                {errors.pincode && <p className="text-[11px] text-vermillion-600">{errors.pincode}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-temple-700 block">
                  Scheduled Ritual Date
                </label>
                <input
                  type="date"
                  value={formData.ritualDate}
                  onChange={(e) => setFormData({ ...formData, ritualDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sandalwood-300 text-xs text-temple-900 focus:outline-none focus:ring-2 focus:ring-brass-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-temple-700 block">
                  Delivery Slot Preference
                </label>
                <select
                  value={formData.deliverySlot}
                  onChange={(e) => setFormData({ ...formData, deliverySlot: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sandalwood-300 text-xs text-temple-900 focus:outline-none focus:ring-2 focus:ring-brass-400 bg-white"
                >
                  <option value="morning-consecrated">Early Morning Consecrated (5:00 AM – 7:30 AM)</option>
                  <option value="eve-prior">Evening Prior (5:00 PM – 8:00 PM)</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold uppercase text-temple-700 block">
                  Special Purohit Instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sandalwood-300 text-xs text-temple-900 focus:outline-none focus:ring-2 focus:ring-brass-400"
                  placeholder="Notes for the packaging coordinator..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Place Order */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-sandalwood-200 shadow-temple space-y-6 sticky top-28">
          <h3 className="font-serif-title text-xl font-bold text-temple-900 pb-2 border-b border-sandalwood-200">
            Order Review
          </h3>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
            {cartKits.map((k) => (
              <div key={k.id} className="p-2.5 rounded-xl bg-sandalwood-50 border border-sandalwood-200">
                <span className="font-bold text-temple-900 block">{k.ritualName}</span>
                <span className="text-temple-500">{k.procuredItemsCount} items • ₹{k.finalPrice}</span>
              </div>
            ))}

            {cartProducts.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between p-2 rounded-lg bg-sandalwood-50 border border-sandalwood-200">
                <span className="text-temple-800 line-clamp-1">{product.name} &times; {quantity}</span>
                <span className="font-bold text-temple-900">₹{product.price * quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-temple-600 pt-3 border-t border-sandalwood-200">
            <div className="flex justify-between">
              <span>Items Total:</span>
              <span className="font-bold text-temple-900">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-tulsi-700 font-bold">
                <span>Already Owned Deductions:</span>
                <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Sequenced 4-Box Packaging:</span>
              <span className="text-tulsi-600 font-semibold">Included</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-sandalwood-200 text-base font-bold text-temple-900">
              <span>Final Payable:</span>
              <span className="font-serif-title text-xl">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-temple-900 hover:bg-temple-800 disabled:opacity-50 text-sandalwood-50 font-bold text-xs flex items-center justify-center space-x-2 shadow-temple transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-sandalwood-50 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-brass-400" />
            )}
            <span>{isSubmitting ? 'Persisting Order...' : 'Submit Order Request'}</span>
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>

          <p className="text-[11px] text-temple-500 text-center leading-normal">
            No payment required for MVP validation. Order is routed directly to your nearest regional hub.
          </p>
        </div>
      </form>
    </div>
  );
}
