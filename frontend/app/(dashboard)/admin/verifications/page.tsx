'use client';

import React from 'react';
import { useAdminVerifications } from '@/hooks/admin/useAdminVerifications';
import { VerificationCard } from '@/components/admin/VerificationCard';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminVerificationsPage() {
  const {
    items,
    pendingCount,
    statusFilter,
    setStatusFilter,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    processingId,
    actionError,
    successMessage,
    approve,
    reject,
    toggleActive,
    toggleDemo,
    refresh,
  } = useAdminVerifications('all');

  const statusOptions = [
    { id: 'all', label: 'Semua Status' },
    { id: 'pending', label: 'Menunggu' },
    { id: 'verified', label: 'Terverifikasi' },
    { id: 'rejected', label: 'Ditolak' },
  ] as const;

  const typeOptions = [
    { id: 'all', label: 'Semua Jenis' },
    { id: 'bank_sampah', label: 'Bank Sampah' },
    { id: 'pengepul', label: 'Pengepul' },
    { id: 'tps3r', label: 'TPS3R' },
    { id: 'recycler_industry', label: 'Industri' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verifikasi & Moderasi Pengelola
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Tinjau pendaftaran mitra baru, setujui atau tolak verifikasi, serta kelola status aktif dan label data demo.
          </p>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 w-fit">
          <span>{pendingCount} Pengajuan Menunggu</span>
        </div>
      </div>

      {actionError && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" aria-hidden="true" />
          <span>{actionError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="admin-verifications-search" className="sr-only">
            Cari nama mitra, penanggung jawab, alamat, atau kontak
          </label>
          <Search
            className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="admin-verifications-search"
            type="text"
            placeholder="Cari nama mitra, pemilik, alamat, atau kontak..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="Filter status verifikasi"
            className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold"
          >
            {statusOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={statusFilter === opt.id}
                onClick={() => setStatusFilter(opt.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg transition ${
                  statusFilter === opt.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div
            role="tablist"
            aria-label="Filter jenis pengelola"
            className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold"
          >
            {typeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={filterType === opt.id}
                onClick={() => setFilterType(opt.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg transition ${
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
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-xs font-semibold text-slate-600 bg-white rounded-2xl border border-slate-200">
          Memuat daftar mitra pengelola dari database...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="p-6 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-rose-800"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" aria-hidden="true" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-white border border-rose-200 font-bold hover:bg-rose-100 transition"
          >
            Muat Ulang
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <VerificationCard
              key={item.id}
              item={item}
              isProcessing={processingId === item.id}
              onApprove={approve}
              onReject={reject}
              onToggleActive={toggleActive}
              onToggleDemo={toggleDemo}
            />
          ))}

          {items.length === 0 && (
            <div className="p-10 text-center text-xs text-slate-600 bg-white rounded-2xl border border-dashed border-slate-200 space-y-1">
              <p className="font-bold text-slate-800">Tidak ada mitra yang sesuai filter</p>
              <p>Ubah filter status, jenis pengelola, atau kata kunci pencarian.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
