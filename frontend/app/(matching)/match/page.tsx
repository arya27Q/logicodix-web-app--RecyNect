'use client';

import React from 'react';
import Link from 'next/link';
import { WasteItemInputRow } from '@/components/user/WasteItemInput';
import { PrioritySelector } from '@/components/user/PrioritySelector';
import { useMatchingForm } from '@/hooks/user/useMatchingForm';
import {
  MapPin,
  Plus,
  ArrowRight,
  Sparkles,
  Info,
  Navigation,
  CheckCircle2,
  Lock,
  X,
  UserCheck,
} from 'lucide-react';

export default function MatchPage() {
  const {
    categories,
    items,
    priority,
    setPriority,
    radiusKm,
    setRadiusKm,
    isSubmitting,
    isAuthModalOpen,
    setIsAuthModalOpen,
    geo,
    formattedWeight,
    unitLabel,
    handleQuickAdd,
    handleItemChange,
    handleRemoveItem,
    handleAddItem,
    handleSubmit,
  } = useMatchingForm();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Formulir Pencocokan Sampah
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Masukkan jenis dan estimasi bobot sampah Anda. Sistem akan mencari kombinasi pengelola terbaik.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Multi-Stop Smart Engine Aktif</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ============================================================== */}
          {/* LEFT COLUMN: Input Material (7 Cols)                           */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Add Tag Bar */}
            <div className="space-y-3 pb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tambah Cepat Jenis Sampah Populer:
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 5).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleQuickAdd(cat.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/60 transition shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{cat.name.split('/')[0].trim()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* List of Material Input Rows */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h3
                  suppressHydrationWarning
                  className="text-sm font-bold text-slate-900 uppercase tracking-wider"
                >
                  Daftar Sampah yang Disetor ({items.length}/5)
                </h3>
                <span className="text-xs text-slate-500">Maksimal 5 jenis sekaligus</span>
              </div>

              {items.map((item, idx) => (
                <WasteItemInputRow
                  key={idx}
                  index={idx}
                  item={item}
                  categories={categories}
                  onChange={handleItemChange}
                  onRemove={handleRemoveItem}
                  disableRemove={items.length === 1}
                />
              ))}

              {items.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/40 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Jenis Sampah Lain</span>
                </button>
              )}
            </div>

            {/* Notice regarding weight & verification */}
            <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <p>
                <strong>Tips Akurasi:</strong> Masukkan estimasi berat yang realistis. Jika sampah Anda belum memenuhi
                minimum setoran salah satu pengelola (misal pabrik butuh min 50 kg), sistem otomatis menyarankan Bank
                Sampah atau Pengepul terdekat.
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: Lokasi, Prioritas & Submit (5 Cols)              */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 space-y-6">
            {/* Lokasi Penjemputan / Setoran */}
            <div className="card-surface rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Titik Lokasi Keberangkatan Anda
                </span>
                {geo.locationSuccess && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" /> GPS Aktif
                  </span>
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <p className="font-semibold text-slate-900">{geo.locationName}</p>
                <p className="text-[11px] text-slate-500 tabular-nums">
                  Latitude: {geo.latitude.toFixed(6)} • Longitude: {geo.longitude.toFixed(6)}
                </p>
              </div>

              <button
                type="button"
                onClick={geo.requestLocation}
                disabled={geo.isLocating}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold shadow-2xs hover:bg-slate-50 transition"
              >
                <Navigation className={`w-3.5 h-3.5 text-sky-600 ${geo.isLocating ? 'animate-spin' : ''}`} />
                <span>{geo.isLocating ? 'Mendeteksi Posisi Anda...' : 'Perbarui Lewat GPS Browser'}</span>
              </button>

              {/* Radius Pencarian */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Radius Maksimal Pencarian:</span>
                  <span className="text-emerald-700 font-bold tabular-nums">{radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5 km (Lokal)</span>
                  <span>30 km (Default)</span>
                  <span>50 km (Industri Luas)</span>
                </div>
              </div>
            </div>

            {/* Selector Prioritas */}
            <div className="card-surface rounded-2xl p-5">
              <PrioritySelector value={priority} onChange={setPriority} />
            </div>

            {/* Summary & Submit Card */}
            <div className="card-elevated rounded-2xl p-5 bg-gradient-to-b from-white to-slate-50 border-emerald-200/80 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-3 border-b border-slate-200">
                <span>Total Sampah Terdaftar:</span>
                <span className="text-sm font-extrabold text-emerald-700 tabular-nums">
                  {items.length} Jenis ± {formattedWeight} {unitLabel}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Menghitung Rute & Harga...</span>
                ) : (
                  <>
                    <span>Cari Rekomendasi Terbaik</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-500">
                Perhitungan mencakup perbandingan harga, minimum setoran, dan optimasi tempat singgah.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* ============================================================== */}
      {/* MODAL: Login Warga Diperlukan Sebelum Memproses Matching        */}
      {/* ============================================================== */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Tutup dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon & Title */}
            <div className="space-y-3 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Masuk ke Akun Warga
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Untuk mencari rekomendasi rute terbaik, mendapatkan transparansi harga resmi, dan menyimpan riwayat setoran, silakan masuk ke akun Anda.
              </p>
            </div>

            {/* Saved Input Notice */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Data <strong>{items.length} jenis sampah (± {formattedWeight} {unitLabel})</strong> yang Anda input sudah tersimpan otomatis dan tidak akan hilang.
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <Link
                href="/login?redirect=/match"
                className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 text-center"
              >
                <span>Masuk ke Akun Warga</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register?redirect=/match"
                className="w-full py-3 px-5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm transition flex items-center justify-center gap-2 text-center"
              >
                <UserCheck className="w-4 h-4 text-slate-500" />
                <span>Belum Punya Akun? Daftar Baru</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
