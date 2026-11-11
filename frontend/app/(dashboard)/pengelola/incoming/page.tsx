'use client';

import React, { useState, useEffect } from 'react';
import { useRecyclerIncoming, IncomingDelivery } from '@/hooks/recycler/useRecyclerIncoming';
import { IncomingQueueDiagrams } from '@/components/recycler/IncomingQueueDiagrams';
import { WeighingModal } from '@/components/recycler/WeighingModal';
import { Search, CheckCircle2, Truck, Phone, AlertCircle, X, RotateCw } from 'lucide-react';

export default function RecyclerIncomingPage() {
  const {
    deliveries,
    allDeliveries,
    pendingCount,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    isLoading,
    actionError,
    setActionError,
    successMessage,
    setSuccessMessage,
    confirmWeighing,
    cancelDelivery,
    refreshDeliveries,
  } = useRecyclerIncoming();

  const [selectedForWeighing, setSelectedForWeighing] = useState<IncomingDelivery | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, setSuccessMessage]);

  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => {
        setActionError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionError, setActionError]);

  return (
    <div className="space-y-6">
      {/* Floating Centered Toast Notification */}
      {(successMessage || actionError) && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] sm:w-auto animate-in fade-in slide-in-from-top-4 duration-200">
          {successMessage && (
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-500/30 text-slate-800 shadow-2xl shadow-emerald-950/15 ring-1 ring-emerald-500/20">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900">Operasi Berhasil</span>
                <span className="text-xs text-slate-600 font-medium">{successMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="p-1.5 ml-3 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {actionError && (
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-500/30 text-slate-800 shadow-2xl shadow-rose-950/15 ring-1 ring-rose-500/20">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-rose-900">Perhatian</span>
                <span className="text-xs text-slate-600 font-medium">{actionError}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionError(null)}
                className="p-1.5 ml-3 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Jadwal & Antrean Setoran Masuk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Konfirmasi kedatangan warga, verifikasi berat riil di timbangan, dan rekam nota transaksi pembayaran.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={refreshDeliveries}
            title="Muat ulang antrean"
            className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-2xs"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
            <span>{pendingCount} Menunggu Kedatangan</span>
          </div>
        </div>
      </div>

      {/* Visual Operational Flow & Hourly Load Diagrams */}
      <IncomingQueueDiagrams deliveries={allDeliveries} />

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
            Semua ({allDeliveries.length})
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
            Menunggu Timbang ({pendingCount})
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
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap w-[20%]">ID Transaksi & Waktu</th>
                <th className="py-3.5 px-3 whitespace-nowrap w-[22%]">Nama Warga & Kontak</th>
                <th className="py-3.5 px-3 w-[26%]">Rincian Material</th>
                <th className="py-3.5 px-3 text-right whitespace-nowrap w-[14%]">Estimasi Payout</th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap w-[10%]">Status</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap w-[8%] sticky right-0 bg-slate-50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.04)]">
                  Aksi Timbangan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {deliveries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition group">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900 block">{item.id}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.arrivalTime}</span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <p className="font-bold text-slate-900">{item.citizenName}</p>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {item.citizenPhone}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
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
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <span className="font-extrabold text-emerald-700 text-sm tabular-nums">
                      Rp {(item.actualPayoutRp ?? item.estimatedPayoutRp).toLocaleString('id-ID')}
                    </span>
                    <span className="text-slate-400 text-[10px] block font-semibold">
                      {item.actualWeight ? `Riil: ${item.actualWeight} kg` : `± ${item.totalEstimatedWeight}`}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    {item.status === 'selesai' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Selesai</span>
                      </span>
                    ) : item.status === 'batal' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                        <span>Batal</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Menuju Lokasi</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-[#f8fafc] transition shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.04)]">
                    {item.status !== 'selesai' && item.status !== 'batal' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => cancelDelivery(item.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedForWeighing(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs font-bold shadow-2xs transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Timbang Selesai</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 font-mono">
                        {item.status === 'selesai' ? 'Nota Dicetak' : 'Dibatalkan'}
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

      {/* Weighing Modal */}
      <WeighingModal
        isOpen={Boolean(selectedForWeighing)}
        delivery={selectedForWeighing}
        onClose={() => setSelectedForWeighing(null)}
        onConfirm={confirmWeighing}
      />
    </div>
  );
}
