'use client';

import React from 'react';
import { MatchingPriority } from '@/types';
import { PRIORITY_OPTIONS } from '@/lib/constants';

interface PrioritySelectorProps {
  value: MatchingPriority;
  onChange: (priority: MatchingPriority) => void;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-800">
        Pilih Prioritas Pencarian
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PRIORITY_OPTIONS.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`cursor-pointer rounded-lg border p-4 transition ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold text-sm ${isSelected ? 'text-emerald-900' : 'text-slate-900'}`}>
                  {opt.label}
                </span>
                <input
                  type="radio"
                  name="priority"
                  checked={isSelected}
                  onChange={() => onChange(opt.id)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
              </div>
              <p className="text-xs text-slate-600 mb-2">{opt.description}</p>
              <span className="inline-block text-[11px] font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                {opt.weights}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

