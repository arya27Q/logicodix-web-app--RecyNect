'use client';

import React, { useState } from 'react';
import { RecyclerMaterial } from '@/hooks/recycler/useRecyclerMaterials';
import { X, Save, Package, AlertCircle, Loader2 } from 'lucide-react';

interface RecyclerMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: RecyclerMaterial | null;
  onSave: (data: Partial<RecyclerMaterial>) => Promise<void> | void;
  categories?: { id: string; name: string; unit: string }[];
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
  categories: { id: string; name: string; unit: string }[];
  isSaving: boolean;
}> = ({ material, onClose, onSave, categories, isSaving }) => {
  const initialCat = material?.category || (categories && categories.length > 0 ? categories[0].name : 'Kardus / Karton Cokelat');
  const [name, setName] = useState(material?.name || '');
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedCategoryId, setSelectedCategoryId] = useState(material?.categoryId || (categories.length > 0 ? categories[0].id : ''));
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [unit, setUnit] = useState(material?.unit || (categories && categories.length > 0 ? categories[0].unit : 'kg'));
  const [pricePerUnit, setPricePerUnit] = useState<number>(material?.pricePerUnit ?? 2500);
  const [minQuantity, setMinQuantity] = useState<number>(material?.minQuantity ?? 5);
  const [qualityRequirements, setQualityRequirements] = useState(material?.qualityRequirements || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCategorySelect = (val: string) => {
    setValidationError(null);
    if (val === '__custom__') {
      setIsCustomCategory(true);
      return;
    }
    setIsCustomCategory(false);
    setSelectedCategory(val);
    const matched = categories?.find((c) => c.name === val || c.id === val);
    if (matched) {
      setSelectedCategoryId(matched.id);
      setSelectedCategory(matched.name);
      setUnit(matched.unit);
      if (!material) {
        setName(matched.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const finalCategoryName = isCustomCategory ? customCategoryName.trim() : selectedCategory;
    const finalName = name.trim() || finalCategoryName;

    if (!finalName) {
      setValidationError('Nama material atau kategori wajib diisi.');
      return;
    }

    if (!pricePerUnit || pricePerUnit <= 0) {
      setValidationError('Harga beli harus lebih besar dari Rp 0.');
      return;
    }

    if (minQuantity < 0) {
      setValidationError('Minimum kuantitas tidak boleh negatif.');
      return;
    }

    await onSave({
      name: finalName,
      category: finalCategoryName,
      categoryId: isCustomCategory ? undefined : selectedCategoryId || undefined,
      pricePerUnit: Number(pricePerUnit),
      unit,
      minQuantity: Number(minQuantity),
      qualityRequirements: qualityRequirements.trim(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="material-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 id="material-modal-title" className="text-base font-extrabold text-slate-900 tracking-tight">
                {material ? 'Edit Ketentuan Material' : 'Buka Penerimaan Material Baru'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {material
                  ? 'Perbarui harga beli, minimal setoran, dan syarat mutu fisik.'
                  : 'Tambahkan jenis sampah daur ulang yang siap diterima gudang Anda.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nama Material / Sampah <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kardus / Karton Box, Minyak Jelantah"
              className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Kategori Sampah <span className="text-rose-500">*</span>
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
                required
                min={100}
                step={50}
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                placeholder="4200"
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Min. Setoran ({unit})
              </label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={minQuantity}
                onChange={(e) => setMinQuantity(Number(e.target.value))}
                placeholder="5"
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Syarat Mutu Fisik (Opsional)
            </label>
            <textarea
              rows={2}
              value={qualityRequirements}
              onChange={(e) => setQualityRequirements(e.target.value)}
              placeholder="Contoh: Bersih dari label dan tutup, tidak berminyak, dipres rapi per 5 kg."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-800"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition"
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
