'use client';

import React from 'react';
import { RecyclerMaterial } from '@/hooks/recycler/useRecyclerMaterials';
import { Search, Plus, CheckCircle2, XCircle, Edit2, Trash2 } from 'lucide-react';

interface MaterialPriceTableProps {
  materials: RecyclerMaterial[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleAccepting: (id: string) => void;
  onOpenCreate?: () => void;
  onOpenEdit?: (mat: RecyclerMaterial) => void;
  onDelete?: (id: string) => void;
}

export const MaterialPriceTable: React.FC<MaterialPriceTableProps> = ({
  materials,
  searchQuery,
  onSearchChange,
  onToggleAccepting,
  onOpenCreate,
  onOpenEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {/* Top filter and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari material atau kategori..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Menampilkan <span className="font-bold text-slate-800">{materials.length}</span> jenis material
          </span>
          {onOpenCreate && (
            <button
              type="button"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Buka Penerimaan Material Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive table */}
      <div className="card-surface rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5 whitespace-nowrap min-w-[180px]">Nama Material</th>
                <th className="py-3.5 px-5 whitespace-nowrap min-w-[130px]">Kategori</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap min-w-[160px]">Harga Beli Gudang</th>
                <th className="py-3.5 px-5 text-center whitespace-nowrap min-w-[120px]">Min. Setoran</th>
                <th className="py-3.5 px-5 min-w-[200px]">Syarat Mutu Fisik</th>
                <th className="py-3.5 px-5 text-center whitespace-nowrap min-w-[140px]">Status Penerimaan</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap min-w-[100px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {materials.map((mat) => (
                <tr key={mat.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-5 font-bold text-slate-900 whitespace-nowrap sm:whitespace-normal">
                    {mat.name}
                  </td>
                  <td className="py-4 px-5 text-slate-600 whitespace-nowrap">
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {mat.category}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <span className="font-extrabold text-emerald-700 text-sm tabular-nums">
                      Rp {mat.pricePerUnit.toLocaleString('id-ID')}
                    </span>
                    <span className="text-slate-400 text-[11px] ml-1 font-semibold">/{mat.unit}</span>
                  </td>
                  <td className="py-4 px-5 text-center text-slate-700 tabular-nums font-semibold whitespace-nowrap">
                    {mat.minQuantity} {mat.unit}
                  </td>
                  <td className="py-4 px-5 text-slate-600 text-[11px] leading-relaxed">
                    {mat.qualityRequirements}
                  </td>
                  <td className="py-4 px-5 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onToggleAccepting(mat.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition shadow-2xs ${
                        mat.isAccepting
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {mat.isAccepting ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Menerima</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Nonaktif</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {onOpenEdit && (
                        <button
                          type="button"
                          onClick={() => onOpenEdit(mat)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition"
                          title="Edit ketentuan harga"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(mat.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus material dari daftar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {materials.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada material daur ulang yang cocok dengan kata kunci pencarian.
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
