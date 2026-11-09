'use client';

import React, { useState } from 'react';
import { RecyclerMaterial } from '@/hooks/recycler/useRecyclerMaterials';
import { X, Save, Package } from 'lucide-react';

interface RecyclerMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: RecyclerMaterial | null;
  onSave: (data: Partial<RecyclerMaterial>) => void;
}

export const RecyclerMaterialModal: React.FC<RecyclerMaterialModalProps> = ({
  isOpen,
  onClose,
  material,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <RecyclerMaterialDialog
      key={material?.id || 'new'}
      material={material}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

const RecyclerMaterialDialog: React.FC<{
  material: RecyclerMaterial | null;
  onClose: () => void;
  onSave: (data: Partial<RecyclerMaterial>) => void;
}> = ({ material, onClose, onSave }) => {
  const [name, setName] = useState(material?.name || '');
  const [category, setCategory] = useState(material?.category || 'Kertas & Karton');
  const [unit, setUnit] = useState(material?.unit || 'kg');
  const [pricePerUnit, setPricePerUnit] = useState<number>(material?.pricePerUnit ?? 2000);
  const [minQuantity, setMinQuantity] = useState<number>(material?.minQuantity ?? 5);
  const [qualityRequirements, setQualityRequirements] = useState(material?.qualityRequirements || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama material wajib diisi.');
      return;
    }
    if (pricePerUnit <= 0) {
      alert('Harga beli per satuan harus lebih dari Rp 0.');
      return;
    }

    onSave({
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-semibold text-slate-900"
              >
                <option value="Kertas & Karton">Kertas & Karton</option>
                <option value="Plastik">Plastik</option>
                <option value="Minyak & Organik">Minyak & Organik</option>
                <option value="Logam">Logam & Besi</option>
                <option value="Kaca">Kaca</option>
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
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Ketentuan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

