'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { dataStore } from '@/lib/dataStore';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Calendar,
  Layers,
  MapPin,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(() => dataStore.getOperationalStats());
  const [recentOrders, setRecentOrders] = useState(() => dataStore.getOrders().slice(0, 5));

  const refreshData = () => {
    setStats(dataStore.getOperationalStats());
    setRecentOrders(dataStore.getOrders().slice(0, 5));
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-temple-900 rounded-3xl p-6 sm:p-8 text-sandalwood-100 border border-brass-800 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-brass-500 text-temple-950">
                Live Operations Center
              </span>
              <span className="text-xs text-brass-300">Hubs: Bengaluru • Chennai • Hyderabad</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-sandalwood-50">
              Operations &amp; Ritual Logistics
            </h1>
            <p className="text-xs text-sandalwood-300">
              Real-time multi-hub inventory, customer procurement orders, and 4-box packing pipeline.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshData}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-temple-800 hover:bg-temple-700 text-xs font-semibold text-brass-300 border border-brass-700/40 transition-colors self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Metrics</span>
          </button>
        </div>

        {/* Real Operational Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-sandalwood-200 shadow-subtle space-y-2">
            <div className="flex items-center justify-between text-temple-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
              <Package className="w-4 h-4 text-brass-600" />
            </div>
            <p className="font-serif-title text-2xl font-bold text-temple-900">
              {stats.totalOrders}
            </p>
            <p className="text-[11px] text-temple-500">
              {stats.totalOrders === 0 ? 'No orders placed yet' : `${stats.totalOrders} verified orders recorded`}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-sandalwood-200 shadow-subtle space-y-2">
            <div className="flex items-center justify-between text-temple-500">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Procurement</span>
              <TrendingUp className="w-4 h-4 text-tulsi-600" />
            </div>
            <p className="font-serif-title text-2xl font-bold text-temple-900">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-temple-500">
              {stats.totalRevenue === 0 ? 'Awaiting initial checkout' : 'From completed orders'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-sandalwood-200 shadow-subtle space-y-2">
            <div className="flex items-center justify-between text-temple-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Samagri SKUs</span>
              <ShoppingBag className="w-4 h-4 text-brass-600" />
            </div>
            <p className="font-serif-title text-2xl font-bold text-temple-900">
              {stats.activeProductsCount}
            </p>
            <p className="text-[11px] text-temple-500">
              Single-origin unadulterated items
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-sandalwood-200 shadow-subtle space-y-2">
            <div className="flex items-center justify-between text-temple-500">
              <span className="text-xs font-bold uppercase tracking-wider">Low Stock Alerts</span>
              <AlertTriangle className={`w-4 h-4 ${stats.lowStockCount > 0 ? 'text-vermillion-600' : 'text-tulsi-600'}`} />
            </div>
            <p className={`font-serif-title text-2xl font-bold ${stats.lowStockCount > 0 ? 'text-vermillion-700' : 'text-temple-900'}`}>
              {stats.lowStockCount}
            </p>
            <p className="text-[11px] text-temple-500">
              {stats.lowStockCount > 0 ? 'Items below 400 total units' : 'All hubs adequately stocked'}
            </p>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/orders"
            className="p-5 rounded-2xl bg-white hover:bg-brass-50/50 border border-sandalwood-200 hover:border-brass-400 transition-all space-y-2 group shadow-subtle"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-brass-100 text-brass-800 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-temple-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-serif-title text-base font-bold text-temple-900">
              Manage Orders &amp; 4-Box Packing
            </h3>
            <p className="text-xs text-temple-600">
              View customer delivery details, assign regional hubs, and update Box 01–04 packing status.
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="p-5 rounded-2xl bg-white hover:bg-brass-50/50 border border-sandalwood-200 hover:border-brass-400 transition-all space-y-2 group shadow-subtle"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-brass-100 text-brass-800 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-temple-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-serif-title text-base font-bold text-temple-900">
              Product Stock &amp; Ritual Links
            </h3>
            <p className="text-xs text-temple-600">
              Update inventory counts across BLR, MAA, and HYD hubs. Associate products with rituals.
            </p>
          </Link>

          <Link
            href="/admin/festivals"
            className="p-5 rounded-2xl bg-white hover:bg-brass-50/50 border border-sandalwood-200 hover:border-brass-400 transition-all space-y-2 group shadow-subtle"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-brass-100 text-brass-800 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-temple-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-serif-title text-base font-bold text-temple-900">
              Seasonal Festival Calendar
            </h3>
            <p className="text-xs text-temple-600">
              Update South Indian festival dates, tradition notes, and featured puja kits.
            </p>
          </Link>
        </div>

        {/* Low Stock Alerts Table if any */}
        {stats.lowStockCount > 0 && (
          <div className="bg-white rounded-3xl border border-vermillion-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center space-x-2 text-vermillion-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif-title text-lg font-bold">
                Low Inventory Priority Notice ({stats.lowStockCount} SKUs)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.lowStockProducts.map((p) => {
                const totalUnits = p.inventoryByHub.blr + p.inventoryByHub.maa + p.inventoryByHub.hyd;
                return (
                  <div key={p.id} className="p-3 rounded-xl bg-vermillion-50/50 border border-vermillion-100 text-xs space-y-1">
                    <p className="font-bold text-temple-900">{p.name}</p>
                    <p className="text-temple-600">SKU: {p.sku} • {p.weightOrVolume}</p>
                    <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-vermillion-800">
                      <span>Total Stock: {totalUnits} units</span>
                      <span>BLR: {p.inventoryByHub.blr} | MAA: {p.inventoryByHub.maa} | HYD: {p.inventoryByHub.hyd}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Orders Section */}
        <div className="bg-white rounded-3xl border border-sandalwood-200 p-6 sm:p-8 shadow-subtle space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-title text-xl font-bold text-temple-900">
                Recent Customer Orders
              </h3>
              <p className="text-xs text-temple-500">
                Live stream of orders placed through the customer checkout experience.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brass-700 hover:text-brass-900 flex items-center space-x-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-sandalwood-200 rounded-2xl space-y-2">
              <Package className="w-10 h-10 text-sandalwood-400 mx-auto" />
              <h4 className="font-serif-title text-base font-bold text-temple-800">
                No Customer Orders Yet
              </h4>
              <p className="text-xs text-temple-500 max-w-sm mx-auto">
                Orders placed through the customer store will appear here in real-time, showing customer details, items, and packing pipeline.
              </p>
              <div className="pt-2">
                <Link
                  href="/rituals"
                  target="_blank"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-temple-900 text-sandalwood-100 text-xs font-semibold"
                >
                  <span>Test Customer Journey ↗</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-temple-800">
                <thead>
                  <tr className="border-b border-sandalwood-200 text-[11px] uppercase tracking-wider text-temple-500">
                    <th className="pb-3 font-bold">Order ID</th>
                    <th className="pb-3 font-bold">Customer</th>
                    <th className="pb-3 font-bold">Delivery Hub</th>
                    <th className="pb-3 font-bold">Target Date</th>
                    <th className="pb-3 font-bold">Amount</th>
                    <th className="pb-3 font-bold">4-Box Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandalwood-100">
                  {recentOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-sandalwood-50/70 transition-colors">
                      <td className="py-3 font-bold text-brass-700">{order.orderId}</td>
                      <td className="py-3">
                        <p className="font-semibold text-temple-900">{order.customer.name}</p>
                        <p className="text-[11px] text-temple-500">{order.customer.city} • {order.customer.phone}</p>
                      </td>
                      <td className="py-3 text-temple-700">{order.assignedHub}</td>
                      <td className="py-3 text-temple-600">{order.customer.ritualDate || 'Auspicious Muhurtha'}</td>
                      <td className="py-3 font-bold text-temple-900">₹{order.total.toLocaleString('en-IN')}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full bg-tulsi-100 text-tulsi-800 font-semibold text-[11px]">
                          {order.boxSequenceStatus?.box1 || 'In Queue'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
