'use client';

import React, { useState, useEffect } from 'react';
import { RecyclerMaterial, WasteCategoryOption } from '@/hooks/recycler/useRecyclerMaterials';
import { X, Save, Package, Loader2 } from 'lucide-react';

interface RecyclerMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: RecyclerMaterial | null;
  onSave: (data: Partial<RecyclerMaterial>) => Promise<void> | void;
  categories?: WasteCategoryOption[];
  isSaving?: boolean;
}

export const RecyclerMaterialModal: React.FC<RecyclerMaterialModalProps> = ({
  isOpen,
  onClose,
  material,
  onSave,
  categories = [],
  isSaving = false,
}) => {
  if (!isOpen) return null;

  return (
    <RecyclerMaterialDialog
      key={material?.id || 'new'}
      material={material}
      onClose={onClose}
      onSave={onSave}
      categories={categories}
      isSaving={isSaving}
    />
  );
};

const RecyclerMaterialDialog: React.FC<{
  material: RecyclerMaterial | null;
  onClose: () => void;
  onSave: (data: Partial<RecyclerMaterial>) => Promise<void> | void;
  categories: WasteCategoryOption[];
  isSaving: boolean;
}> = ({ material, onClose, onSave, categories, isSaving }) => {
  const defaultCategory = categories.length > 0 ? categories[0] : null;

  const [categoryId, setCategoryId] = useState<string>(
    material?.categoryId || (defaultCategory ? defaultCategory.id : 'cat-kardus')
  );
  const [name, setName] = useState<string>(
    material?.name || (defaultCategory ? defaultCategory.name : '')
  );
  const [category, setCategory] = useState<string>(
    material?.category || (defaultCategory ? defaultCategory.name : 'Kertas & Karton')
  );
  const [unit, setUnit] = useState<string>(
    material?.unit || (defaultCategory ? defaultCategory.unit : 'kg')
  );
  const [pricePerUnit, setPricePerUnit] = useState<number>(material?.pricePerUnit ?? 2000);
  const [minQuantity, setMinQuantity] = useState<number>(material?.minQuantity ?? 5);
  const [qualityRequirements, setQualityRequirements] = useState<string>(
    material?.qualityRequirements || ''
  );

  // Jika user memilih kategori baru di dropdown, otomatis sinkronkan nama dan unit default
  const handleCategoryChange = (selectedId: string) => {
    setCategoryId(selectedId);
    const found = categories.find((c) => c.id === selectedId);
    if (found) {
      setCategory(found.name);
      if (!material) {
        setName(found.name);
        setUnit(found.unit);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama material wajib diisi.');
      return;
    }
    if (pricePerUnit <= 0) {
      alert('Harga beli per satuan harus lebih dari Rp 0.');
      return;
    }

    await onSave({
      categoryId,
      name,
      category,
      unit,
      pricePerUnit,
      minQuantity,
      qualityRequirements,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-lg card-elevated rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {material ? 'Edit Ketentuan Material' : 'Buka Penerimaan Material Baru'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Atur harga beli per satuan unit dan syarat penerimaan gudang Anda.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Pilih Kategori Master */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Kategori Sampah Master <span className="text-rose-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={isSaving}
              className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-semibold text-slate-900 disabled:bg-slate-50"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Nama Tampilan Material */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Nama Material / Spesifikasi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
              placeholder="Contoh: Kardus / Karton Cokelat Tebal"
              className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900 disabled:bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Harga Beli ke Warga (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(parseInt(e.target.value) || 0)}
                disabled={isSaving}
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs tabular-nums font-bold text-emerald-800 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Satuan Ukuran <span className="text-rose-500">*</span>
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                disabled={isSaving}
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-semibold text-slate-900 disabled:bg-slate-50"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="liter">Liter (L)</option>
                <option value="pcs">Pcs / Buah</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Batas Minimum Setoran ({unit}) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0.1"
              step="0.5"
              required
              value={minQuantity}
              onChange={(e) => setMinQuantity(parseFloat(e.target.value) || 0)}
              disabled={isSaving}
              className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs tabular-nums font-semibold text-slate-800 disabled:bg-slate-50"
            />
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Warga dengan kuantitas di bawah batas ini tidak akan diarahkan ke gudang Anda.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Syarat Mutu & Kualitas Fisik
            </label>
            <textarea
              rows={2}
              value={qualityRequirements}
              onChange={(e) => setQualityRequirements(e.target.value)}
              disabled={isSaving}
              placeholder="Contoh: Kering, bersih dari minyak, staples tebal dilepas..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-800 disabled:bg-slate-50 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition active:scale-[0.99] disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99] disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{material ? 'Simpan Perubahan' : 'Tambahkan ke Gudang'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
