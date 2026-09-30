'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { dataStore } from '@/lib/dataStore';
import { Users, Phone, Mail, MapPin, Package, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(() => dataStore.getCustomers());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCustomers(dataStore.getCustomers());
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
            Customers Directory
          </h1>
          <p className="text-xs text-temple-600 mt-1">
            Real customer records derived strictly from completed procurement orders.
          </p>
        </div>

        {customers.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-sandalwood-200 p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-sandalwood-400 mx-auto" />
            <h3 className="font-serif-title text-xl font-bold text-temple-900">
              No Customer Records Yet
            </h3>
            <p className="text-xs text-temple-500 max-w-sm mx-auto">
              Customer profiles are automatically created when orders are placed on the storefront.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/orders"
                className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-temple-900 text-sandalwood-100 text-xs font-semibold"
              >
                <span>View Orders &amp; Dispatch →</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-sandalwood-200 shadow-subtle overflow-hidden space-y-4 p-6">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-temple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Customers by Name, City, or Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-sandalwood-50 border border-sandalwood-300 text-xs text-temple-900 focus:outline-none focus:ring-2 focus:ring-brass-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-temple-800">
                <thead>
                  <tr className="border-b border-sandalwood-200 text-[11px] uppercase tracking-wider text-temple-500">
                    <th className="pb-3 font-bold">Customer Name</th>
                    <th className="pb-3 font-bold">Contact</th>
                    <th className="pb-3 font-bold">City</th>
                    <th className="pb-3 font-bold">Total Orders</th>
                    <th className="pb-3 font-bold">Total Spent</th>
                    <th className="pb-3 font-bold">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandalwood-100">
                  {filteredCustomers.map((c, i) => (
                    <tr key={i} className="hover:bg-sandalwood-50/70">
                      <td className="py-3.5 font-bold text-temple-900">{c.name}</td>
                      <td className="py-3.5">
                        <p className="flex items-center space-x-1 text-temple-700">
                          <Phone className="w-3 h-3 text-brass-600" />
                          <span>{c.phone.replace(/.(?=.{4})/g, '*')}</span>
                        </p>
                        <p className="flex items-center space-x-1 text-temple-500 text-[11px]">
                          <Mail className="w-3 h-3 text-brass-600" />
                          <span>{c.email.replace(/(.{2})(.*)(?=@)/, '$1***')}</span>
                        </p>
                      </td>
                      <td className="py-3.5 font-medium">{c.city}</td>
                      <td className="py-3.5 font-bold text-brass-700">{c.orderCount} Orders</td>
                      <td className="py-3.5 font-bold text-temple-900">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 text-temple-500 text-[11px]">
                        {new Date(c.lastOrderDate).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
