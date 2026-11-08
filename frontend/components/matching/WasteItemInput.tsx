'use client';

import React from 'react';
import { MatchingItemInput, WasteCategory } from '@/types';

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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="w-full sm:flex-1">
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Jenis Sampah #{index + 1}
        </label>
        <select
          value={item.categoryId}
          onChange={(e) => {
            const cat = categories.find((c) => c.id === e.target.value);
            onChange(index, {
              ...item,
              categoryId: e.target.value,
              unit: cat ? cat.unit : item.unit,
            });
          }}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="">-- Pilih Jenis Material --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.unit})
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-36">
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Kuantitas
        </label>
        <div className="flex rounded-md shadow-sm">
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={item.quantity || ''}
            onChange={(e) =>
              onChange(index, { ...item, quantity: parseFloat(e.target.value) || 0 })
            }
            placeholder="0"
            className="w-full rounded-l-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <span className="inline-flex items-center rounded-r-md border border-l-0 border-slate-300 bg-slate-100 px-3 text-xs text-slate-600 font-semibold">
            {selectedCat?.unit || item.unit || '-'}
          </span>
        </div>
      </div>

      <div className="w-full sm:flex-1">
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Kondisi / Catatan (opsional)
        </label>
        <input
          type="text"
          value={item.condition || ''}
          onChange={(e) => onChange(index, { ...item, condition: e.target.value })}
          placeholder="Contoh: Bersih, kering, sudah dipipihkan"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {!disableRemove && (
        <div className="sm:self-end sm:mb-1">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-slate-400 hover:text-rose-500 p-2 transition"
            title="Hapus baris"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

