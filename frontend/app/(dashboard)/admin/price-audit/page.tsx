'use client';

import React, { useState } from 'react';
import { PriceAuditTable } from '@/components/admin/PriceAuditTable';
import { Scale, AlertTriangle, TrendingUp, CheckCircle2, Send } from 'lucide-react';

export default function AdminPriceAuditPage() {
  const [isNotifying, setIsNotifying] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);

  const handleBroadcastAuditNotice = () => {
    setIsNotifying(true);
    setTimeout(() => {
      setIsNotifying(false);
      setNotifySuccess(true);
      setTimeout(() => setNotifySuccess(false), 3000);
    }, 700);
  };

  const auditStats = [
    {
      label: 'Kepatuhan Harga Sistem',
      value: '94.2%',
      subtext: 'Berdasarkan 82 pencatatan transaksi',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50/60 border-emerald-200/80',
    },
    {
      label: 'Anomali Deviasi >20%',
      value: '3 Kasus',
      subtext: 'Memerlukan review alasan mitra',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50/60 border-amber-200/80',
    },
    {
      label: 'Rata-rata Selisih Pasar',
      value: '± 8.4%',
      subtext: 'Fluktuasi wajar mingguan',
      icon: <TrendingUp className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50/60 border-sky-200/80',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Audit Kewajaran & Pembaruan Harga
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mendeteksi penetapan harga mitra yang menyimpang di atas ambang batas 20% dari rata-rata pasar wilayah.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleBroadcastAuditNotice}
            disabled={isNotifying}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99] disabled:opacity-70"
          >
            <Send className="w-4 h-4" />
            <span>{isNotifying ? 'Mengirim Peringatan...' : 'Kirim Notifikasi Audit ke Mitra'}</span>
          </button>
        </div>
      </div>

      {notifySuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Notifikasi audit kepatuhan berhasil dikirimkan ke 3 mitra pengelola dengan deviasi tinggi.</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {auditStats.map((item, idx) => (
          <div
            key={idx}
            className={`card-surface rounded-2xl p-4 border transition ${item.bg}`}
          >
            <div className="flex items-center justify-between mb-2">
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

      {/* Audit Table */}
      <PriceAuditTable />
    </div>
  );
}
