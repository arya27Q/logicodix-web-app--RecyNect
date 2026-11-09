'use client';

import React from 'react';
import { useAdminVerifications } from '@/hooks/admin/useAdminVerifications';
import { VerificationCard } from '@/components/admin/VerificationCard';
import { Search } from 'lucide-react';

export default function AdminVerificationsPage() {
  const {
    items,
    pendingCount,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    approve,
    reject,
  } = useAdminVerifications();

  const filterOptions = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'pabrik', label: 'Pabrik' },
    { id: 'bank_sampah', label: 'Bank Sampah' },
    { id: 'pengepul', label: 'Pengepul' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verifikasi Mitra Pengelola
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar pengajuan mitra pengelola baru yang menunggu tinjauan berkas legalitas NIB dan izin lingkungan.
          </p>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <span>{pendingCount} Pengajuan Menunggu</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative min-w-[260px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama mitra, kota, atau NIB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilterType(opt.id)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterType === opt.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
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
            Tidak ada pengajuan mitra yang sesuai dengan kriteria pencarian.
          </div>
        )}
      </div>
    </div>
  );
}
