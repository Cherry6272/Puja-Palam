'use client';

import React from 'react';
import { RitualSubstitution } from '@/types';
import { X, Check, ArrowRight, ShieldCheck, Info } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  substitution: RitualSubstitution;
  isActive: boolean;
  onApply: (sub: RitualSubstitution) => void;
  onRevert: (sub: RitualSubstitution) => void;
}

export const SmartSubstitutionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  substitution,
  isActive,
  onApply,
  onRevert,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-temple-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-sandalwood-50 rounded-2xl shadow-2xl border border-brass-400/50 overflow-hidden">
        {/* Header */}
        <div className="bg-temple-900 px-6 py-4 flex items-center justify-between text-sandalwood-100 border-b border-brass-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-brass-500/20 border border-brass-400/40 flex items-center justify-center text-brass-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-title text-base font-bold text-sandalwood-50">
                Traditional Smart Substitution
              </h3>
              <p className="text-[11px] text-brass-300">
                Transparent Canonical Guidance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-sandalwood-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 items-center">
            {/* Original Item */}
            <div className="p-3 rounded-xl bg-white border border-sandalwood-300 space-y-1">
              <span className="text-[10px] font-bold text-temple-400 uppercase tracking-wider">
                Original Requirement
              </span>
              <p className="text-xs font-bold text-temple-900">
                {substitution.originalName}
              </p>
            </div>

            {/* Substituted Item */}
            <div className="p-3 rounded-xl bg-brass-50 border border-brass-400 space-y-1">
              <span className="text-[10px] font-bold text-brass-700 uppercase tracking-wider flex items-center space-x-1">
                <Check className="w-3 h-3 text-brass-600" />
                <span>Canonical Substitute</span>
              </span>
              <p className="text-xs font-bold text-temple-900">
                {substitution.substituteName}
              </p>
            </div>
          </div>

          {/* Context & Notes */}
          <div className="p-3.5 rounded-xl bg-white border border-sandalwood-200 text-xs text-temple-700 space-y-2">
            <div className="flex items-center space-x-2 text-temple-900 font-semibold">
              <Info className="w-4 h-4 text-brass-600 flex-shrink-0" />
              <span>Tradition & Seasonal Justification</span>
            </div>
            <p className="text-[11px] text-temple-600 leading-relaxed">
              {substitution.traditionContext}
            </p>
            <p className="text-[11px] text-brass-800 italic bg-brass-50/70 p-2 rounded-lg">
              &quot;{substitution.notes}&quot;
            </p>
          </div>

          {/* Classification Badge */}
          <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-sandalwood-100 border border-sandalwood-200 text-temple-700">
            <span>Classification:</span>
            <span className="font-bold text-temple-900 capitalize">
              {substitution.type.replace('_', ' ')}
            </span>
          </div>

          {/* Price delta */}
          <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-sandalwood-100 border border-sandalwood-200 text-temple-700">
            <span>Price Adjustment:</span>
            <span className={`font-bold ${substitution.priceDifference <= 0 ? 'text-tulsi-700' : 'text-temple-900'}`}>
              {substitution.priceDifference === 0
                ? 'No Price Change'
                : substitution.priceDifference < 0
                ? `-₹${Math.abs(substitution.priceDifference)} (Reduced)`
                : `+₹${substitution.priceDifference}`}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center space-x-3">
            {isActive ? (
              <button
                type="button"
                onClick={() => {
                  onRevert(substitution);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-sandalwood-300 hover:bg-sandalwood-100 text-temple-700 text-xs font-bold"
              >
                Revert to Original Item
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onApply(substitution);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-brass-500 hover:bg-brass-600 text-temple-900 text-xs font-bold shadow-brass"
              >
                Apply Canonical Substitute
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
