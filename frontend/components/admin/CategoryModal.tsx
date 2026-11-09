'use client';

import React, { useState, useEffect } from 'react';
import { AdminCategoryItem } from '@/hooks/admin/useAdminCategories';
import { X, Save, Boxes } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: AdminCategoryItem | null;
  onSave: (data: Partial<AdminCategoryItem>) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [description, setDescription] = useState('');
  const [minPrice, setMinPrice] = useState<number>(1000);
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setUnit(category.unit);
      setDescription(category.description || '');
      setMinPrice(category.minPrice);
      setMaxPrice(category.maxPrice);
    } else {
      setName('');
      setUnit('kg');
      setDescription('');
      setMinPrice(1000);
      setMaxPrice(5000);
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama kategori wajib diisi.');
      return;
    }
    if (minPrice <= 0 || maxPrice <= minPrice) {
      alert('Rentang harga tidak valid: Harga maksimal harus lebih tinggi dari harga minimal.');
      return;
    }

    onSave({
      name,
      unit,
      description,
      minPrice,
      maxPrice,
      averagePrice: Math.round((minPrice + maxPrice) / 2),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-lg card-elevated rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {category ? 'Edit Kategori Master' : 'Tambah Kategori Master Baru'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Standardisasi material daur ulang untuk seluruh mitra RecyNect.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Nama Material Sampah <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Botol Kaca Bening / Sirup"
              className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Satuan Baku <span className="text-rose-500">*</span>
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-semibold"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="liter">Liter (L)</option>
                <option value="pcs">Pcs / Buah</option>
                <option value="ton">Ton</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Rata-Rata Acuan
              </label>
              <div className="h-11 px-3.5 flex items-center rounded-xl bg-slate-50 border border-slate-200 text-sm font-extrabold text-emerald-700 tabular-nums">
                Rp {Math.round((minPrice + maxPrice) / 2).toLocaleString('id-ID')} /{unit}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Harga Min Acuan (Rp)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={minPrice}
                onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs tabular-nums font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Harga Max Acuan (Rp)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs tabular-nums font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Deskripsi & Syarat Mutu Acuan
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Kaca utuh tanpa pecah, bersih dari label dan tutup plastik."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Kategori</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

