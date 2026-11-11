'use client';

import React, { useState } from 'react';
import { RecyclerMaterial } from '@/hooks/recycler/useRecyclerMaterials';
import { X, Save, Package, AlertCircle } from 'lucide-react';

interface RecyclerMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: RecyclerMaterial | null;
  onSave: (data: Partial<RecyclerMaterial>) => Promise<void> | void;
  categories?: { id: string; name: string; unit: string }[];
}

export const RecyclerMaterialModal: React.FC<RecyclerMaterialModalProps> = ({
  isOpen,
  onClose,
  material,
  onSave,
  categories,
}) => {
  if (!isOpen) return null;

  return (
    <RecyclerMaterialDialog
      key={material?.id || 'new'}
      material={material}
      onClose={onClose}
      onSave={onSave}
      categories={categories}
    />
  );
};

const RecyclerMaterialDialog: React.FC<{
  material: RecyclerMaterial | null;
  onClose: () => void;
  onSave: (data: Partial<RecyclerMaterial>) => Promise<void> | void;
  categories?: { id: string; name: string; unit: string }[];
}> = ({ material, onClose, onSave, categories }) => {
  const initialCat = material?.category || (categories && categories.length > 0 ? categories[0].name : 'Kardus / Karton Cokelat');
  const [name, setName] = useState(material?.name || '');
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [unit, setUnit] = useState(material?.unit || (categories && categories.length > 0 ? categories[0].unit : 'kg'));
  const [pricePerUnit, setPricePerUnit] = useState<number>(material?.pricePerUnit ?? 2500);
  const [minQuantity, setMinQuantity] = useState<number>(material?.minQuantity ?? 5);
  const [qualityRequirements, setQualityRequirements] = useState(material?.qualityRequirements || '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategorySelect = (val: string) => {
    setValidationError(null);
    if (val === '__custom__') {
      setIsCustomCategory(true);
      return;
    }
    setIsCustomCategory(false);
    setSelectedCategory(val);
    const matched = categories?.find((c) => c.name === val);
    if (matched) {
      setUnit(matched.unit);
      if (!material) {
        setName(matched.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    const finalName = name.trim();
    if (!finalName) {
      setValidationError('Nama material wajib diisi.');
      return;
    }
    if (pricePerUnit <= 0) {
      setValidationError('Harga beli per satuan harus lebih dari Rp 0.');
      return;
    }

    const finalCategory = isCustomCategory ? (customCategoryName.trim() || finalName) : selectedCategory;
    const matched = categories?.find((c) => c.name === finalCategory);

    setIsSubmitting(true);
    try {
      await onSave({
        name: finalName,
        category: finalCategory,
        categoryId: matched?.id || material?.categoryId,
        unit,
        pricePerUnit,
        minQuantity,
        qualityRequirements,
      });
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Gagal menyimpan material.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-lg card-elevated rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {material ? 'Edit Ketentuan Material' : 'Buka Penerimaan Material Baru'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Atur harga beli per kg/liter dan syarat penerimaan gudang Anda.
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
          {validationError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Nama Material <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kardus / Karton Cokelat Tebal"
              className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Kategori <span className="text-rose-500">*</span>
              </label>
              <select
                value={isCustomCategory ? '__custom__' : selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-semibold text-slate-900"
              >
                {categories && categories.length > 0 ? (
                  <>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="__custom__">+ Kategori Kustom Baru...</option>
                  </>
                ) : (
                  <>
                    <option value="Kardus / Karton Cokelat">Kardus / Karton Cokelat</option>
                    <option value="Botol Plastik PET Bening">Botol Plastik PET Bening</option>
                    <option value="Minyak Jelantah">Minyak Jelantah</option>
                    <option value="Kaleng Minuman Aluminium">Kaleng Minuman Aluminium</option>
                    <option value="Besi Tua & Scrap Baja">Besi Tua & Scrap Baja</option>
                    <option value="Kertas HVS & Arsip">Kertas HVS & Arsip</option>
                    <option value="Kaca & Botol Kaca">Kaca & Botol Kaca</option>
                    <option value="__custom__">+ Kategori Kustom Baru...</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Satuan Ukuran <span className="text-rose-500">*</span>
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-semibold text-slate-900"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="liter">Liter (L)</option>
                <option value="pcs">Pcs / Buah</option>
              </select>
            </div>
          </div>

          {isCustomCategory && (
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
              <label className="block text-xs font-bold text-amber-900 mb-1">
                Nama Kategori Kustom Baru <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required={isCustomCategory}
                value={customCategoryName}
                onChange={(e) => setCustomCategoryName(e.target.value)}
                placeholder="Contoh: Limbah Elektronik (E-Waste)"
                className="w-full h-10 px-3 text-xs rounded-xl border border-amber-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-medium"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Harga Beli ke Warga (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="100"
                step="100"
                required
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(parseInt(e.target.value) || 0)}
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs tabular-nums font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Minimum Setoran ({unit}) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                required
                value={minQuantity}
                onChange={(e) => setMinQuantity(parseFloat(e.target.value) || 1)}
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs tabular-nums font-semibold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Syarat Mutu Fisik
            </label>
            <textarea
              rows={3}
              value={qualityRequirements}
              onChange={(e) => setQualityRequirements(e.target.value)}
              placeholder="Contoh: Kering, bersih dari staples kawat tebal, diikat rapi."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs leading-relaxed"
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
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Ketentuan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

