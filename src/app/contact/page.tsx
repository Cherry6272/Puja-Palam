'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Puja Samagri Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', subject: 'Puja Samagri Inquiry', message: '' });
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-100 text-brass-800 text-xs font-bold uppercase tracking-widest">
          <Mail className="w-3.5 h-3.5" />
          <span>Devotee Support &amp; Hub Inquiries</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-temple-900">
          We are Here to Support Your Ritual
        </h1>
        <p className="text-xs sm:text-sm text-temple-600 max-w-2xl mx-auto leading-relaxed">
          Questions regarding canonical items, regional tradition variations, bulk temple supplies, or same-day auspicious delivery? Reach our ritual coordination team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-sandalwood-200 shadow-temple space-y-6">
          <h2 className="font-serif-title text-xl font-bold text-temple-900">
            Send an Inquiry to Our Ritual Scholars
          </h2>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-tulsi-50 border border-tulsi-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-tulsi-600 mx-auto" />
              <h3 className="font-serif-title text-lg font-bold text-tulsi-900">
                Inquiry Received
              </h3>
              <p className="text-xs text-tulsi-800 max-w-sm mx-auto">
                Thank you. A regional coordinator from your nearest hub will contact you within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-temple-700 uppercase block">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sandalwood-300 text-xs text-temple-900 focus:outline-none focus:ring-2 focus:ring-brass-400"
                    placeholder="Your Name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-temple-700 uppercase block">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sandalwood-300 text-xs text-temple-900 focus:outline-none focus:ring-2 focus:ring-brass-400"
                    placeholder="+91 98450 12345"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-temple-700 uppercase block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sandalwood-300 text-xs text-temple-900 focus:outline-none focus:ring-2 focus:ring-brass-400"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-temple-700 uppercase block">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sandalwood-300 text-xs text-temple-900 focus:outline-none focus:ring-2 focus:ring-brass-400 bg-white"
                >
                  <option value="Puja Samagri Inquiry">Puja Samagri Inquiry</option>
                  <option value="Custom Ritual Planning">Custom Ritual Planning</option>
                  <option value="Pandit / Purohit Network Partnership">Pandit / Purohit Network Partnership</option>
                  <option value="Temple / Institutional B2B Supply">Temple / Institutional B2B Supply</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-temple-700 uppercase block">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sandalwood-300 text-xs text-temple-900 focus:outline-none focus:ring-2 focus:ring-brass-400"
                  placeholder="How can we assist with your ritual preparation?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold text-xs flex items-center justify-center space-x-2 shadow-temple transition-all"
              >
                <Send className="w-4 h-4 text-brass-300" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Hub Addresses & Direct Contacts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-sandalwood-200 shadow-subtle space-y-5">
            <h2 className="font-serif-title text-xl font-bold text-temple-900">
              Regional Fulfillment Hubs
            </h2>

            <div className="space-y-4 text-xs text-temple-700">
              <div className="p-4 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-temple-900">
                  <MapPin className="w-4 h-4 text-brass-600" />
                  <span>Bengaluru Central Hub</span>
                </div>
                <p className="text-temple-600">12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038</p>
                <p className="text-brass-800 font-semibold pt-1">support.blr@samptrapthi.com</p>
              </div>

              <div className="p-4 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-temple-900">
                  <MapPin className="w-4 h-4 text-brass-600" />
                  <span>Chennai South Hub</span>
                </div>
                <p className="text-temple-600">Luz Church Road, Mylapore, Chennai, TN 600004</p>
                <p className="text-brass-800 font-semibold pt-1">support.maa@samptrapthi.com</p>
              </div>

              <div className="p-4 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-temple-900">
                  <MapPin className="w-4 h-4 text-brass-600" />
                  <span>Hyderabad Deccan Hub</span>
                </div>
                <p className="text-temple-600">RP Road, Secunderabad, Telangana 500003</p>
                <p className="text-brass-800 font-semibold pt-1">support.hyd@samptrapthi.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
