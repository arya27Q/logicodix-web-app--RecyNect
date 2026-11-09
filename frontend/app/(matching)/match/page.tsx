'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WasteItemInputRow } from '@/components/matching/WasteItemInput';
import { PrioritySelector } from '@/components/matching/PrioritySelector';
import { MatchingItemInput, MatchingPriority, WasteCategory } from '@/types';
import { apiClient } from '@/lib/api-client';
import {
  MapPin,
  Plus,
  ArrowRight,
  Sparkles,
  Info,
  Navigation,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

// Default master categories fallback jika API backend belum dijalankan
const FALLBACK_CATEGORIES: WasteCategory[] = [
  { id: 'cat-kardus', name: 'Kardus / Karton Cokelat', unit: 'kg', isActive: true },
  { id: 'cat-pet', name: 'Botol Plastik PET Bening', unit: 'kg', isActive: true },
  { id: 'cat-minyak', name: 'Minyak Jelantah', unit: 'liter', isActive: true },
  { id: 'cat-alum', name: 'Kaleng Aluminium / Soft Drink', unit: 'kg', isActive: true },
  { id: 'cat-hvs', name: 'Kertas HVS / Buku Dokumen', unit: 'kg', isActive: true },
  { id: 'cat-besi', name: 'Besi Tua / Logam Campur', unit: 'kg', isActive: true },
];

export default function MatchPage() {
  const router = useRouter();

  // State Categories & Items
  const [categories, setCategories] = useState<WasteCategory[]>(FALLBACK_CATEGORIES);
  const [items, setItems] = useState<MatchingItemInput[]>([
    { categoryId: 'cat-kardus', quantity: 10, unit: 'kg', condition: 'Kering dan diikat' },
    { categoryId: 'cat-pet', quantity: 5, unit: 'kg', condition: 'Bersih tanpa tutup botol' },
  ]);

  // State Location & Priority
  const [latitude, setLatitude] = useState<number>(-6.914744); // Default Bandung
  const [longitude, setLongitude] = useState<number>(107.60981);
  const [addressLabel, setAddressLabel] = useState<string>('Pusat Kota Bandung (Default Simulasi)');
  const [priority, setPriority] = useState<MatchingPriority>('balanced');
  const [radiusKm, setRadiusKm] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationSuccess, setLocationSuccess] = useState<boolean>(false);

  // Load real categories from backend on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await apiClient<WasteCategory[]>('/waste');
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        // Gunakan fallback dummy categories
      }
    }
    loadCategories();
  }, []);

  // GPS Browser Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Fitur Geolocation tidak didukung oleh browser Anda.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setAddressLabel(
          `Koordinat Terdeteksi (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`
        );
        setIsLocating(false);
        setLocationSuccess(true);
      },
      (error) => {
        setIsLocating(false);
        alert(`Gagal mengambil lokasi GPS: ${error.message}. Menggunakan titik default.`);
      },
      { timeout: 10000 }
    );
  };

  // Quick Add Tag Pill
  const handleQuickAdd = (catId: string) => {
    if (items.length >= 5) {
      alert('Maksimal 5 jenis sampah dalam 1 sesi pencocokan.');
      return;
    }
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;

    // Cek jika kategori sudah ada
    const existing = items.find((i) => i.categoryId === catId);
    if (existing) {
      alert(`Material "${cat.name}" sudah ada dalam daftar input Anda.`);
      return;
    }

    setItems([...items, { categoryId: cat.id, quantity: 5, unit: cat.unit, condition: '' }]);
  };

  // Row Item Updates
  const handleItemChange = (index: number, updated: MatchingItemInput) => {
    const newItems = [...items];
    newItems[index] = updated;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      alert('Minimal masukkan 1 jenis sampah untuk dicocokkan.');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    if (items.length >= 5) {
      alert('Maksimal 5 jenis sampah dalam 1 sesi pencocokan.');
      return;
    }
    setItems([...items, { categoryId: '', quantity: 1, unit: 'kg', condition: '' }]);
  };

  // Form Submit to Matching Engine
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    const invalidItem = items.find((i) => !i.categoryId || i.quantity <= 0);
    if (invalidItem) {
      alert('Mohon pilih jenis sampah dan masukkan kuantitas yang valid (lebih dari 0).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Kirim request ke backend API
      const result = await apiClient<{ sessionId: string }>('/matching', {
        method: 'POST',
        body: JSON.stringify({
          latitude,
          longitude,
          priority,
          searchRadiusKm: radiusKm,
          items,
        }),
      });

      router.push(`/match/results/${result.sessionId}`);
    } catch (err) {
      // Jika backend belum aktif, arahkan ke demo session ID
      const demoSessionId = 'demo-session-' + Date.now().toString().slice(-6);
      router.push(`/match/results/${demoSessionId}?priority=${priority}&radius=${radiusKm}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Total Estimasi Kuantitas
  const totalWeight = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const formattedWeight = totalWeight % 1 === 0 ? totalWeight.toString() : totalWeight.toFixed(1);
  const distinctUnits = Array.from(new Set(items.map((i) => i.unit || 'kg')));
  const unitLabel = distinctUnits.length === 1 ? distinctUnits[0] : 'kg/L';

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
            {/* Quick Add Tag Bar (Comfortable spacing & refined buttons) */}
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
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
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
                {locationSuccess && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" /> GPS Aktif
                  </span>
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <p className="font-semibold text-slate-900">{addressLabel}</p>
                <p className="text-[11px] text-slate-500 tabular-nums">
                  Latitude: {latitude.toFixed(6)} • Longitude: {longitude.toFixed(6)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold shadow-2xs hover:bg-slate-50 transition"
              >
                <Navigation className={`w-3.5 h-3.5 text-sky-600 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Mendeteksi Posisi Anda...' : 'Perbarui Lewat GPS Browser'}</span>
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
    </div>
  );
}
