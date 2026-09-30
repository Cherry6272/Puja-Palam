'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { dataStore } from '@/lib/dataStore';
import { Festival } from '@/types';
import { Calendar, Edit3, Save, Sparkles, MapPin, X } from 'lucide-react';

export default function AdminFestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);

  const loadFestivals = () => {
    setFestivals(dataStore.getFestivals());
  };

  useEffect(() => {
    loadFestivals();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFestival) return;
    dataStore.updateFestival(editingFestival);
    setEditingFestival(null);
    loadFestivals();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
            South Indian Festivals &amp; Seasonal Calendar
          </h1>
          <p className="text-xs text-temple-600 mt-1">
            Manage seasonal festival showcase dates, regional tradition notes, and featured procurement kits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {festivals.map((fest) => (
            <div key={fest.id} className="bg-white rounded-3xl border border-sandalwood-200 shadow-subtle p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brass-800 bg-brass-100 px-2 py-0.5 rounded">
                    {fest.season}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingFestival({ ...fest })}
                    className="p-1 rounded text-temple-400 hover:text-brass-700"
                    title="Edit Festival Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-serif-title text-lg font-bold text-temple-900">
                  {fest.name}
                </h3>
                <p className="text-xs text-vermillion-800 font-semibold">{fest.sanskritName}</p>
                <p className="text-xs text-temple-600 leading-relaxed line-clamp-2">
                  {fest.description}
                </p>

                <div className="pt-2 flex items-center space-x-2 text-xs text-temple-700 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-brass-600" />
                  <span>Configured Date: {fest.upcomingDate}</span>
                </div>

                {/* Regions */}
                <div className="flex flex-wrap gap-1 pt-1 text-[10px]">
                  {fest.regions.map((reg) => (
                    <span key={reg} className="px-2 py-0.5 rounded-full bg-sandalwood-100 text-temple-700 font-medium capitalize">
                      {reg.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-sandalwood-200 flex items-center justify-between text-[11px] text-temple-500">
                <span>{fest.culturalTraditionNotes.length} Regional Traditions Noted</span>
                <span className="font-semibold text-brass-800">
                  {fest.featuredRituals.length} Associated Rituals
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingFestival && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-temple-950/70 backdrop-blur-sm">
            <div className="bg-white rounded-3xl border border-brass-400/50 shadow-2xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-sandalwood-200 pb-3">
                <h3 className="font-serif-title text-xl font-bold text-temple-900">
                  Edit Festival: {editingFestival.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingFestival(null)}
                  className="p-1 rounded text-temple-400 hover:text-temple-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block font-bold text-temple-700 mb-1">Upcoming Auspicious Date</label>
                  <input
                    type="text"
                    required
                    value={editingFestival.upcomingDate}
                    onChange={(e) => setEditingFestival({ ...editingFestival, upcomingDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-temple-700 mb-1">Season / Masa Context</label>
                  <input
                    type="text"
                    required
                    value={editingFestival.season}
                    onChange={(e) => setEditingFestival({ ...editingFestival, season: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-temple-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    required
                    value={editingFestival.tagline}
                    onChange={(e) => setEditingFestival({ ...editingFestival, tagline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-temple-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editingFestival.description}
                    onChange={(e) => setEditingFestival({ ...editingFestival, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-temple-700 mb-1">Hero Image URL</label>
                    <input
                      type="text"
                      required
                      value={editingFestival.heroImage}
                      onChange={(e) => setEditingFestival({ ...editingFestival, heroImage: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-temple-700 mb-1">Gallery URLs (comma separated)</label>
                    <input
                      type="text"
                      value={editingFestival.gallery?.join(', ') || ''}
                      onChange={(e) => setEditingFestival({ ...editingFestival, gallery: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="w-full p-2.5 rounded-xl border border-sandalwood-300 text-temple-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-sandalwood-200">
                  <button
                    type="button"
                    onClick={() => setEditingFestival(null)}
                    className="px-4 py-2 rounded-xl border border-sandalwood-300 text-temple-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-temple-900 text-sandalwood-50 font-bold shadow-temple flex items-center space-x-1"
                  >
                    <Save className="w-3.5 h-3.5 text-brass-400" />
                    <span>Save Festival Details</span>
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
