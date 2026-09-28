'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { dataStore } from '@/lib/dataStore';
import { Ritual, RitualItem } from '@/types';
import { 
  Compass, 
  Search, 
  Clock, 
  Layers, 
  Edit3, 
  Plus, 
  Check, 
  X, 
  Save,
  Trash2,
  Calendar
} from 'lucide-react';

export default function AdminRitualsPage() {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [isEditingRequirements, setIsEditingRequirements] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('piece');
  const [newItemBox, setNewItemBox] = useState<1 | 2 | 3 | 4>(2);
  const [newItemEssential, setNewItemEssential] = useState(true);
  const [newItemPrice, setNewItemPrice] = useState(150);

  const loadRituals = () => {
    const list = dataStore.getRituals();
    setRituals(list);
    if (list.length > 0 && !selectedRitual) {
      setSelectedRitual(list[0]);
    }
  };

  useEffect(() => {
    loadRituals();
  }, []);

  const handleRemoveItem = (itemId: string) => {
    if (!selectedRitual) return;
    const updated = {
      ...selectedRitual,
      baseRequiredItems: selectedRitual.baseRequiredItems.filter((i) => i.id !== itemId),
    };
    dataStore.updateRitual(updated);
    setSelectedRitual(updated);
    loadRituals();
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRitual || !newItemName.trim()) return;

    const newItem: RitualItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      category: 'Sacred Powders & Pastes',
      quantity: newItemQty,
      unit: newItemUnit,
      purpose: 'Vedic consecration and offering',
      boxNumber: newItemBox,
      isEssential: newItemEssential,
      estimatedPrice: newItemPrice,
    };

    const updated = {
      ...selectedRitual,
      baseRequiredItems: [...selectedRitual.baseRequiredItems, newItem],
    };

    dataStore.updateRitual(updated);
    setSelectedRitual(updated);
    loadRituals();

    setNewItemName('');
    setNewItemQty(1);
    setNewItemPrice(150);
  };

  const filteredRituals = rituals.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
              Rituals &amp; Requirement Engine
            </h1>
            <p className="text-xs text-temple-600 mt-1">
              Configure canonical Vedic rituals, regional traditions, and 4-box requirement manifests.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-sandalwood-200 shadow-subtle flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-temple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Rituals by Name or Deity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-sandalwood-50 border border-sandalwood-300 text-xs text-temple-900 focus:outline-none focus:ring-2 focus:ring-brass-500"
            />
          </div>
        </div>

        {/* Split view: Rituals list & Requirement Manifest */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List Col */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-sandalwood-200 shadow-subtle overflow-hidden">
            <div className="p-4 bg-temple-900 text-sandalwood-100 border-b border-temple-800">
              <span className="font-serif-title text-sm font-bold">
                Canonical Rituals ({filteredRituals.length})
              </span>
            </div>

            <div className="divide-y divide-sandalwood-100 max-h-[700px] overflow-y-auto">
              {filteredRituals.map((ritual) => {
                const isSelected = selectedRitual?.id === ritual.id;
                return (
                  <div
                    key={ritual.id}
                    onClick={() => setSelectedRitual(ritual)}
                    className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                      isSelected ? 'bg-brass-50/70 border-l-4 border-brass-600' : 'hover:bg-sandalwood-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brass-100 text-brass-800">
                        {ritual.category}
                      </span>
                      <span className="text-[11px] text-temple-500 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-brass-600" />
                        <span>{ritual.typicalDuration}</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-temple-900">{ritual.name}</h3>
                    <p className="text-xs text-brass-700 italic">{ritual.sanskritName}</p>
                    <p className="text-[11px] text-temple-500">
                      Deity: {ritual.deity} • {ritual.baseRequiredItems.length} Required Items
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requirement Manifest & Detail Col */}
          {selectedRitual && (
            <div className="lg:col-span-8 bg-white rounded-3xl border border-sandalwood-200 shadow-subtle p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-sandalwood-200 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brass-800 bg-brass-100 px-2.5 py-0.5 rounded">
                      {selectedRitual.category}
                    </span>
                    <span className="text-xs text-temple-500">Canon: {selectedRitual.deity}</span>
                  </div>
                  <h2 className="font-serif-title text-2xl font-bold text-temple-900">
                    {selectedRitual.name}
                  </h2>
                  <p className="text-xs text-temple-600 leading-relaxed max-w-xl">
                    {selectedRitual.tagline}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-temple-400">Kit Pricing</span>
                  <p className="font-serif-title text-lg font-bold text-temple-900">
                    ₹{selectedRitual.tiers.essential.price} – ₹{selectedRitual.tiers.premium.price}
                  </p>
                  <span className="text-[11px] text-temple-500 block">
                    {selectedRitual.traditions.length} Regional Variations Supported
                  </span>
                </div>
              </div>

              {/* Requirement Manifest Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-title text-base font-bold text-temple-900">
                    4-Box Requirement Manifest ({selectedRitual.baseRequiredItems.length} Items)
                  </h3>
                  <span className="text-xs text-temple-500">Live Requirement List</span>
                </div>

                <div className="overflow-x-auto border border-sandalwood-200 rounded-2xl">
                  <table className="w-full text-left text-xs text-temple-800">
                    <thead>
                      <tr className="bg-sandalwood-50 text-[10px] uppercase tracking-wider text-temple-500 border-b border-sandalwood-200">
                        <th className="p-3 font-bold">Box</th>
                        <th className="p-3 font-bold">Item Name</th>
                        <th className="p-3 font-bold">Quantity</th>
                        <th className="p-3 font-bold">Category</th>
                        <th className="p-3 font-bold">Priority</th>
                        <th className="p-3 font-bold">Est. Price</th>
                        <th className="p-3 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandalwood-100">
                      {selectedRitual.baseRequiredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-sandalwood-50/50">
                          <td className="p-3 font-bold text-brass-700">Box 0{item.boxNumber}</td>
                          <td className="p-3">
                            <p className="font-bold text-temple-900">{item.name}</p>
                            <p className="text-[10px] text-temple-500 truncate max-w-xs">{item.purpose}</p>
                          </td>
                          <td className="p-3 font-semibold">{item.quantity} {item.unit}</td>
                          <td className="p-3 text-temple-600">{item.category}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.isEssential ? 'bg-tulsi-100 text-tulsi-800' : 'bg-sandalwood-200 text-temple-700'
                            }`}>
                              {item.isEssential ? 'Essential' : 'Optional'}
                            </span>
                          </td>
                          <td className="p-3 font-bold">₹{item.estimatedPrice}</td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-temple-400 hover:text-vermillion-600 p-1"
                              title="Remove item from manifest"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Quick Add Item Form */}
                <form onSubmit={handleAddItem} className="p-4 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 space-y-3">
                  <span className="text-xs font-bold text-temple-900 block">
                    + Add New Requirement to {selectedRitual.name} Manifest
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Item Name (e.g. Navaratna Consecration Kit)..."
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border border-sandalwood-300 bg-white text-temple-900"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={newItemQty}
                        onChange={(e) => setNewItemQty(Number(e.target.value))}
                        required
                        className="w-full p-2.5 rounded-xl border border-sandalwood-300 bg-white text-temple-900"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Unit (e.g. pack, pieces)"
                        value={newItemUnit}
                        onChange={(e) => setNewItemUnit(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border border-sandalwood-300 bg-white text-temple-900"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-3">
                      <select
                        value={newItemBox}
                        onChange={(e) => setNewItemBox(Number(e.target.value) as 1 | 2 | 3 | 4)}
                        className="p-2 rounded-xl border border-sandalwood-300 bg-white font-bold text-temple-900"
                      >
                        <option value={1}>Box 01 — Preparation</option>
                        <option value={2}>Box 02 — Kalasha</option>
                        <option value={3}>Box 03 — Offerings</option>
                        <option value={4}>Box 04 — Aarti</option>
                      </select>

                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(Number(e.target.value))}
                        className="w-24 p-2 rounded-xl border border-sandalwood-300 bg-white text-temple-900"
                      />

                      <label className="flex items-center space-x-1.5 cursor-pointer text-temple-700 font-semibold">
                        <input
                          type="checkbox"
                          checked={newItemEssential}
                          onChange={(e) => setNewItemEssential(e.target.checked)}
                          className="rounded text-brass-600 focus:ring-brass-500"
                        />
                        <span>Essential Consumable</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold shadow-temple flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-brass-400" />
                      <span>Append Item</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
