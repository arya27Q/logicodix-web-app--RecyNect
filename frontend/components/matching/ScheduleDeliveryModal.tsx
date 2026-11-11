'use client';

import React, { useState } from 'react';
import { StopAllocation } from '@/types';
import { apiClient } from '@/lib/api-client';
import { Truck, CheckCircle2, X, Clock, User, Phone, FileText, Loader2 } from 'lucide-react';

interface ScheduleDeliveryModalProps {
  isOpen: boolean;
  stop: StopAllocation | null;
  sessionId?: string;
  onClose: () => void;
  onSuccess?: (code: string) => void;
}

export const ScheduleDeliveryModal: React.FC<ScheduleDeliveryModalProps> = ({
  isOpen,
  stop,
  sessionId,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !stop) return null;

  return (
    <ScheduleDeliveryDialog
      key={stop.recyclerId}
      stop={stop}
      sessionId={sessionId}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};

const ScheduleDeliveryDialog: React.FC<{
  stop: StopAllocation;
  sessionId?: string;
  onClose: () => void;
  onSuccess?: (code: string) => void;
}> = ({ stop, sessionId, onClose, onSuccess }) => {
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [arrivalTime, setArrivalTime] = useState('Hari Ini (10:00 - 12:00 WIB)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Auto-fill from active user session if logged in
  React.useEffect(() => {
    let isMounted = true;
    apiClient<{ name?: string; phone?: string }>('/auth/me')
      .then((user) => {
        if (!isMounted || !user) return;
        if (user.name) setCitizenName(user.name);
        if (user.phone) setCitizenPhone(user.phone);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const totalWeightStr = stop.materials
    .map((m) => `${m.quantity} ${m.unit}`)
    .join(' + ');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    if (!citizenName.trim()) {
      setErrorText('Nama lengkap wajib diisi.');
      return;
    }
    if (!citizenPhone.trim()) {
      setErrorText('Nomor kontak WhatsApp/telepon wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient<{ id: string; deliveryCode?: string }>('/recyclers/incoming', {
        method: 'POST',
        body: JSON.stringify({
          recyclerId: stop.recyclerId,
          sessionId,
          citizenName: citizenName.trim(),
          citizenPhone: citizenPhone.trim(),
          materials: stop.materials.map((m) => ({
            name: m.categoryName,
            estimatedQty: m.quantity,
            unit: m.unit,
            pricePerUnit: m.pricePerUnit,
          })),
          totalEstimatedWeight: totalWeightStr,
          estimatedPayoutRp: stop.stopTotalValue,
          arrivalTime,
          notes: notes.trim() || undefined,
        }),
      });

      const code = res?.deliveryCode || res?.id || 'RCV-SUKSES';
      setSuccessCode(code);
      if (onSuccess) onSuccess(code);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Gagal mengirim jadwal setoran.');
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
        {successCode ? (
          /* Success Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Jadwal Setoran Berhasil Dikonfirmasi!
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-md mx-auto">
                Notifikasi kedatangan Anda telah dikirim langsung ke dashboard pengelola{' '}
                <strong className="text-slate-800">{stop.recyclerName}</strong>.
              </p>
            </div>

            {/* Delivery Ticket Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Kode Antrean Masuk
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-mono font-black text-sm shadow-2xs">
                  {successCode}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Waktu Kedatangan:</span>
                  <span className="font-semibold text-slate-900">{arrivalTime}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimasi Payout:</span>
                  <span className="font-extrabold text-emerald-700">
                    Rp {stop.stopTotalValue.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Lokasi Gudang:</span>
                  <span className="font-medium text-slate-900 truncate max-w-[200px]" title={stop.address}>
                    {stop.address}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
            >
              Tutup & Selesai
            </button>
          </div>
        ) : (
          /* Form Screen */
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Jadwalkan Setoran ke Pengelola
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate max-w-[280px]">
                    {stop.recyclerName}
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

            {errorText && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {errorText}
              </div>
            )}

            <form onSubmit={handleSubmit} className="pt-4 space-y-3.5 text-xs">
              {/* Material Allocation Summary */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">Sampah yang Anda Setorkan:</span>
                  <span className="font-extrabold text-emerald-700">
                    Est. Rp {stop.stopTotalValue.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] space-y-0.5 pt-0.5">
                  {stop.materials.map((m, i) => (
                    <div key={i} className="flex justify-between">
                      <span>• {m.categoryName} ({m.quantity} {m.unit})</span>
                      <span className="font-medium text-slate-800">Rp {m.estimatedValue.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Nama Lengkap Warga / Pengirim <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Nomor Kontak / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Estimasi Waktu Kedatangan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-semibold text-slate-900"
                  >
                    <option value="Hari Ini (10:00 - 12:00 WIB)">Hari Ini (10:00 - 12:00 WIB)</option>
                    <option value="Hari Ini (13:00 - 15:00 WIB)">Hari Ini (13:00 - 15:00 WIB)</option>
                    <option value="Hari Ini (15:00 - 17:00 WIB)">Hari Ini (15:00 - 17:00 WIB)</option>
                    <option value="Besok Pagi (09:00 - 11:00 WIB)">Besok Pagi (09:00 - 11:00 WIB)</option>
                    <option value="Besok Siang (13:00 - 15:00 WIB)">Besok Siang (13:00 - 15:00 WIB)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Catatan untuk Pengelola (Opsional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Bawa pakai karung bersih, motor beat putih."
                    className="w-full p-2.5 pl-9 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition text-slate-900"
                  />
                </div>
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
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>Kirim Jadwal Setoran</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
