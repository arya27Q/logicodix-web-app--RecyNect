'use client';

import React from 'react';
import Link from 'next/link';
import { useRecyclerStats } from '@/hooks/recycler/useRecyclerStats';
import { useRecyclerIncoming } from '@/hooks/recycler/useRecyclerIncoming';
import { RecyclerAnalyticsCharts } from '@/components/recycler/RecyclerAnalyticsCharts';
import {
  Package,
  ArrowRight,
  Truck,
  Coins,
  Scale,
  Warehouse,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
} from 'lucide-react';

export default function RecyclerDashboardPage() {
  const { stats } = useRecyclerStats();
  const { deliveries, confirmWeighing } = useRecyclerIncoming();

  const kpis = [
    {
      label: 'Sampah Terserap Bulan Ini',
      value: `${(stats.intakeThisMonthKg / 1000).toFixed(1)} Ton`,
      subtext: `Dari ${stats.activeCitizensServed} transaksi warga`,
      icon: <Scale className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50/60 border-emerald-200/80',
      href: '/pengelola/materials',
    },
    {
      label: 'Estimasi Payout ke Warga',
      value: `Rp ${(stats.totalPayoutRp / 1000000).toFixed(1)} Jt`,
      subtext: 'Pembayaran setoran selesai',
      icon: <Coins className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50/60 border-amber-200/80',
      href: '/pengelola/incoming',
    },
    {
      label: 'Kapasitas Gudang',
      value: `${stats.warehouseCapacityPercent}%`,
      subtext: `${stats.totalStorageTon} Ton dari batas ${stats.maxCapacityTon} Ton`,
      icon: <Warehouse className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50/60 border-indigo-200/80',
      href: '/pengelola',
    },
    {
      label: 'Antrean Setoran Hari Ini',
      value: `${stats.pendingDeliveriesCount} Antrean`,
      subtext: 'Warga menuju lokasi gudang',
      icon: <Truck className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50/60 border-sky-200/80',
      href: '/pengelola/incoming',
      highlight: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Operasional Pengelola
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau arus penerimaan sampah dari warga, estimasi pencairan timbangan, dan kapasitas gudang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/pengelola/materials"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition"
          >
            <Package className="w-4 h-4" />
            <span>Kelola Ketentuan Harga</span>
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

      {/* Analytics Charts Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Analitik Aliran Material & Stok Gudang
          </h2>
          <span className="text-xs text-slate-500 font-medium">Berdasarkan data timbangan resmi</span>
        </div>
        <RecyclerAnalyticsCharts
          dailyData={stats.dailyTrend}
          storageBreakdown={stats.storageBreakdown}
          totalStorageTon={stats.totalStorageTon}
          maxCapacityTon={stats.maxCapacityTon}
          warehouseCapacityPercent={stats.warehouseCapacityPercent}
        />
      </div>

      {/* Antrean Setoran Masuk Warga Hari Ini */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Jadwal & Kedatangan Warga Hari Ini
            </h2>
            <p className="text-xs text-slate-500">
              Konfirmasi penimbangan dan cetak bukti pembayaran saat sampah tiba di gudang.
            </p>
          </div>
          <Link
            href="/pengelola/incoming"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            <span>Buka Antrean Lengkap ({deliveries.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deliveries.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="card-surface rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {item.id}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                    {item.status === 'selesai' ? 'Selesai' : 'Menuju Lokasi'}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {item.citizenName}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{item.citizenPhone}</span>
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mt-3 space-y-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Estimasi Muatan:</span>
                    <span className="font-bold text-slate-900">{item.totalEstimatedWeight}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Estimasi Payout:</span>
                    <span className="font-extrabold text-emerald-700">
                      Rp {item.estimatedPayoutRp.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.arrivalTime}
                </span>
                {item.status !== 'selesai' ? (
                  <button
                    type="button"
                    onClick={() => confirmWeighing(item.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xs transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Konfirmasi Timbang</span>
                  </button>
                ) : (
                  <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Selesai</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
