'use client';

import React, { useState } from 'react';
import { IncomingDelivery } from '@/hooks/recycler/useRecyclerIncoming';
import { Scale, CheckCircle2, X } from 'lucide-react';

interface WeighingModalProps {
  isOpen: boolean;
  delivery: IncomingDelivery | null;
  onClose: () => void;
  onConfirm: (
    id: string,
    actualWeight?: number,
    actualPayoutRp?: number,
    notes?: string
  ) => Promise<void> | void;
}

export const WeighingModal: React.FC<WeighingModalProps> = ({
  isOpen,
  delivery,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !delivery) return null;

  return (
    <WeighingDialog
      key={delivery.id}
      delivery={delivery}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

const WeighingDialog: React.FC<{
  delivery: IncomingDelivery;
  onClose: () => void;
  onConfirm: (
    id: string,
    actualWeight?: number,
    actualPayoutRp?: number,
    notes?: string
  ) => Promise<void> | void;
}> = ({ delivery, onClose, onConfirm }) => {
  // Parse numeric weight from "15.0 kg" or "6.0 L"
  const defaultWeightNum = parseFloat(delivery.totalEstimatedWeight) || 10;
  const [actualWeight, setActualWeight] = useState<number>(delivery.actualWeight ?? defaultWeightNum);
  const [actualPayout, setActualPayout] = useState<number>(delivery.actualPayoutRp ?? delivery.estimatedPayoutRp);
  const [notes, setNotes] = useState(delivery.notes || 'Selesai ditimbang. Kondisi bersih & terpilah.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actualWeight <= 0) {
      alert('Berat riil timbangan harus lebih besar dari 0.');
      return;
    }
    if (actualPayout <= 0) {
      alert('Total payout harus lebih besar dari Rp 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(delivery.id, actualWeight, actualPayout, notes);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Konfirmasi Penimbangan Riil
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Transaksi: <span className="font-mono font-bold text-slate-800">{delivery.id}</span> • {delivery.citizenName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="pt-4 space-y-4 text-xs">
          {/* Material summary box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Material yang Disetor Warga:
            </span>
            <div className="space-y-0.5 pt-1">
              {delivery.materials.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-700">
                  <span className="font-medium">• {m.name}</span>
                  <span className="font-semibold">{m.estimatedQty} {m.unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                Berat Riil Timbangan <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={actualWeight}
                  onChange={(e) => setActualWeight(parseFloat(e.target.value) || 0)}
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs tabular-nums font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                Total Payout Tunai (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="500"
                min="500"
                required
                value={actualPayout}
                onChange={(e) => setActualPayout(parseInt(e.target.value) || 0)}
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs tabular-nums font-bold text-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
              Catatan Penimbangan & Nota
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Selesai ditimbang. Payout tunai lunas."
              className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-50 text-white text-xs font-bold shadow-xs transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Selesaikan & Cetak Nota'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

