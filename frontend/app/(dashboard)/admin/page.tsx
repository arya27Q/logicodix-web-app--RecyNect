'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminStats } from '@/hooks/admin/useAdminStats';
import { useAdminVerifications } from '@/hooks/admin/useAdminVerifications';
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
  Calendar,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { stats } = useAdminStats();
  const { items: pendingItems, approve, reject } = useAdminVerifications();

  const kpis = [
    {
      label: 'Mitra Pengelola Aktif',
      value: stats.totalRecyclers.toString(),
      subtext: `+${stats.newRecyclersThisMonth} mitra baru bulan ini`,
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50/60 border-indigo-200/80',
      href: '/recyclers',
    },
    {
      label: 'Verifikasi Menunggu',
      value: stats.pendingVerifications.toString(),
      subtext: 'Memerlukan audit berkas legalitas',
      icon: <ShieldAlert className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50/60 border-amber-200/80',
      href: '/admin/verifications',
      highlight: true,
    },
    {
      label: 'Volume Daur Ulang',
      value: `${(stats.totalTransactionsVolumeKg / 1000).toFixed(1)} Ton`,
      subtext: 'Total sampah terserap sistem',
      icon: <Scale className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50/60 border-emerald-200/80',
      href: '/admin/price-audit',
    },
    {
      label: 'Kepatuhan Harga',
      value: `${stats.priceComplianceRate}%`,
      subtext: 'Sesuai batas wajar pasar',
      icon: <TrendingUp className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50/60 border-sky-200/80',
      href: '/admin/price-audit',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Overview Ekosistem RecyNect
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitoring performa jaringan pengelola sampah, antrean legalitas, dan stabilitas harga transparan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition"
          >
            <Boxes className="w-4 h-4" />
            <span>Kelola Kategori Master</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Link
            key={idx}
            href={kpi.href}
            className={`card-surface rounded-2xl p-5 border transition hover:shadow-sm block ${kpi.bg}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {kpi.label}
              </span>
              <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
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

      {/* ============================================================== */}
      {/* SECTION 1: Native Next.js / React SVG Analytics Charts         */}
      {/* ============================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Analitik Performa & Komposisi Sampah
          </h2>
          <span className="text-xs text-slate-500 font-medium">Diperbarui otomatis secara real-time</span>
        </div>
        <AdminAnalyticsCharts />
      </div>

      {/* ============================================================== */}
      {/* SECTION 2: Pending Verifications Queue (Spacious Layout)       */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Antrean Verifikasi Mitra Terbaru
            </h2>
            <p className="text-xs text-slate-500">
              Pendaftaran pabrik, bank sampah, dan pengepul baru yang memerlukan verifikasi berkas legalitas.
            </p>
          </div>
          <Link
            href="/admin/verifications"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>Lihat Semua Pengajuan ({pendingItems.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="card-surface rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                    {item.businessType}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.submissionDate}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {item.businessName}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  NIB: {item.regNumber}
                </p>
                <div className="flex items-start gap-1.5 text-xs text-slate-600 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{item.address}, {item.city}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => reject(item.id)}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
                >
                  Tolak
                </button>
                <button
                  type="button"
                  onClick={() => approve(item.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition"
                >
                  Verifikasi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 3: Price Audit Alerts (Full Width Container Below)     */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Peringatan Anomali Harga Pasar
            </h2>
            <p className="text-xs text-slate-500">
              Pengawasan harga material daur ulang yang menyimpang di atas ambang batas kewajaran wilayah.
            </p>
          </div>
          <Link
            href="/admin/price-audit"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>Buka Audit Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Full Width Price Audit Table */}
        <PriceAuditTable />
      </div>
    </div>
  );
}
