'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { dataStore } from '@/lib/dataStore';
import { PlacedOrder } from '@/types';
import { 
  Package, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Check, 
  Eye, 
  Truck,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHubFilter, setSelectedHubFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(null);

  const loadOrders = () => {
    const list = dataStore.getOrders();
    setOrders(list);
    if (list.length > 0 && !selectedOrder) {
      setSelectedOrder(list[0]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateBoxStatus = (
    orderId: string,
    boxKey: 'box1' | 'box2' | 'box3' | 'box4',
    newStatus: string
  ) => {
    dataStore.updateOrderBoxStatus(orderId, boxKey, newStatus);
    loadOrders();
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        boxSequenceStatus: {
          ...selectedOrder.boxSequenceStatus,
          [boxKey]: newStatus,
        },
      });
    }
  };

  const handleCreateDemoOrder = () => {
    const demoOrder: PlacedOrder = {
      orderId: `PK-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      customer: {
        name: 'Suresh Raghavan',
        phone: '+91 98450 12345',
        email: 'suresh.raghavan@example.com',
        address: 'Flat 402, Shravani Heritage, 12th Main, HAL 2nd Stage, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        ritualDate: '2026-09-18',
        notes: 'Please ensure fresh mango leaves are packed early morning.',
      },
      kits: [
        {
          id: `kit-${Date.now()}`,
          ritualId: 'satyanarayana-puja',
          ritualName: 'Sri Satyanarayana Swamy Puja',
          tier: 'complete',
          tradition: 'karnataka-smartha',
          peopleCount: 20,
          date: '2026-09-18',
          venue: 'Home Mandir',
          basePrice: 3499,
          finalPrice: 2849,
          ownedItemIds: ['sn-01', 'sn-02'],
          activeSubstitutions: {},
          items: [],
          totalItemsCount: 15,
          procuredItemsCount: 13,
          savedAmount: 650,
        },
      ],
      products: [
        {
          product: dataStore.getProducts()[2] || {
            id: 'prod-03',
            slug: 'bhimseni-camphor',
            sku: 'PK-LMP-003',
            name: 'Pure Bhimseni Flake Camphor (Edible Grade)',
            sanskritName: 'भीमसेनी कर्पूरम्',
            category: 'Lamps, Wicks & Aromatics',
            price: 180,
            weightOrVolume: '100g Jar',
            rating: 4.98,
            reviewCount: 420,
            inStock: true,
            inventoryByHub: { blr: 850, maa: 620, hyd: 530 },
            description: '100% natural botanical camphor',
            ritualRelevance: 'Aarti',
            shelfLife: '36 months',
            storage: 'Airtight',
            usedInRituals: ['satyanarayana-puja'],
            image: '',
            boxSequence: 4,
          },
          quantity: 2,
        },
      ],
      subtotal: 3859,
      savings: 650,
      total: 3209,
      assignedHub: 'Bengaluru Central (Indiranagar)',
      boxSequenceStatus: {
        box1: 'Assembly In Progress',
        box2: 'Scheduled for Assembly',
        box3: 'Fresh Flowers Where Supported',
        box4: 'Queued for Aarti Packing',
      },
    };

    dataStore.addOrder(demoOrder);
    loadOrders();
    setSelectedOrder(demoOrder);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHub =
      selectedHubFilter === 'all' ||
      o.assignedHub.toLowerCase().includes(selectedHubFilter.toLowerCase());
    return matchesSearch && matchesHub;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
              Customer Orders &amp; 4-Box Dispatch
            </h1>
            <p className="text-xs text-temple-600 mt-1">
              Track multi-hub preparation, verified delivery dates, and real-time box sequencing.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleCreateDemoOrder}
              className="px-3.5 py-2 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs shadow-brass transition-all"
            >
              + Create Test Order
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-sandalwood-200 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-temple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, or City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-sandalwood-50 border border-sandalwood-300 text-xs text-temple-900 focus:outline-none focus:ring-2 focus:ring-brass-500"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-temple-500 font-semibold">Hub:</span>
            <select
              value={selectedHubFilter}
              onChange={(e) => setSelectedHubFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-sandalwood-50 border border-sandalwood-300 text-temple-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brass-500"
            >
              <option value="all">All Hubs (BLR • MAA • HYD)</option>
              <option value="bengaluru">Bengaluru Central</option>
              <option value="chennai">Chennai South</option>
              <option value="hyderabad">Hyderabad Deccan</option>
            </select>
          </div>
        </div>

        {/* Orders Layout: List + Detail */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-sandalwood-200 p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-sandalwood-400 mx-auto" />
            <h3 className="font-serif-title text-xl font-bold text-temple-900">
              No Customer Orders Placed Yet
            </h3>
            <p className="text-xs text-temple-500 max-w-md mx-auto leading-relaxed">
              When customers complete checkout on the storefront, their orders appear here automatically. You can also generate a verified test order to inspect the 4-box packing workflow.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={handleCreateDemoOrder}
                className="px-4 py-2.5 rounded-xl bg-temple-900 text-sandalwood-100 text-xs font-bold shadow-temple hover:bg-temple-800 transition-all"
              >
                Generate Demo Customer Order
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Orders List Col */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-sandalwood-200 shadow-subtle overflow-hidden">
              <div className="p-4 bg-temple-900 text-sandalwood-100 border-b border-temple-800 flex items-center justify-between">
                <span className="font-serif-title text-sm font-bold">
                  All Orders ({filteredOrders.length})
                </span>
                <span className="text-[11px] text-brass-300">Live Sync</span>
              </div>

              <div className="divide-y divide-sandalwood-100 max-h-[700px] overflow-y-auto">
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrder?.orderId === order.orderId;
                  return (
                    <div
                      key={order.orderId}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 cursor-pointer transition-colors space-y-2 ${
                        isSelected ? 'bg-brass-50/70 border-l-4 border-brass-600' : 'hover:bg-sandalwood-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-brass-800 font-mono">
                          {order.orderId}
                        </span>
                        <span className="text-xs font-bold text-temple-900">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-temple-900">{order.customer.name}</p>
                        <p className="text-[11px] text-temple-500 truncate">
                          {order.customer.city} • {order.assignedHub}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-temple-500 pt-1">
                        <span>Auspicious Date: {order.customer.ritualDate || 'Scheduled'}</span>
                        <span className="font-semibold text-tulsi-700">
                          {order.kits?.length || 0} Kit • {order.products?.length || 0} Samagri
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Detail & 4-Box Sequence Col */}
            {selectedOrder && (
              <div className="lg:col-span-7 bg-white rounded-3xl border border-sandalwood-200 shadow-subtle p-6 space-y-6">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sandalwood-200 gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brass-800 bg-brass-100 px-2.5 py-0.5 rounded">
                      Order Breakdown
                    </span>
                    <h2 className="font-serif-title text-2xl font-bold text-temple-900 mt-1">
                      {selectedOrder.orderId}
                    </h2>
                    <p className="text-xs text-temple-500">
                      Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] uppercase font-bold text-temple-400 block">Total Procurement</span>
                    <span className="font-serif-title text-2xl font-bold text-temple-900">
                      ₹{selectedOrder.total.toLocaleString('en-IN')}
                    </span>
                    {selectedOrder.savings > 0 && (
                      <span className="text-[11px] text-tulsi-600 block font-semibold">
                        (Saved ₹{selectedOrder.savings} via deduplication)
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="p-4 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 space-y-2 text-xs text-temple-700">
                  <span className="font-bold text-temple-900 block uppercase tracking-wider text-[10px]">
                    Delivery Address &amp; Destination Hub
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <p className="font-semibold text-temple-900">{selectedOrder.customer.name}</p>
                      <p className="text-temple-600">{selectedOrder.customer.address}</p>
                      <p className="text-temple-600">{selectedOrder.customer.city}, {selectedOrder.customer.state} — {selectedOrder.customer.pincode}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-brass-600" />
                        <span>{selectedOrder.customer.phone}</span>
                      </p>
                      <p className="flex items-center space-x-1">
                        <Mail className="w-3.5 h-3.5 text-brass-600" />
                        <span>{selectedOrder.customer.email}</span>
                      </p>
                      <p className="flex items-center space-x-1 text-brass-800 font-semibold pt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Hub: {selectedOrder.assignedHub}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4-Box Sequenced Packaging Status Manager */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-title text-base font-bold text-temple-900 flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-brass-600" />
                      <span>4-Box Packaging Pipeline</span>
                    </h3>
                    <span className="text-xs text-temple-500">Update Box Stages</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'box1' as const, label: 'Box 01 — Preparation', subtitle: 'Peeta, Ganga Jal, Wicks, Lamps' },
                      { key: 'box2' as const, label: 'Box 02 — Kalasha', subtitle: 'Kalasha, Coconut, Kumkum, Akshata' },
                      { key: 'box3' as const, label: 'Box 03 — Offerings', subtitle: 'Fresh Flowers (Where Supported), Betel' },
                      { key: 'box4' as const, label: 'Box 04 — Aarti', subtitle: 'Bhimseni Camphor, Dhoop, Bell' },
                    ].map((box) => (
                      <div key={box.key} className="p-3.5 rounded-xl border border-sandalwood-200 bg-white space-y-2">
                        <div>
                          <p className="text-xs font-bold text-temple-900">{box.label}</p>
                          <p className="text-[10px] text-temple-500">{box.subtitle}</p>
                        </div>
                        <select
                          value={selectedOrder.boxSequenceStatus?.[box.key] || 'Scheduled'}
                          onChange={(e) => handleUpdateBoxStatus(selectedOrder.orderId, box.key, e.target.value)}
                          className="w-full p-2 rounded-lg bg-sandalwood-50 border border-sandalwood-300 text-xs font-semibold text-temple-900 focus:outline-none focus:ring-1 focus:ring-brass-500 cursor-pointer"
                        >
                          <option value="Scheduled for Assembly">Scheduled for Assembly</option>
                          <option value="In Assembly">In Assembly</option>
                          <option value="Packed & Sealed">Packed &amp; Sealed</option>
                          <option value="QC Passed">QC Passed</option>
                          <option value="Dispatched to Courier">Dispatched to Courier</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items Manifest */}
                <div className="space-y-3 pt-3 border-t border-sandalwood-200">
                  <h3 className="font-serif-title text-base font-bold text-temple-900">
                    Included Procurement Items
                  </h3>

                  {selectedOrder.kits && selectedOrder.kits.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-brass-800">
                        Puja Kits ({selectedOrder.kits.length})
                      </p>
                      {selectedOrder.kits.map((kit) => (
                        <div key={kit.id} className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-temple-900">{kit.ritualName}</p>
                            <p className="text-temple-500 capitalize">
                              {kit.tier} Tier • For {kit.peopleCount} Devotees • {kit.tradition}
                            </p>
                            {kit.ownedItemIds.length > 0 && (
                              <p className="text-tulsi-700 text-[11px]">
                                ✓ {kit.ownedItemIds.length} items deducted as already owned at home
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-temple-900">₹{kit.finalPrice.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedOrder.products && selectedOrder.products.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-brass-800">
                        Individual Samagri ({selectedOrder.products.length})
                      </p>
                      {selectedOrder.products.map(({ product, quantity }) => (
                        <div key={product.id} className="p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-temple-900">{product.name}</p>
                            <p className="text-temple-500">Box 0{product.boxSequence} • Qty: {quantity}</p>
                          </div>
                          <span className="font-bold text-temple-900">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
