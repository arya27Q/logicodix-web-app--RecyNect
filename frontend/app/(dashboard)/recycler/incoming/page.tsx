'use client';

import React from 'react';
import { useRecyclerIncoming } from '@/hooks/recycler/useRecyclerIncoming';
import { Search, CheckCircle2, XCircle, Truck, Phone, Scale } from 'lucide-react';

export default function RecyclerIncomingPage() {
  const {
    deliveries,
    pendingCount,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    confirmWeighing,
    cancelDelivery,
  } = useRecyclerIncoming();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Jadwal & Antrean Setoran Masuk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Konfirmasi kedatangan warga, verifikasi berat riil di timbangan, dan rekam nota transaksi pembayaran.
          </p>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <span>{pendingCount} Menunggu Kedatangan</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari ID transaksi atau nama warga..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({deliveries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('antre')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'antre'
                ? 'bg-white text-amber-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Menunggu Timbang
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('selesai')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'selesai'
                ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="card-surface rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5 whitespace-nowrap min-w-[150px]">ID Transaksi & Waktu</th>
                <th className="py-3.5 px-5 whitespace-nowrap min-w-[180px]">Nama Warga & Kontak</th>
                <th className="py-3.5 px-5 whitespace-nowrap min-w-[220px]">Rincian Material</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap min-w-[140px]">Estimasi Payout</th>
                <th className="py-3.5 px-5 text-center whitespace-nowrap min-w-[120px]">Status</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap min-w-[150px]">Aksi Timbangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {deliveries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900 block">{item.id}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.arrivalTime}</span>
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <p className="font-bold text-slate-900">{item.citizenName}</p>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {item.citizenPhone}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="space-y-0.5">
                      {item.materials.map((m, idx) => (
                        <p key={idx} className="text-slate-700">
                          <span className="font-semibold">{m.name}</span>: {m.estimatedQty} {m.unit}
                        </p>
                      ))}
                      {item.notes && (
                        <p className="text-[11px] text-slate-400 italic">Catatan: {item.notes}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <span className="font-extrabold text-emerald-700 text-sm tabular-nums">
                      Rp {item.estimatedPayoutRp.toLocaleString('id-ID')}
                    </span>
                    <span className="text-slate-400 text-[10px] block font-semibold">
                      ± {item.totalEstimatedWeight}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center whitespace-nowrap">
                    {item.status === 'selesai' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Selesai</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Menuju Lokasi</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    {item.status !== 'selesai' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => cancelDelivery(item.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmWeighing(item.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Timbang Selesai</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 font-mono">
                        Nota Dicetak
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {deliveries.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada antrean setoran masuk yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
