'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface PriceAuditRecord {
  id: string;
  categoryName: string;
  recyclerName: string;
  recyclerType: string;
  currentPrice: number;
  marketAverage: number;
  unit: string;
  deviationPercent: number;
  lastUpdated: string;
}

const DEFAULT_AUDIT_DATA: PriceAuditRecord[] = [
  {
    id: 'aud-1',
    categoryName: 'Minyak Jelantah Rumahan',
    recyclerName: 'Pengepul Berkah Jaya',
    recyclerType: 'Pengepul',
    currentPrice: 8500,
    marketAverage: 6500,
    unit: 'liter',
    deviationPercent: 30.7,
    lastUpdated: '2026-11-09',
  },
  {
    id: 'aud-2',
    categoryName: 'Kardus / Karton Cokelat',
    recyclerName: 'Lapak Barokah',
    recyclerType: 'Lapak',
    currentPrice: 1100,
    marketAverage: 2100,
    unit: 'kg',
    deviationPercent: -47.6,
    lastUpdated: '2026-11-08',
  },
  {
    id: 'aud-3',
    categoryName: 'Botol Plastik PET Bening',
    recyclerName: 'PT Hijau Sentosa',
    recyclerType: 'Pabrik',
    currentPrice: 5200,
    marketAverage: 4200,
    unit: 'kg',
    deviationPercent: 23.8,
    lastUpdated: '2026-11-07',
  },
];

export const PriceAuditTable: React.FC<{ data?: PriceAuditRecord[] }> = ({
  data = DEFAULT_AUDIT_DATA,
}) => {
  return (
    <div className="card-surface rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs">
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Audit Anomali Harga Pasar
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Mendeteksi harga mitra yang menyimpang di atas ambang batas 20% dari rata-rata pasar wilayah.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full w-fit">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>{data.length} Perlu Perhatian</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-white border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-5 whitespace-nowrap min-w-[180px]">Material</th>
              <th className="py-3.5 px-5 whitespace-nowrap min-w-[170px]">Nama Mitra</th>
              <th className="py-3.5 px-5 text-right whitespace-nowrap min-w-[150px]">Harga Mitra</th>
              <th className="py-3.5 px-5 text-right whitespace-nowrap min-w-[150px]">Rata-rata Pasar</th>
              <th className="py-3.5 px-5 text-center whitespace-nowrap min-w-[120px]">Deviasi</th>
              <th className="py-3.5 px-5 text-right whitespace-nowrap min-w-[130px]">Terakhir Diperbarui</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {data.map((item) => {
              const isHigh = item.deviationPercent > 0;
              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-5 font-bold text-slate-900 whitespace-nowrap sm:whitespace-normal">
                    {item.categoryName}
                  </td>
                  <td className="py-4 px-5 text-slate-700 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{item.recyclerName}</div>
                    <span className="inline-flex px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold mt-0.5">
                      {item.recyclerType}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right font-extrabold text-slate-900 tabular-nums whitespace-nowrap">
                    <span>Rp {item.currentPrice.toLocaleString('id-ID')}</span>
                    <span className="text-slate-400 text-[11px] ml-1 font-semibold">/{item.unit}</span>
                  </td>
                  <td className="py-4 px-5 text-right text-slate-600 tabular-nums whitespace-nowrap font-semibold">
                    <span>Rp {item.marketAverage.toLocaleString('id-ID')}</span>
                    <span className="text-slate-400 text-[11px] ml-1 font-semibold">/{item.unit}</span>
                  </td>
                  <td className="py-4 px-5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isHigh
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {isHigh ? (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      <span>
                        {isHigh ? '+' : ''}
                        {item.deviationPercent.toFixed(1)}%
                      </span>
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right text-slate-500 text-[11px] whitespace-nowrap font-mono">
                    {item.lastUpdated}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
