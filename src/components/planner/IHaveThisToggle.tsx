'use client';

import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

interface Props {
  itemId: string;
  itemName: string;
  isOwned: boolean;
  price: number;
  onToggle: (itemId: string) => void;
}

export const IHaveThisToggle: React.FC<Props> = ({
  itemId,
  itemName,
  isOwned,
  price,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(itemId)}
      className={`group w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 ${
        isOwned
          ? 'bg-tulsi-50/60 border-tulsi-300/80 shadow-xs'
          : 'bg-white border-sandalwood-200 hover:border-brass-400 shadow-xs'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
            isOwned
              ? 'bg-tulsi-600 border-tulsi-600 text-white'
              : 'border-sandalwood-400 group-hover:border-brass-500'
          }`}
        >
          {isOwned && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </div>
        <div>
          <span
            className={`text-xs font-semibold block transition-colors ${
              isOwned ? 'text-tulsi-900 line-through' : 'text-temple-900'
            }`}
          >
            {itemName}
          </span>
          <span className="text-[11px] text-temple-500">
            {isOwned ? 'Marked as owned at home • Deducted' : `Procure new: ₹${price}`}
          </span>
        </div>
      </div>

      <div className="text-right">
        {isOwned ? (
          <span className="text-[11px] font-bold text-tulsi-700 bg-tulsi-100 px-2 py-0.5 rounded-full">
            -₹{price} Saved
          </span>
        ) : (
          <span className="text-xs font-bold text-temple-800">
            ₹{price}
          </span>
        )}
      </div>
    </button>
  );
};
