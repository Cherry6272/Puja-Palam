'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { dataStore } from '@/lib/dataStore';
import { SamagriProduct, ItemCategory } from '@/types';
import { useDataStore } from '@/hooks/useDataStore';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Compass, 
  MapPin, 
  AlertTriangle,
  Layers,
  Save
} from 'lucide-react';

const CATEGORIES: ItemCategory[] = [
  'Vessels & Brassware',
  'Sacred Powders & Pastes',
  'Offerings, Grains & Prasad',
  'Lamps, Wicks & Aromatics',
  'Sacred Flora & Leaves',
  'Fabrics & Sacred Threads',
];

export default function AdminProductsPage() {
  const { products: rawProducts, rituals: rawRituals, isLoading } = useDataStore();
  const [products, setProducts] = useState<SamagriProduct[]>([]);
  const [rituals, setRituals] = useState<typeof rawRituals>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<SamagriProduct | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setProducts(rawProducts);
      setRituals(rawRituals);
    }
  }, [isLoading, rawProducts, rawRituals]);

  const loadProducts = () => {
    setProducts(dataStore.getProducts());
    setRituals(dataStore.getRituals());
  };

  const handleStockDelta = (id: string, hub: 'blr' | 'maa' | 'hyd', delta: number) => {
    dataStore.updateProductStock(id, hub, delta);
    loadProducts();
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isCreatingNew) {
      dataStore.addProduct(editingProduct);
    } else {
      dataStore.updateProduct(editingProduct);
    }

    setEditingProduct(null);
    setIsCreatingNew(false);
    loadProducts();
  };

  const handleOpenCreate = () => {
    const newProd: SamagriProduct = {
      id: `prod-${Date.now()}`,
      slug: `new-samagri-${Date.now()}`,
      sku: `PK-SAM-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      sanskritName: '',
      category: 'Sacred Powders & Pastes',
      price: 150,
      originalPrice: 190,
      weightOrVolume: '100g Pack',
      rating: 4.9,
      reviewCount: 0,
      inStock: true,
      inventoryByHub: { blr: 100, maa: 100, hyd: 100 },
      description: '',
      ritualRelevance: '',
      material: 'Organic / Pure',
      origin: 'South India',
      shelfLife: '24 Months',
      storage: 'Airtight container',
      usedInRituals: ['satyanarayana-puja', 'ganapati-puja'],
      image: '/images/products/new-samagri.svg',
      gallery: [],
      boxSequence: 2,
    };
    setEditingProduct(newProd);
    setIsCreatingNew(true);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ritualRelevance.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
              Samagri Products &amp; Hub Inventory
            </h1>
            <p className="text-xs text-temple-600 mt-1">
              Manage product SKUs, regional hub stock allocation, and direct ritual associations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold text-xs shadow-temple transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-brass-400" />
            <span>Add New Samagri SKU</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-sandalwood-200 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-temple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Product Name, SKU, or Keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-sandalwood-50 border border-sandalwood-300 text-xs text-temple-900 focus:outline-none focus:ring-2 focus:ring-brass-500"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-temple-500 font-semibold">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-sandalwood-50 border border-sandalwood-300 text-temple-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brass-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Cards & Inventory Table */}
        <div className="bg-white rounded-3xl border border-sandalwood-200 shadow-subtle overflow-hidden">
          <div className="p-4 bg-temple-900 text-sandalwood-100 border-b border-temple-800 flex items-center justify-between">
            <span className="font-serif-title text-sm font-bold">
              Catalog Items ({filteredProducts.length})
            </span>
            <span className="text-[11px] text-brass-300">Hubs: BLR • MAA • HYD</span>
          </div>

          <div className="divide-y divide-sandalwood-100">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-8 h-8 border-4 border-brass-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-temple-600">Loading catalog items...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-sandalwood-300 rounded-2xl bg-white m-4">
                <ShoppingBag className="w-12 h-12 text-sandalwood-400 mx-auto mb-3" />
                <h3 className="font-serif-title text-xl font-bold text-temple-900">No Catalog Items Found</h3>
                <p className="text-sm text-temple-600 mt-1 max-w-md mx-auto">
                  The product database is currently empty. Click 'Add Samagri SKU' to start building your catalog.
                </p>
              </div>
            ) : filteredProducts.map((p) => {
              const totalStock = p.inventoryByHub.blr + p.inventoryByHub.maa + p.inventoryByHub.hyd;
              return (
                <div key={p.id} className="p-5 hover:bg-sandalwood-50/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Product Info */}
                  <div className="flex items-start space-x-4 max-w-xl">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-cover border border-sandalwood-200 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brass-800 bg-brass-100 px-2 py-0.5 rounded">
                          Box 0{p.boxSequence}
                        </span>
                        <span className="text-xs font-semibold text-temple-500 font-mono">
                          {p.sku}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-temple-900 leading-tight">
                        {p.name}
                      </h3>
                      <p className="text-xs text-brass-800 italic">
                        {p.sanskritName} • {p.weightOrVolume}
                      </p>
                      <p className="text-[11px] text-temple-500 line-clamp-1">
                        <strong>Origin:</strong> {p.origin || 'South India'} | <strong>Shelf Life:</strong> {p.shelfLife}
                      </p>

                      {/* Associated Rituals */}
                      <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="text-temple-400 font-bold uppercase">Used in:</span>
                        {p.usedInRituals.map((rSlug) => (
                          <span key={rSlug} className="px-1.5 py-0.5 rounded bg-sandalwood-200/80 text-temple-700 font-medium">
                            {rSlug}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Multi-Hub Stock Controllers */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:self-center">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] uppercase font-bold text-temple-400">Price</p>
                      <p className="font-serif-title text-xl font-bold text-temple-900">
                        ₹{p.price}
                      </p>
                      {p.originalPrice && (
                        <p className="text-[11px] text-temple-400 line-through">₹{p.originalPrice}</p>
                      )}
                    </div>

                    {/* Stock by Hubs */}
                    <div className="p-2.5 rounded-xl bg-sandalwood-50 border border-sandalwood-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-bold text-temple-700 pb-1 border-b border-sandalwood-200">
                        <span>Total: {totalStock} units</span>
                        <span className={totalStock < 400 ? 'text-vermillion-700' : 'text-tulsi-700'}>
                          {totalStock < 400 ? 'Low Stock' : 'Adequate'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                        {(['blr', 'maa', 'hyd'] as const).map((hub) => (
                          <div key={hub} className="space-y-1">
                            <span className="uppercase text-[9px] font-bold text-temple-400">{hub}</span>
                            <div className="flex items-center justify-center border border-sandalwood-300 rounded-lg overflow-hidden bg-white">
                              <button
                                type="button"
                                onClick={() => handleStockDelta(p.id, hub, -10)}
                                className="px-1 py-0.5 bg-sandalwood-100 hover:bg-sandalwood-200 text-temple-800 font-bold"
                              >
                                -
                              </button>
                              <span className="px-1.5 py-0.5 font-bold">{p.inventoryByHub[hub]}</span>
                              <button
                                type="button"
                                onClick={() => handleStockDelta(p.id, hub, 10)}
                                className="px-1 py-0.5 bg-sandalwood-100 hover:bg-sandalwood-200 text-temple-800 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct({ ...p });
                        setIsCreatingNew(false);
                      }}
                      className="p-2 rounded-xl border border-sandalwood-300 hover:border-brass-500 text-temple-700 hover:text-temple-900 bg-white"
                      title="Edit Product Details & Ritual Links"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit / Add Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-temple-950/70 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl border border-brass-400/50 shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-sandalwood-200 pb-3">
                <h3 className="font-serif-title text-xl font-bold text-temple-900">
                  {isCreatingNew ? 'Add New Samagri SKU' : `Edit: ${editingProduct.name}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="p-1 rounded-lg text-temple-400 hover:text-temple-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-temple-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-temple-700 mb-1">Sanskrit / Traditional Name</label>
                    <input
                      type="text"
                      value={editingProduct.sanskritName}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sanskritName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-temple-700 mb-1">SKU</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-temple-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-temple-700 mb-1">Box Sequence (1–4)</label>
                    <select
                      value={editingProduct.boxSequence}
                      onChange={(e) => setEditingProduct({ ...editingProduct, boxSequence: Number(e.target.value) as 1 | 2 | 3 | 4 })}
                      className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900 font-bold"
                    >
                      <option value={1}>Box 01 — Preparation</option>
                      <option value={2}>Box 02 — Kalasha</option>
                      <option value={3}>Box 03 — Offerings</option>
                      <option value={4}>Box 04 — Aarti</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-temple-700 mb-1">Pack Size / Weight</label>
                    <input
                      type="text"
                      value={editingProduct.weightOrVolume}
                      onChange={(e) => setEditingProduct({ ...editingProduct, weightOrVolume: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-temple-700 mb-1">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ItemCategory })}
                      className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-temple-700 mb-1">Primary Image URL</label>
                    <input
                      type="text"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-temple-700 mb-1">Gallery URLs (comma separated)</label>
                    <input
                      type="text"
                      value={editingProduct.gallery?.join(', ') || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, gallery: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-temple-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                  />
                </div>

                {/* Ritual Relationships */}
                <div className="p-4 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 space-y-2">
                  <label className="block font-bold text-temple-900 uppercase tracking-wider text-[10px]">
                    Canonical Relationships — Rituals Where This Item is Required
                  </label>
                  <p className="text-[11px] text-temple-500">
                    Checking these boxes makes this product appear under &ldquo;Used In&rdquo; on the product page, and in the ritual requirement engine.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {rituals.map((r) => {
                      const isChecked = editingProduct.usedInRituals.includes(r.slug);
                      return (
                        <label key={r.slug} className="flex items-center space-x-2 text-xs text-temple-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...editingProduct.usedInRituals, r.slug]
                                : editingProduct.usedInRituals.filter((s) => s !== r.slug);
                              setEditingProduct({ ...editingProduct, usedInRituals: updated });
                            }}
                            className="rounded text-brass-600 focus:ring-brass-500"
                          />
                          <span className="truncate">{r.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-sandalwood-200">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2.5 rounded-xl border border-sandalwood-300 text-temple-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold shadow-temple flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4 text-brass-400" />
                    <span>Save Product SKU</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
