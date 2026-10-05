'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { dataStore } from '@/lib/dataStore';
import { Ritual } from '@/types';
import { Layers, Edit3, Check, ShieldCheck, Sparkles, Save } from 'lucide-react';
import { useDataStore } from '@/hooks/useDataStore';

export default function AdminKitsPage() {
  const { rituals: rawRituals, isLoading } = useDataStore();
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [editingTier, setEditingTier] = useState<{
    ritualId: string;
    tierKey: 'essential' | 'complete' | 'premium';
    price: number;
    description: string;
  } | null>(null);

  const loadKits = () => {
    setRituals(dataStore.getRituals());
  };

  useEffect(() => {
    if (!isLoading) {
      setRituals(rawRituals);
    }
  }, [isLoading, rawRituals]);

  const handleSaveTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;

    const ritual = rituals.find((r) => r.id === editingTier.ritualId);
    if (ritual) {
      const updated: Ritual = {
        ...ritual,
        tiers: {
          ...ritual.tiers,
          [editingTier.tierKey]: {
            ...ritual.tiers[editingTier.tierKey],
            price: editingTier.price,
            description: editingTier.description,
          },
        },
      };
      dataStore.updateRitual(updated);
      loadKits();
    }
    setEditingTier(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
            Puja Kits Configuration &amp; Tier Pricing
          </h1>
          <p className="text-xs text-temple-600 mt-1">
            Manage pricing, brassware inclusions, and specifications across Essential, Complete, and Heirloom Royal tiers.
          </p>
        </div>

        <div className="space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-8 h-8 border-4 border-brass-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-temple-600">Loading kit configurations...</p>
            </div>
          ) : rituals.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-sandalwood-300 rounded-2xl bg-white">
              <Layers className="w-12 h-12 text-sandalwood-400 mx-auto mb-3" />
              <h3 className="font-serif-title text-xl font-bold text-temple-900">No Kits Configured</h3>
              <p className="text-sm text-temple-600 mt-1 max-w-md mx-auto">
                Kits are built automatically from Rituals. Please add Canonical Rituals first.
              </p>
            </div>
          ) : rituals.map((ritual) => (
            <div key={ritual.id} className="bg-white rounded-3xl border border-sandalwood-200 shadow-subtle p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sandalwood-200 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brass-100 text-brass-800">
                    {ritual.category}
                  </span>
                  <h2 className="font-serif-title text-xl font-bold text-temple-900 mt-1">
                    {ritual.name} Kits
                  </h2>
                  <p className="text-xs text-temple-500">{ritual.tagline}</p>
                </div>
                <span className="text-xs font-semibold text-brass-700">
                  {ritual.baseRequiredItems.length} Required Items Base
                </span>
              </div>

              {/* Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['essential', 'complete', 'premium'] as const).map((tierKey) => {
                  const tier = ritual.tiers[tierKey];
                  return (
                    <div
                      key={tierKey}
                      className="p-5 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 flex flex-col justify-between space-y-3 relative"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brass-700">
                            {tier.name}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingTier({
                                ritualId: ritual.id,
                                tierKey,
                                price: tier.price,
                                description: tier.description,
                              })
                            }
                            className="text-temple-400 hover:text-brass-700 p-1"
                            title="Edit Tier Price & Description"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="font-serif-title text-2xl font-bold text-temple-900">
                          ₹{tier.price.toLocaleString('en-IN')}
                        </p>

                        <p className="text-xs text-temple-600 leading-relaxed">
                          {tier.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-sandalwood-200 text-[11px] text-temple-600 space-y-1">
                        <p>• {tier.vesselQuality}</p>
                        <p>• Organic Consumables: {tier.organicIngredients ? 'Included' : 'None'}</p>
                        <p>• Brass Vessels: {tier.brassVesselsIncluded ? 'Included' : 'Not Included'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Modal for editing tier */}
        {editingTier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-temple-950/70 backdrop-blur-sm">
            <div className="bg-white rounded-3xl border border-brass-400/50 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-4">
              <h3 className="font-serif-title text-xl font-bold text-temple-900 capitalize">
                Update {editingTier.tierKey} Tier Configuration
              </h3>

              <form onSubmit={handleSaveTier} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-temple-700 mb-1">Kit Tier Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingTier.price}
                    onChange={(e) => setEditingTier({ ...editingTier, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-temple-700 mb-1">Tier Scope Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editingTier.description}
                    onChange={(e) => setEditingTier({ ...editingTier, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-sandalwood-200">
                  <button
                    type="button"
                    onClick={() => setEditingTier(null)}
                    className="px-4 py-2 rounded-xl border border-sandalwood-300 text-temple-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-temple-900 text-sandalwood-50 font-bold shadow-temple flex items-center space-x-1"
                  >
                    <Save className="w-3.5 h-3.5 text-brass-400" />
                    <span>Save Pricing</span>
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
