'use client';

import React from 'react';
import { MatchingItemInput, WasteCategory } from '@/types';
import { Trash2, AlertCircle } from 'lucide-react';
import { CustomSelect } from '@/components/ui/CustomSelect';

interface WasteItemInputProps {
  index: number;
  item: MatchingItemInput;
  categories: WasteCategory[];
  onChange: (index: number, updated: MatchingItemInput) => void;
  onRemove: (index: number) => void;
  disableRemove?: boolean;
}

export const WasteItemInputRow: React.FC<WasteItemInputProps> = ({
  index,
  item,
  categories,
  onChange,
  onRemove,
  disableRemove = false,
}) => {
  const selectedCat = categories.find((c) => c.id === item.categoryId);

  return (
    <div className="card-surface rounded-xl p-4 sm:p-5 relative transition-all hover:border-slate-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
            {index + 1}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {selectedCat ? selectedCat.name : `Pilih Material Sampah`}
          </span>
        </div>

        {!disableRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 transition px-2 py-1 rounded hover:bg-rose-50"
            title="Hapus baris ini"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hapus</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start">
        {/* Category Selection */}
        <div className="sm:col-span-5">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 h-5 flex items-center">
            <span>Jenis Material Daur Ulang</span>
            <span className="text-rose-500 ml-0.5">*</span>
          </label>
          <CustomSelect
            value={item.categoryId}
            categories={categories}
            onChange={(newCatId) => {
              const cat = categories.find((c) => c.id === newCatId);
              onChange(index, {
                ...item,
                categoryId: newCatId,
                unit: cat ? cat.unit : item.unit,
              });
            }}
          />
        </div>

        {/* Quantity and Unit Input */}
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 h-5 flex items-center">
            <span>Kuantitas</span>
            <span className="text-rose-500 ml-0.5">*</span>
          </label>
          <div className="flex h-11 w-full rounded-xl shadow-xs">
            <input
              type="number"
              min="0.1"
              step="0.5"
              value={item.quantity || ''}
              onChange={(e) =>
                onChange(index, { ...item, quantity: parseFloat(e.target.value) || 0 })
              }
              placeholder="0.0"
              className="w-full h-11 rounded-l-xl border border-slate-300 px-3.5 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition tabular-nums"
            />
            <span className="inline-flex h-11 items-center rounded-r-xl border border-l-0 border-slate-300 bg-slate-100 px-3.5 text-xs text-slate-700 font-bold uppercase shrink-0">
              {selectedCat?.unit || item.unit || 'kg'}
            </span>
          </div>
        </div>

        {/* Quality note / condition */}
        <div className="sm:col-span-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 h-5 flex items-center truncate">
            Catatan Kondisi Mutu (Opsional)
          </label>
          <input
            type="text"
            value={item.condition || ''}
            onChange={(e) => onChange(index, { ...item, condition: e.target.value })}
            placeholder="Contoh: Bersih, kering, sudah dipilah"
            className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-xs"
          />
        </div>
      </div>
    </div>
  );
};
