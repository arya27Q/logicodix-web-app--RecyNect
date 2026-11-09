'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminStats } from '@/hooks/admin/useAdminStats';
import { useAdminVerifications } from '@/hooks/admin/useAdminVerifications';
import { PriceAuditTable } from '@/components/admin/PriceAuditTable';
import {
  Users,
  ShieldAlert,
  Scale,
  TrendingUp,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Calendar,
  Sparkles,
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
            <span>Kelola Kategori</span>
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

      {/* Main Grid: Pending Verifications & Price Audit Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Quick Action Verifications Queue */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Antrean Verifikasi Mitra Terbaru
              </h2>
              <p className="text-xs text-slate-500">
                Pendaftaran pabrik, bank sampah, dan pengepul baru.
              </p>
            </div>
            <Link
              href="/admin/verifications"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Lihat Semua ({pendingItems.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="card-surface rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                      {item.businessType}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm mt-1">
                      {item.businessName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {item.city} • Penanggung Jawab: {item.ownerName}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.submissionDate}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition"
                  >
                    Verifikasi Cepat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Engine Status & Price Audit Table */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Peringatan Anomali Harga
              </h2>
              <p className="text-xs text-slate-500">
                Pengecekan deviasi harga di atas batas kewajaran pasar.
              </p>
            </div>
            <Link
              href="/admin/price-audit"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Selengkapnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <PriceAuditTable />
        </div>
      </div>
    </div>
  );
}
