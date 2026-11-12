'use client';

import React from 'react';
import { useAdminPriceAudit } from '@/hooks/admin/useAdminPriceAudit';
import { PriceAuditTable } from '@/components/admin/PriceAuditTable';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  RefreshCw,
  Download,
  Search,
  History,
} from 'lucide-react';

export default function AdminPriceAuditPage() {
  const {
    items,
    allItems,
    summary,
    priceHistories,
    filterMode,
    setFilterMode,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    refresh,
  } = useAdminPriceAudit(30, 20);

  const handleExportCsv = () => {
    if (allItems.length === 0) return;

    const header = [
      'Material',
      'Mitra',
      'Jenis Mitra',
      'Demo',
      'Kontak',
      'Harga Mitra',
      'Satuan',
      'Rata-rata Pasar',
      'Deviasi (%)',
      'Status Audit',
      'Terakhir Diperbarui',
      'Umur Harga (Hari)',
    ];

    const escapeCsv = (val: string | number | boolean) =>
      `"${String(val).replace(/"/g, '""')}"`;

    const rows = allItems.map((item) => [
      item.categoryName,
      item.recyclerName,
      item.recyclerType,
      item.isDemo ? 'Ya' : 'Tidak',
      item.contact,
      item.currentPrice,
      item.unit,
      item.marketAverage,
      item.deviationPercent,
      item.auditStatus,
      item.lastUpdated,
      item.daysSinceUpdate,
    ]);

    const csvContent = [header, ...rows]
      .map((line) => line.map(escapeCsv).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-harga-recynect-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const auditStats = [
    {
      label: 'Kepatuhan Harga Sistem',
      value: isLoading
        ? '...'
        : summary.totalMaterials > 0
          ? `${summary.complianceRate}%`
          : '-',
      subtext:
        summary.totalMaterials > 0
          ? `${summary.compliantCount} dari ${summary.totalMaterials} penawaran harga wajar & mutakhir`
          : 'Belum ada penawaran harga material',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" aria-hidden="true" />,
      bg: 'bg-emerald-50/50 border-emerald-200/80',
    },
    {
      label: `Anomali Deviasi >${summary.deviationThresholdPercent}%`,
      value: isLoading ? '...' : `${summary.anomalyCount} Item`,
      subtext: `Rata-rata deviasi absolut ${summary.averageAbsoluteDeviationPercent}%`,
      icon: <AlertTriangle className="w-5 h-5 text-amber-700" aria-hidden="true" />,
      bg: 'bg-amber-50/50 border-amber-200/80',
    },
    {
      label: `Harga Usang (>${summary.staleDaysThreshold} Hari)`,
      value: isLoading ? '...' : `${summary.staleCount} Item`,
      subtext: 'Belum diperbarui mitra melewati batas waktu',
      icon: <Clock className="w-5 h-5 text-rose-700" aria-hidden="true" />,
      bg: 'bg-rose-50/50 border-rose-200/80',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Audit Kewajaran & Pembaruan Harga
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Mendeteksi harga mitra yang menyimpang di atas {summary.deviationThresholdPercent}% dari
            rata-rata kategori maupun yang belum diperbarui lebih dari {summary.staleDaysThreshold} hari.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={isLoading}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs transition disabled:opacity-60"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>{isLoading ? 'Memuat...' : 'Segarkan Audit'}</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isLoading || allItems.length === 0}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Unduh Laporan CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {auditStats.map((item) => (
          <div key={item.label} className={`card-surface rounded-2xl p-4 border ${item.bg}`}>
            <div className="flex items-center justify-between mb-2 gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {item.label}
              </span>
              <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                {item.icon}
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {item.value}
            </p>
            <p className="text-xs text-slate-600 mt-1 font-medium">{item.subtext}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <label htmlFor="admin-price-audit-search" className="sr-only">
            Cari material atau nama mitra
          </label>
          <Search
            className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="admin-price-audit-search"
            type="text"
            placeholder="Cari material atau nama mitra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs"
          />
        </div>

        <div
          role="tablist"
          aria-label="Filter hasil audit harga"
          className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold"
        >
          {(
            [
              { id: 'all', label: `Semua (${allItems.length})` },
              { id: 'flagged', label: `Perlu Perhatian (${summary.flaggedCount})` },
              { id: 'anomaly', label: `Anomali (${summary.anomalyCount})` },
              { id: 'stale', label: `Harga Usang (${summary.staleCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filterMode === tab.id}
              onClick={() => setFilterMode(tab.id)}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg transition ${
                filterMode === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <PriceAuditTable
        data={items}
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        staleDaysThreshold={summary.staleDaysThreshold}
        deviationThresholdPercent={summary.deviationThresholdPercent}
      />

      <div className="card-surface rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-700" aria-hidden="true" />
            <h2 className="text-sm font-extrabold text-slate-900">
              Riwayat Perubahan Harga Mitra
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-600 tabular-nums">
            {priceHistories.length} catatan terbaru
          </span>
        </div>

        {priceHistories.length === 0 ? (
          <p className="text-xs text-slate-600 py-4 text-center">
            Belum ada riwayat perubahan harga yang tercatat pada tabel price_histories.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {priceHistories.map((h) => (
              <div
                key={h.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{h.recyclerName}</span>
                  <span className="text-slate-600"> mengubah harga </span>
                  <span className="font-semibold text-slate-800">{h.categoryName}</span>
                </div>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="text-slate-600 line-through">
                    Rp {h.oldPrice.toLocaleString('id-ID')}
                  </span>
                  <span className="font-extrabold text-emerald-800">
                    Rp {h.newPrice.toLocaleString('id-ID')}/{h.unit}
                  </span>
                  <span className="text-[11px] font-mono text-slate-600">
                    {h.changedAt.split('T')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
