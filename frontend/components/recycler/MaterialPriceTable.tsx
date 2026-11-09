'use client';

import React from 'react';
import { RecyclerMaterial } from '@/hooks/recycler/useRecyclerMaterials';
import { Search, CheckCircle2, XCircle, AlertCircle, Edit2 } from 'lucide-react';

interface MaterialPriceTableProps {
  materials: RecyclerMaterial[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleAccepting: (id: string) => void;
  onUpdatePrice: (id: string, price: number) => void;
}

export const MaterialPriceTable: React.FC<MaterialPriceTableProps> = ({
  materials,
  searchQuery,
  onSearchChange,
  onToggleAccepting,
  onUpdatePrice,
}) => {
  return (
    <div className="space-y-4">
      {/* Table search filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari material atau kategori..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan <span className="font-bold text-slate-800">{materials.length}</span> material
        </div>
      </div>

      {/* Responsive table */}
      <div className="card-surface rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Material</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Harga Beli / Satuan</th>
                <th className="py-3 px-4 text-center">Min. Setoran</th>
                <th className="py-3 px-4">Syarat Mutu</th>
                <th className="py-3 px-4 text-center">Status Penerimaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {materials.map((mat) => (
                <tr key={mat.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {mat.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {mat.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-extrabold text-emerald-700 text-sm tabular-nums">
                      Rp {mat.pricePerUnit.toLocaleString('id-ID')}
                    </span>
                    <span className="text-slate-400 text-[11px] ml-1 font-semibold">/{mat.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-700 tabular-nums font-semibold">
                    {mat.minQuantity} {mat.unit}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs text-[11px] leading-relaxed">
                    {mat.qualityRequirements}
                  </td>
                  <td className="py-3.5 px-4 text-center">
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
                </tr>
              ))}
              {materials.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada material daur ulang yang cocok dengan kata kunci.
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

