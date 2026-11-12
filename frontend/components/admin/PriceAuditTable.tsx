'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { AdminPriceAuditRecord } from '@/hooks/admin/useAdminPriceAudit';

interface PriceAuditTableProps {
  data: AdminPriceAuditRecord[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  staleDaysThreshold?: number;
  deviationThresholdPercent?: number;
}

const TYPE_LABELS: Record<string, string> = {
  bank_sampah: 'Bank Sampah',
  pengepul: 'Pengepul',
  tps3r: 'TPS3R',
  recycler_industry: 'Industri Daur Ulang',
};

export const PriceAuditTable: React.FC<PriceAuditTableProps> = ({
  data,
  isLoading = false,
  error = null,
  onRetry,
  staleDaysThreshold = 30,
  deviationThresholdPercent = 20,
}) => {
  const flaggedCount = data.filter((item) => item.isAnomaly || item.isStale).length;

  return (
    <div className="card-surface rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs">
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Audit Harga & Kesegaran Pembaruan
          </h3>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Memantau deviasi harga di atas {deviationThresholdPercent}% dari rata-rata kategori dan
            harga yang belum diperbarui lebih dari {staleDaysThreshold} hari.
          </p>
        </div>
        <span
          className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full w-fit border ${
            flaggedCount > 0
              ? 'text-amber-900 bg-amber-50 border-amber-200'
              : 'text-emerald-800 bg-emerald-50 border-emerald-200'
          }`}
        >
          <span>{flaggedCount} Perlu Perhatian</span>
        </span>
      </div>

      {error ? (
        <div
          role="alert"
          className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800 bg-rose-50/50 font-semibold"
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
              Muat Ulang
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5 whitespace-nowrap min-w-[170px]">Material</th>
                <th className="py-3.5 px-5 whitespace-nowrap min-w-[170px]">Mitra & Kontak</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap min-w-[135px]">Harga Mitra</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap min-w-[135px]">Rata-rata Pasar</th>
                <th className="py-3.5 px-5 text-center whitespace-nowrap min-w-[120px]">Deviasi</th>
                <th className="py-3.5 px-5 text-center whitespace-nowrap min-w-[130px]">Status Audit</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap min-w-[135px]">Pembaruan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-600 font-semibold">
                    Memuat data audit harga material dari database...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 px-5 text-center text-slate-600">
                    Belum ada data harga material mitra yang sesuai dengan filter saat ini.
                  </td>
                </tr>
              ) : (
                data.map((item) => {
                  const isHigh = item.deviationPercent > 0;
                  const isNegative = item.deviationPercent < 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-5 font-bold text-slate-900 whitespace-nowrap sm:whitespace-normal">
                        {item.categoryName}
                      </td>
                      <td className="py-4 px-5 text-slate-700 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{item.recyclerName}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="inline-flex px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {TYPE_LABELS[item.recyclerType] || item.recyclerType}
                          </span>
                          {item.isDemo && (
                            <span className="inline-flex px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                              DEMO
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1">{item.contact}</div>
                      </td>
                      <td className="py-4 px-5 text-right font-extrabold text-slate-900 tabular-nums whitespace-nowrap">
                        <span>Rp {item.currentPrice.toLocaleString('id-ID')}</span>
                        <span className="text-slate-600 text-[11px] ml-1 font-semibold">
                          /{item.unit}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right text-slate-700 tabular-nums whitespace-nowrap font-semibold">
                        <span>Rp {item.marketAverage.toLocaleString('id-ID')}</span>
                        <span className="text-slate-600 text-[11px] ml-1 font-semibold">
                          /{item.unit}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            item.isAnomaly
                              ? isHigh
                                ? 'bg-amber-50 text-amber-900 border-amber-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isHigh ? (
                            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : isNegative ? (
                            <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : null}
                          <span>
                            {isHigh ? '+' : ''}
                            {item.deviationPercent.toFixed(1)}%
                          </span>
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        {item.auditStatus === 'stale_and_anomaly' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            <span>Anomali & Usang</span>
                          </span>
                        )}
                        {item.auditStatus === 'anomaly' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                            <span>Deviasi &gt;{deviationThresholdPercent}%</span>
                          </span>
                        )}
                        {item.auditStatus === 'stale' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            <span>Usang ({item.daysSinceUpdate} hr)</span>
                          </span>
                        )}
                        {item.auditStatus === 'normal' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                            <span>Wajar</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right text-slate-600 text-[11px] whitespace-nowrap">
                        <div className="font-mono font-semibold text-slate-800">{item.lastUpdated}</div>
                        <div>{item.daysSinceUpdate} hari lalu</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
