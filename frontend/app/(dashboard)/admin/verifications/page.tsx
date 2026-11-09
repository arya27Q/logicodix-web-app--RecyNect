'use client';

import React from 'react';
import { useAdminVerifications } from '@/hooks/admin/useAdminVerifications';
import { VerificationCard } from '@/components/admin/VerificationCard';

export default function AdminVerificationsPage() {
  const { items, pendingCount, filterType, setFilterType, approve, reject } =
    useAdminVerifications();

  const filterOptions = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'pabrik', label: 'Pabrik' },
    { id: 'bank_sampah', label: 'Bank Sampah' },
    { id: 'pengepul', label: 'Pengepul' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            Verifikasi Mitra Pengelola
          </h1>
          <p className="text-sm text-slate-500">
            Daftar pengajuan mitra pengelola baru yang menunggu tinjauan berkas legalitas.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>{pendingCount} Pengajuan Menunggu</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setFilterType(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === opt.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Verification Cards */}
      <div className="space-y-4">
        {items.map((item) => (
          <VerificationCard
            key={item.id}
            item={item}
            onApprove={approve}
            onReject={reject}
          />
        ))}

        {items.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            Tidak ada pengajuan mitra pada kategori ini.
          </div>
        )}
      </div>
    </div>
  );
}
