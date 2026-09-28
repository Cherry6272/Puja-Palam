'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAdmin } from '@/app/actions/auth';
import { 
  Flame, 
  LayoutDashboard, 
  Package, 
  Compass, 
  Sparkles, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Layers,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    // Middleware handles route protection, so we just set authorized to true.
    setIsAuthorized(true);
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    router.replace('/admin/login');
  };

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-temple-950 flex items-center justify-center text-sandalwood-300 text-xs">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-brass-400 animate-pulse" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  const navLinks = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders & Dispatch', href: '/admin/orders', icon: Package },
    { label: 'Products & Stock', href: '/admin/products', icon: ShoppingBag },
    { label: 'Rituals & Engine', href: '/admin/rituals', icon: Compass },
    { label: 'Puja Kits Tiers', href: '/admin/kits', icon: Layers },
    { label: 'Festivals Calendar', href: '/admin/festivals', icon: Calendar },
    { label: 'Customers Directory', href: '/admin/customers', icon: Users },
    { label: 'Hub Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-sandalwood-50 flex">
      {/* Mobile Nav Drawer Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2.5 rounded-xl bg-temple-900 text-sandalwood-100 shadow-md"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-temple-950 text-sandalwood-100 flex flex-col justify-between border-r border-brass-900/60 transform transition-transform duration-200 lg:translate-x-0 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-temple-900">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brass-300 via-brass-500 to-brass-700 flex items-center justify-center shadow-brass">
              <Flame className="w-5 h-5 text-temple-950" />
            </div>
            <div>
              <span className="font-serif-title text-lg font-bold tracking-wider text-sandalwood-50">
                PUJA KARYAM
              </span>
              <p className="text-[9px] uppercase tracking-widest text-brass-400 font-bold">
                Admin Console
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileNavOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brass-500 text-temple-950 shadow-brass font-bold'
                    : 'text-sandalwood-300 hover:text-white hover:bg-temple-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-temple-950' : 'text-brass-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-temple-900 space-y-3 bg-temple-900/40">
          <div className="flex items-center space-x-2.5 px-2">
            <div className="w-7 h-7 rounded-full bg-brass-800 flex items-center justify-center text-[10px] font-bold text-brass-200">
              OP
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-sandalwood-100 truncate">Lead Ritual Operations</p>
              <p className="text-[10px] text-brass-400 truncate">admin@pujakaryam.com</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="px-2.5 py-1.5 rounded-lg bg-temple-900 hover:bg-temple-800 text-[11px] text-sandalwood-300 text-center font-medium transition-colors"
            >
              Storefront ↗
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg bg-vermillion-950/80 hover:bg-vermillion-900 border border-vermillion-800 text-[11px] text-vermillion-200 text-center font-medium flex items-center justify-center space-x-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
};
