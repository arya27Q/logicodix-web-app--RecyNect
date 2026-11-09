'use client';

import React from 'react';
import Link from 'next/link';
import { RecyclerStatsCard } from '@/components/recycler/RecyclerStatsCard';
import { useRecyclerMaterials } from '@/hooks/recycler/useRecyclerMaterials';
import { Package, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export default function RecyclerDashboardPage() {
  const { activeCount, totalCount } = useRecyclerMaterials();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
          Dashboard Mitra Pengelola
        </h1>
        <p className="text-sm text-slate-500">
          Ringkasan operasional harian, katalog material aktif, dan status verifikasi kemitraan Anda.
        </p>
      </div>

      <RecyclerStatsCard
        activeMaterials={activeCount}
        totalMaterials={totalCount}
        completedPickups={142}
        rating={4.9}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/recycler/materials"
          className="card-surface rounded-2xl p-5 border border-slate-200 hover:border-emerald-500/80 transition group block"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Package className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
          </div>
          <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition">
            Kelola Material & Harga
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Buka/tutup penerimaan jenis material dan perbarui harga per kilogram.
          </p>
        </Link>

        <Link
          href="/recycler/profile"
          className="card-surface rounded-2xl p-5 border border-slate-200 hover:border-sky-500/80 transition group block"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition" />
          </div>
          <h3 className="font-bold text-slate-900 group-hover:text-sky-700 transition">
            Profil & Legalitas Usaha
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Periksa status NIB, izin lingkungan, dan jam operasional gudang penerimaan.
          </p>
        </Link>
      </div>
    </div>
  );
}
