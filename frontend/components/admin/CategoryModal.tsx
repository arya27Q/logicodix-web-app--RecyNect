'use client';

import React, { useState, useEffect } from 'react';
import type { AdminCategoryItem } from '@/hooks/admin/useAdminCategories';
import { X, Save, Boxes, AlertCircle } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: AdminCategoryItem | null;
  isSaving?: boolean;
  serverError?: string | null;
  onSave: (data: {
    name: string;
    unit: string;
    description?: string;
    isActive: boolean;
  }) => void | Promise<void>;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  isSaving = false,
  serverError = null,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <CategoryModalDialog
      key={category?.id || 'new'}
      category={category}
      isSaving={isSaving}
      serverError={serverError}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

const CategoryModalDialog: React.FC<{
  category: AdminCategoryItem | null;
  isSaving: boolean;
  serverError: string | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    unit: string;
    description?: string;
    isActive: boolean;
  }) => void | Promise<void>;
}> = ({ category, isSaving, serverError, onClose, onSave }) => {
  const [name, setName] = useState(category?.name || '');
  const [unit, setUnit] = useState(category?.unit || 'kg');
  const [description, setDescription] = useState(category?.description || '');
  const [isActive, setIsActive] = useState<boolean>(category?.isActive ?? true);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSaving, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      setValidationError('Nama kategori minimal 2 karakter.');
      return;
    }

    setValidationError(null);
    onSave({
      name: cleanName,
      unit: unit.trim().toLowerCase(),
      description: description.trim(),
      isActive,
    });
  };

  const activeError = validationError || serverError;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={() => {
        if (!isSaving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg card-elevated rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xl"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Boxes className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="category-modal-title" className="font-extrabold text-slate-900 text-base">
                {category ? 'Edit Kategori Master' : 'Tambah Kategori Master Baru'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Standardisasi material dan satuan resmi untuk pencocokan RecyNect.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Tutup dialog kategori"
            className="min-w-[44px] min-h-[44px] p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center justify-center"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" aria-hidden="true" />
              <span>{activeError}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="category-name-input"
              className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
            >
              Nama Material Sampah <span className="text-rose-600">*</span>
            </label>
            <input
              id="category-name-input"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Botol Kaca Bening"
              className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="category-unit-select"
                className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
              >
                Satuan Baku <span className="text-rose-600">*</span>
              </label>
              <select
                id="category-unit-select"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-semibold"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="liter">Liter (liter)</option>
                <option value="pcs">Pcs / Buah (pcs)</option>
                <option value="ton">Ton (ton)</option>
              </select>
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Status Publikasi
              </span>
              <label
                htmlFor="category-active-checkbox"
                className="h-11 px-3.5 flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 select-none"
              >
                <input
                  id="category-active-checkbox"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <span>{isActive ? 'Aktif di Katalog & Matching' : 'Nonaktif (Disembunyikan)'}</span>
              </label>
            </div>
          </div>

          {category && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-700 block">
                Ringkasan Harga Mitra Saat Ini (Otomatis dari Database)
              </span>
              {category.totalRecyclers > 0 ? (
                <p className="text-slate-700 tabular-nums font-semibold">
                  Rentang Rp {category.minPrice.toLocaleString('id-ID')} - Rp{' '}
                  {category.maxPrice.toLocaleString('id-ID')} /{category.unit} (rata-rata Rp{' '}
                  {category.averagePrice.toLocaleString('id-ID')}) dari {category.totalRecyclers}{' '}
                  mitra aktif.
                </p>
              ) : (
                <p className="text-slate-600">
                  Belum ada mitra pengelola aktif yang menetapkan harga untuk kategori ini.
                </p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="category-description-input"
              className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
            >
              Deskripsi & Panduan Pemilahan
            </label>
            <textarea
              id="category-description-input"
              rows={3}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Botol air mineral transparan tanpa label dan tutup, dibilas bersih."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition disabled:opacity-60"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Kategori'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
