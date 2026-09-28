'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Settings, MapPin, ShieldCheck, Check, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [savedNotice, setSavedNotice] = useState(false);
  const [hubs, setHubs] = useState({
    blr: { name: 'Bengaluru Central', address: '12th Main Road, HAL 2nd Stage, Indiranagar', active: true },
    maa: { name: 'Chennai South', address: 'Luz Church Road, Mylapore', active: true },
    hyd: { name: 'Hyderabad Deccan', address: 'RP Road, Secunderabad', active: true },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-temple-900">
            Regional Hubs &amp; Operational Settings
          </h1>
          <p className="text-xs text-temple-600 mt-1">
            Configure fulfillment centers, delivery windows, and sacred material quality certifications.
          </p>
        </div>

        {savedNotice && (
          <div className="p-3.5 rounded-xl bg-tulsi-100 border border-tulsi-300 text-tulsi-800 text-xs flex items-center space-x-2 font-bold">
            <Check className="w-4 h-4 text-tulsi-600" />
            <span>Operational settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Hub Configuration */}
          <div className="bg-white rounded-3xl border border-sandalwood-200 p-6 sm:p-8 shadow-subtle space-y-4">
            <h3 className="font-serif-title text-lg font-bold text-temple-900 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-brass-600" />
              <span>Active Regional Fulfillment Hubs</span>
            </h3>

            <div className="space-y-4">
              {([
                { key: 'blr' as const, city: 'Bengaluru', label: 'Bengaluru Central Hub (KA)' },
                { key: 'maa' as const, city: 'Chennai', label: 'Chennai South Hub (TN)' },
                { key: 'hyd' as const, city: 'Hyderabad', label: 'Hyderabad Deccan Hub (TS & AP)' },
              ]).map((hubItem) => (
                <div key={hubItem.key} className="p-4 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-temple-900">{hubItem.label}</span>
                    <label className="flex items-center space-x-1.5 text-xs text-tulsi-700 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hubs[hubItem.key].active}
                        onChange={(e) =>
                          setHubs({
                            ...hubs,
                            [hubItem.key]: { ...hubs[hubItem.key], active: e.target.checked },
                          })
                        }
                        className="rounded text-brass-600 focus:ring-brass-500"
                      />
                      <span>Active Hub</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={hubs[hubItem.key].address}
                    onChange={(e) =>
                      setHubs({
                        ...hubs,
                        [hubItem.key]: { ...hubs[hubItem.key], address: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-xl border border-sandalwood-300 bg-white text-xs text-temple-800"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sacred Quality Controls */}
          <div className="bg-white rounded-3xl border border-sandalwood-200 p-6 sm:p-8 shadow-subtle space-y-4">
            <h3 className="font-serif-title text-lg font-bold text-temple-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-brass-600" />
              <span>Sacred Packaging Quality Standards</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 space-y-1">
                <p className="font-bold text-temple-900">Fresh Floral JIT Cut-off</p>
                <p className="text-temple-600">Box 03 fresh flowers packed between 5:00 AM – 6:30 AM on ceremony morning.</p>
                <p className="text-tulsi-700 font-semibold pt-1">✓ Automated Dispatch Rule</p>
              </div>

              <div className="p-4 rounded-2xl bg-sandalwood-50 border border-sandalwood-200 space-y-1">
                <p className="font-bold text-temple-900">Purity Verification</p>
                <p className="text-temple-600">Mandatory lab purity check for edible Bhimseni camphor and Gir cow ghee wicks.</p>
                <p className="text-tulsi-700 font-semibold pt-1">✓ 100% Shastra Compliant</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 font-bold text-xs shadow-temple flex items-center space-x-2"
            >
              <Save className="w-4 h-4 text-brass-400" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
