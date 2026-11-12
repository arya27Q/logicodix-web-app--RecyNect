'use client';

import React, { useEffect } from 'react';
import type { AdminCategoryItem } from '@/hooks/admin/useAdminCategories';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Boxes,
  AlertCircle,
} from 'lucide-react';

interface CategoryTableProps {
  categories: AdminCategoryItem[];
  isLoading?: boolean;
  error?: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterActive: 'all' | 'active' | 'inactive';
  onFilterChange: (f: 'all' | 'active' | 'inactive') => void;
  onOpenCreate: () => void;
  onOpenEdit: (cat: AdminCategoryItem) => void;
  onToggleActive: (id: string) => void;
  onRequestDelete: (cat: AdminCategoryItem) => void;
  onRetry?: () => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  isLoading = false,
  error = null,
  searchQuery,
  onSearchChange,
  filterActive,
  onFilterChange,
  onOpenCreate,
  onOpenEdit,
  onToggleActive,
  onRequestDelete,
  onRetry,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 sm:flex-none">
            <label htmlFor="admin-category-search" className="sr-only">
              Cari kategori master
            </label>
            <Search
              className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="admin-category-search"
              type="text"
              placeholder="Cari nama atau satuan kategori..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-11 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs"
            />
          </div>

          <div
            role="tablist"
            aria-label="Filter status kategori"
            className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold"
          >
            {(
              [
                { id: 'all', label: 'Semua' },
                { id: 'active', label: 'Aktif' },
                { id: 'inactive', label: 'Nonaktif' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filterActive === tab.id}
                onClick={() => onFilterChange(tab.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg transition ${
                  filterActive === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs transition"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800 font-semibold"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" aria-hidden="true" />
            <span>{error}</span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 font-bold transition"
            >
              Coba Lagi
            </button>
          )}
        </div>
      )}

      <div className="card-surface rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama & Deskripsi Material</th>
                <th className="py-3 px-4 text-center">Satuan Baku</th>
                <th className="py-3 px-4 text-right">Rentang Harga Mitra</th>
                <th className="py-3 px-4 text-right">Rata-rata Mitra</th>
                <th className="py-3 px-4 text-center">Mitra Aktif</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-600 text-xs font-semibold">
                    Memuat daftar master kategori sampah dari database...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 px-4 text-center text-slate-600 text-xs">
                    {searchQuery || filterActive !== 'all'
                      ? 'Tidak ada kategori yang sesuai dengan filter pencarian saat ini.'
                      : 'Belum ada kategori master di database. Klik "Tambah Kategori Baru" untuk memulai.'}
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 text-sm">{cat.name}</p>
                      {cat.description ? (
                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 font-normal">
                          {cat.description}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-500 mt-0.5 font-normal italic">
                          Belum ada deskripsi panduan
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold uppercase font-mono">
                        {cat.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-700 font-semibold whitespace-nowrap">
                      {cat.totalRecyclers > 0 ? (
                        cat.minPrice === cat.maxPrice ? (
                          `Rp ${cat.minPrice.toLocaleString('id-ID')}`
                        ) : (
                          `Rp ${cat.minPrice.toLocaleString('id-ID')} - Rp ${cat.maxPrice.toLocaleString('id-ID')}`
                        )
                      ) : (
                        <span className="text-slate-500 font-normal">Belum ada mitra</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums whitespace-nowrap">
                      {cat.totalRecyclers > 0 ? (
                        <span className="font-extrabold text-emerald-800 text-sm">
                          Rp {cat.averagePrice.toLocaleString('id-ID')}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-bold">
                        <Boxes className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                        {cat.totalRecyclers} Mitra
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleActive(cat.id)}
                        className={`min-h-[36px] inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition shadow-2xs ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {cat.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" aria-hidden="true" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-600" aria-hidden="true" />
                            <span>Nonaktif</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenEdit(cat)}
                          aria-label={`Edit kategori ${cat.name}`}
                          className="min-w-[40px] min-h-[40px] p-2 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition flex items-center justify-center"
                          title="Edit data kategori"
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRequestDelete(cat)}
                          aria-label={`Hapus kategori ${cat.name}`}
                          className="min-w-[40px] min-h-[40px] p-2 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition flex items-center justify-center"
                          title="Hapus kategori master"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const CategoryDeleteDialog: React.FC<{
  category: AdminCategoryItem | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ category, isDeleting, onCancel, onConfirm }) => {
  useEffect(() => {
    if (!category) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [category, isDeleting, onCancel]);

  if (!category) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={() => {
        if (!isDeleting) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-cat-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4"
      >
        <h3 id="delete-cat-title" className="text-base font-extrabold text-slate-900">
          Hapus Kategori Master?
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Anda akan menghapus kategori <strong className="text-slate-900">{category.name}</strong>.
          Jika kategori sudah dipakai oleh mitra pengelola atau riwayat pencocokan, sistem akan
          menolak penghapusan permanen agar data tetap konsisten.
        </p>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition disabled:opacity-60"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Kategori'}
          </button>
        </div>
      </div>
    </div>
  );
};
