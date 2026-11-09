'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminVerifications } from '@/hooks/admin/useAdminVerifications';
import { PriceAuditTable } from '@/components/admin/PriceAuditTable';
import { ShieldCheck, Layers, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminOverviewPage() {
  const { pendingCount } = useAdminVerifications();

  const stats = [
    {
      label: 'Verifikasi Menunggu',
      value: pendingCount.toString(),
      subtext: 'Mitra baru perlu ditinjau',
      href: '/admin/verifications',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      label: 'Total Pengelola Aktif',
      value: '24',
      subtext: 'Pabrik, Bank Sampah, Pengepul',
      href: '/recyclers',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Kategori Master',
      value: '6',
      subtext: 'Material aktif di sistem',
      href: '/admin/categories',
      color: 'text-sky-700 bg-sky-50 border-sky-200',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
          Overview Administrator
        </h1>
        <p className="text-sm text-slate-500">
          Statistik ekosistem, antrean verifikasi legalitas, dan monitoring kepatuhan harga pengelola.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, idx) => (
          <Link
            key={idx}
            href={s.href}
            className={`card-surface rounded-2xl p-4 border transition hover:shadow-sm ${s.color} block`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">{s.label}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{s.value}</p>
            <p className="text-xs opacity-75 mt-0.5">{s.subtext}</p>
          </Link>
        ))}
      </div>

      <PriceAuditTable />
    </div>
  );
}
