'use client';

import React from 'react';
import { AdminCategoryItem } from '@/hooks/admin/useAdminCategories';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Boxes,
  TrendingUp,
} from 'lucide-react';

interface CategoryTableProps {
  categories: AdminCategoryItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterActive: 'all' | 'active' | 'inactive';
  onFilterChange: (f: 'all' | 'active' | 'inactive') => void;
  onOpenCreate: () => void;
  onOpenEdit: (cat: AdminCategoryItem) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  searchQuery,
  onSearchChange,
  filterActive,
  onFilterChange,
  onOpenCreate,
  onOpenEdit,
  onToggleActive,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Filter and Add Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kategori master..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs"
            />
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => onFilterChange('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterActive === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('active')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterActive === 'active'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aktif
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('inactive')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterActive === 'inactive'
                  ? 'bg-white text-slate-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nonaktif
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="card-surface rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama & Deskripsi Material</th>
                <th className="py-3 px-4 text-center">Satuan Baku</th>
                <th className="py-3 px-4 text-right">Rentang Harga Pasar</th>
                <th className="py-3 px-4 text-right">Rata-rata Acuan</th>
                <th className="py-3 px-4 text-center">Mitra Pengelola</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-bold text-slate-900 text-sm">{cat.name}</p>
                    {cat.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                        {cat.description}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold uppercase font-mono">
                      {cat.unit}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-700 font-semibold">
                    Rp {cat.minPrice.toLocaleString('id-ID')} - {cat.maxPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums">
                    <span className="font-extrabold text-emerald-700 text-sm">
                      Rp {cat.averagePrice.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center tabular-nums text-slate-700">
                    <span className="inline-flex items-center gap-1 font-bold">
                      <Boxes className="w-3.5 h-3.5 text-slate-400" />
                      {cat.totalRecyclers} Mitra
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleActive(cat.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition shadow-2xs ${
                        cat.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {cat.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Aktif</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-slate-400" />
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
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                        title="Edit data kategori"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(cat.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus kategori master"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada kategori sampah yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

