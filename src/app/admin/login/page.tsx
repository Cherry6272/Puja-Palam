'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/adminAuth';
import { ShieldCheck, Flame, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@pujakaryam.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to /admin
    if (adminAuth.isAuthenticated()) {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = adminAuth.login(email, password);
      if (res.success) {
        router.replace('/admin');
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-temple-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brass-700/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-3">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brass-300 via-brass-500 to-brass-700 flex items-center justify-center mx-auto shadow-brass">
          <Flame className="w-7 h-7 text-temple-950" />
        </div>
        <h2 className="font-serif-title text-3xl font-bold tracking-wider text-sandalwood-50">
          PUJA KARYAM
        </h2>
        <p className="text-xs uppercase tracking-widest text-brass-400 font-semibold">
          Operations &amp; Ritual Control Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-temple-900 border border-brass-700/50 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="space-y-1 border-b border-temple-800 pb-4">
            <h3 className="font-serif-title text-xl font-bold text-sandalwood-100">
              Admin Authentication
            </h3>
            <p className="text-xs text-sandalwood-400">
              Enter your authorized operational credentials to manage orders, inventory, and rituals.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-vermillion-950/80 border border-vermillion-700 text-vermillion-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-vermillion-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-sandalwood-200 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-temple-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pujakaryam.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-temple-950 border border-temple-700 text-sandalwood-100 text-sm placeholder:text-temple-500 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-sandalwood-200 uppercase tracking-wider mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-temple-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-temple-950 border border-temple-700 text-sandalwood-100 text-sm placeholder:text-temple-500 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-[11px] text-temple-400 mt-1">
                Default demonstration key: <code className="text-brass-300">pujakaryam2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brass-600 to-brass-500 hover:from-brass-500 hover:to-brass-400 text-temple-950 font-bold text-sm tracking-wide flex items-center justify-center space-x-2 shadow-brass transition-all active:scale-98 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'Verifying Access...' : 'Enter Admin Console'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="pt-4 border-t border-temple-800 text-center">
            <Link
              href="/"
              className="text-xs text-sandalwood-400 hover:text-brass-300 transition-colors inline-flex items-center space-x-1"
            >
              <span>← Return to Customer Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
