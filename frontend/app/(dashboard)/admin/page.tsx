'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminStats } from '@/hooks/admin/useAdminStats';
import { useAdminVerifications } from '@/hooks/admin/useAdminVerifications';
import { useAdminPriceAudit } from '@/hooks/admin/useAdminPriceAudit';
import { PriceAuditTable } from '@/components/admin/PriceAuditTable';
import { AdminAnalyticsCharts } from '@/components/admin/AdminAnalyticsCharts';
import {
  Users,
  ShieldAlert,
  Scale,
  TrendingUp,
  ArrowRight,
  Boxes,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  bank_sampah: 'Bank Sampah',
  pengepul: 'Pengepul',
  tps3r: 'TPS3R',
  recycler_industry: 'Industri Daur Ulang',
};

export default function AdminOverviewPage() {
  const {
    stats,
    isLoading: isLoadingStats,
    error: statsError,
    refresh: refreshStats,
  } = useAdminStats();
  const {
    pendingItems,
    isLoading: isLoadingRecyclers,
    error: recyclersError,
    processingId,
    actionError,
    successMessage,
    approve,
    reject,
    refresh: refreshRecyclers,
  } = useAdminVerifications('pending');
  const {
    allItems: auditItems,
    isLoading: isLoadingAudit,
    error: auditError,
    refresh: refreshAudit,
  } = useAdminPriceAudit();

  const flaggedAuditItems = auditItems
    .filter((item) => item.isAnomaly || item.isStale)
    .slice(0, 5);

  const volumeDisplay =
    stats.totalTransactionsVolumeKg >= 1000
      ? `${(stats.totalTransactionsVolumeKg / 1000).toFixed(2)} Ton`
      : `${stats.totalTransactionsVolumeKg.toLocaleString('id-ID')} kg`;

  const kpis = [
    {
      label: 'Mitra Pengelola Aktif',
      value: isLoadingStats ? '...' : stats.totalRecyclers.toString(),
      subtext: isLoadingStats
        ? 'Memuat jumlah mitra...'
        : `${stats.newRecyclersThisMonth} pendaftaran baru bulan ini`,
      icon: <Users className="w-5 h-5 text-slate-700" aria-hidden="true" />,
      bg: 'bg-white border-slate-200/90',
      href: '/admin/verifications',
    },
    {
      label: 'Verifikasi Menunggu',
      value: isLoadingStats ? '...' : stats.pendingVerifications.toString(),
      subtext: 'Pengajuan pengelola perlu tinjauan',
      icon: <ShieldAlert className="w-5 h-5 text-amber-700" aria-hidden="true" />,
      bg: 'bg-amber-50/50 border-amber-200/80',
      href: '/admin/verifications',
    },
    {
      label: 'Volume Setoran Selesai',
      value: isLoadingStats ? '...' : volumeDisplay,
      subtext: isLoadingStats
        ? 'Memuat transaksi...'
        : `Dari ${stats.completedDeliveriesCount} setoran selesai`,
      icon: <Scale className="w-5 h-5 text-emerald-700" aria-hidden="true" />,
      bg: 'bg-emerald-50/50 border-emerald-200/80',
      href: '/admin/price-audit',
    },
    {
      label: 'Kepatuhan Harga',
      value: isLoadingStats
        ? '...'
        : stats.totalEvaluatedMaterials > 0
          ? `${stats.priceComplianceRate}%`
          : '-',
      subtext:
        stats.totalEvaluatedMaterials > 0
          ? `${stats.anomalyReportsCount} anomali, ${stats.stalePriceCount} harga usang`
          : 'Belum ada penawaran harga mitra',
      icon: <TrendingUp className="w-5 h-5 text-sky-700" aria-hidden="true" />,
      bg: 'bg-sky-50/50 border-sky-200/80',
      href: '/admin/price-audit',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Overview Ekosistem RecyNect
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Ringkasan operasional jaringan pengelola sampah, antrean verifikasi, dan status harga material.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/categories"
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition"
          >
            <Boxes className="w-4 h-4" aria-hidden="true" />
            <span>Kelola Kategori Master ({stats.activeWasteCategories} Aktif)</span>
          </Link>
        </div>
      </div>

      {statsError && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800 font-semibold"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" aria-hidden="true" />
            <span>{statsError}</span>
          </div>
          <button
            type="button"
            onClick={refreshStats}
            className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 font-bold"
          >
            Coba Lagi
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className={`card-surface rounded-2xl p-5 border transition hover:shadow-sm block ${kpi.bg}`}
          >
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {kpi.label}
              </span>
              <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs shrink-0">
                {kpi.icon}
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {kpi.value}
            </p>
            <p className="text-xs text-slate-600 mt-1 font-medium">{kpi.subtext}</p>
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Analitik Volume & Komposisi Material
          </h2>
          <span className="text-xs text-slate-600 font-medium">Data langsung dari database</span>
        </div>
        <AdminAnalyticsCharts
          monthlyTrend={stats.monthlyTrend}
          materialComposition={stats.materialComposition}
          compositionBasis={stats.compositionBasis}
          isLoading={isLoadingStats}
          error={statsError}
          onRetry={refreshStats}
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Antrean Verifikasi Mitra Terbaru
            </h2>
            <p className="text-xs text-slate-600">
              Pendaftaran mitra baru yang menunggu tinjauan sebelum tampil sebagai mitra terverifikasi.
            </p>
          </div>
          <Link
            href="/admin/verifications"
            className="min-h-[40px] inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900"
          >
            <span>Lihat Semua Pengajuan ({pendingItems.length})</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {actionError && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" aria-hidden="true" />
            <span>{actionError}</span>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" aria-hidden="true" />
            <span>{successMessage}</span>
          </div>
        )}

        {isLoadingRecyclers ? (
          <div className="p-8 text-center text-xs font-semibold text-slate-600 bg-white rounded-2xl border border-slate-200">
            Memuat antrean verifikasi mitra...
          </div>
        ) : recyclersError ? (
          <div
            role="alert"
            className="p-6 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-xs font-semibold text-rose-800"
          >
            <span>{recyclersError}</span>
            <button
              type="button"
              onClick={refreshRecyclers}
              className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white border border-rose-200 font-bold"
            >
              Muat Ulang
            </button>
          </div>
        ) : pendingItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-600 bg-white rounded-2xl border border-dashed border-slate-200 space-y-1">
            <p className="font-bold text-slate-800">Tidak ada antrean verifikasi menunggu</p>
            <p>Semua pengajuan mitra pengelola sudah ditinjau.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingItems.slice(0, 3).map((item) => {
              const isBusy = processingId === item.id;
              return (
                <div
                  key={item.id}
                  className="card-surface rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {TYPE_LABELS[item.managementType] || item.managementType}
                      </span>
                      <span className="text-[11px] font-mono text-slate-600">
                        {item.createdAt.split('T')[0]}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Penanggung Jawab: {item.ownerName}
                    </p>
                    <div className="flex items-start gap-1.5 text-xs text-slate-600 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="line-clamp-2">{item.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => reject(item.id)}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition disabled:opacity-50"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => approve(item.id)}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs transition disabled:opacity-50"
                    >
                      {isBusy ? 'Memproses...' : 'Verifikasi'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Temuan Audit Harga Terbaru
            </h2>
            <p className="text-xs text-slate-600">
              Menampilkan penawaran mitra dengan deviasi di atas 20% atau pembaruan lebih dari 30 hari.
            </p>
          </div>
          <Link
            href="/admin/price-audit"
            className="min-h-[40px] inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900"
          >
            <span>Buka Audit Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <PriceAuditTable
          data={flaggedAuditItems.length > 0 ? flaggedAuditItems : auditItems.slice(0, 5)}
          isLoading={isLoadingAudit}
          error={auditError}
          onRetry={refreshAudit}
        />
      </div>
    </div>
  );
}
