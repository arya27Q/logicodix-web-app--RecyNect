'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { RouteVisualizer } from '@/components/maps/RouteVisualizer';
import { ScheduleDeliveryModal } from '@/components/matching/ScheduleDeliveryModal';
import { MatchingAlternative, MatchingSessionResult, StopAllocation } from '@/types';
import { apiClient } from '@/lib/api-client';
import {
  Sparkles,
  ArrowLeft,
  Share2,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Layers,
  TrendingUp,
  Clock,
  ShieldCheck,
  Truck,
} from 'lucide-react';

// Demo realistic simulation alternatives for immediate testing & presentation
const DEMO_ALTERNATIVES: MatchingAlternative[] = [
  {
    rank: 1,
    totalValue: 43500,
    totalDistanceKm: 4.8,
    totalStops: 2,
    economyScore: 92.5,
    distanceScore: 84.0,
    stopsScore: 75.0,
    finalScore: 86.8,
    unmatchedItems: [],
    stops: [
      {
        recyclerId: 'rec-pengepul-1',
        recyclerName: 'Pengepul Logam & Plastik Jaya Abadi',
        managementType: 'pengepul',
        address: 'Jl. Raya Kopo No. 88, Bandung',
        contact: '085712348899',
        isDemo: true,
        latitude: -6.932451,
        longitude: 107.592143,
        distanceKm: 2.1,
        stopTotalValue: 21000,
        materials: [
          {
            categoryId: 'cat-pet',
            categoryName: 'Botol Plastik PET Bening',
            quantity: 5,
            unit: 'kg',
            pricePerUnit: 4200,
            estimatedValue: 21000,
            minQuantity: 3.0,
            qualityRequirements: 'Bersih, tanpa kotoran tanah/tutup botol dilepas',
          },
        ],
      },
      {
        recyclerId: 'rec-banksampah-1',
        recyclerName: 'Bank Sampah Berkah Mandiri',
        managementType: 'bank_sampah',
        address: 'Jl. Merdeka No. 12, Kel. Sukajaya, Bandung',
        contact: '081298765432',
        isDemo: true,
        latitude: -6.914744,
        longitude: 107.60981,
        distanceKm: 2.7,
        stopTotalValue: 22500,
        materials: [
          {
            categoryId: 'cat-kardus',
            categoryName: 'Kardus / Karton Cokelat',
            quantity: 10,
            unit: 'kg',
            pricePerUnit: 2000,
            estimatedValue: 20000,
            minQuantity: 1.0,
            qualityRequirements: 'Kering, bersih dari staples tebal, diikat rapi',
          },
          {
            categoryId: 'cat-minyak',
            categoryName: 'Minyak Jelantah',
            quantity: 2,
            unit: 'liter',
            pricePerUnit: 6500,
            estimatedValue: 13000,
            minQuantity: 1.0,
            qualityRequirements: 'Disaring dari sisa remah makanan, jeriken tertutup',
          },
        ],
      },
    ],
  },
  {
    rank: 2,
    totalValue: 37000,
    totalDistanceKm: 2.1,
    totalStops: 1,
    economyScore: 78.0,
    distanceScore: 95.0,
    stopsScore: 100.0,
    finalScore: 84.5,
    unmatchedItems: [
      {
        categoryId: 'cat-minyak',
        categoryName: 'Minyak Jelantah',
        quantity: 2,
        unit: 'liter',
        reason: 'Pengelola ini tidak menerima jenis material minyak jelantah.',
      },
    ],
    stops: [
      {
        recyclerId: 'rec-pengepul-1',
        recyclerName: 'Pengepul Logam & Plastik Jaya Abadi',
        managementType: 'pengepul',
        address: 'Jl. Raya Kopo No. 88, Bandung',
        contact: '085712348899',
        isDemo: true,
        latitude: -6.932451,
        longitude: 107.592143,
        distanceKm: 2.1,
        stopTotalValue: 37000,
        materials: [
          {
            categoryId: 'cat-pet',
            categoryName: 'Botol Plastik PET Bening',
            quantity: 5,
            unit: 'kg',
            pricePerUnit: 4200,
            estimatedValue: 21000,
            minQuantity: 3.0,
          },
          {
            categoryId: 'cat-kardus',
            categoryName: 'Kardus / Karton Cokelat',
            quantity: 10,
            unit: 'kg',
            pricePerUnit: 1600,
            estimatedValue: 16000,
            minQuantity: 5.0,
          },
        ],
      },
    ],
  },
];

function MatchResultsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = (params?.sessionId as string) || 'sesi-demo';
  const priorityParam = searchParams.get('priority') || 'balanced';

  const [loading, setLoading] = useState<boolean>(true);
  const [alternatives, setAlternatives] = useState<MatchingAlternative[]>(DEMO_ALTERNATIVES);
  const [selectedRank, setSelectedRank] = useState<number>(1);
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);
  const [schedulingStop, setSchedulingStop] = useState<StopAllocation | null>(null);

  // Fetch results from backend if available
  useEffect(() => {
    async function fetchSession() {
      try {
        const data = await apiClient<MatchingSessionResult>(`/matching/${sessionId}`);
        if (data && data.alternatives && data.alternatives.length > 0) {
          setAlternatives(data.alternatives);
        }
      } catch (err) {
        // Gunakan DEMO_ALTERNATIVES
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [sessionId]);

  const currentAlternative = alternatives.find((a) => a.rank === selectedRank) || alternatives[0];

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Status Bar */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/match"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Form Input</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hasil Rekomendasi Rute & Pengelola
            </h1>
            <p className="text-xs text-slate-500">
              Sesi {sessionId} • Prioritas:{' '}
              <span className="font-semibold text-slate-800 capitalize">{priorityParam.replace('_', ' ')}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Tautan hasil rute disalin ke clipboard!');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan Rute</span>
            </button>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {alternatives.length} Opsi Solusi Ditemukan
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Desktop Grid (50% / 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: Alternative Cards & Stops Details (6 Cols)        */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 space-y-6">
          {/* Alternative Switcher Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {alternatives.map((alt) => {
              const isSelected = alt.rank === selectedRank;
              return (
                <button
                  key={alt.rank}
                  type="button"
                  onClick={() => {
                    setSelectedRank(alt.rank);
                    setActiveStopIndex(0);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>Opsi {alt.rank}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Rp {alt.totalValue.toLocaleString('id-ID')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Alternative Main Card */}
          <div
            className={`card-elevated rounded-2xl p-6 bg-white border-2 transition-all ${
              currentAlternative.rank === 1 ? 'border-amber-400' : 'border-slate-200'
            }`}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                    currentAlternative.rank === 1
                      ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {currentAlternative.rank === 1 ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>Rekomendasi Utama (1)</span>
                    </>
                  ) : (
                    <span>Alternatif Pilihan {currentAlternative.rank}</span>
                  )}
                </span>
                {currentAlternative.totalStops === 1 && (
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    1 Lokasi Saja (Paling Praktis)
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Skor Kecocokan</span>
                <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                  {currentAlternative.finalScore.toFixed(1)} / 100
                </span>
              </div>
            </div>

            {/* Total Value & Key Logistics */}
            <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50/60 to-emerald-50/30 border border-amber-200/90">
              <span className="text-xs font-semibold text-amber-900 block">Estimasi Total Pendapatan</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">
                  Rp {currentAlternative.totalValue.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-amber-200/60 text-xs">
                <div>
                  <span className="text-slate-500 block">Jumlah Titik Singgah:</span>
                  <span className="font-bold text-slate-900">{currentAlternative.totalStops} Tempat Pengelola</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Estimasi Jarak Tempuh:</span>
                  <span className="font-bold text-slate-900">{currentAlternative.totalDistanceKm.toFixed(1)} km Total</span>
                </div>
              </div>
            </div>

            {/* Breakdown per Stop */}
            <div className="mt-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Rincian Tempat Singgah & Penjualan Sampah:
              </h3>

              {currentAlternative.stops.map((stop, sIdx) => (
                <div
                  key={stop.recyclerId}
                  onClick={() => setActiveStopIndex(sIdx)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all ${
                    activeStopIndex === sIdx
                      ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-500/30'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{stop.recyclerName}</h4>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                            {stop.managementType.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{stop.address}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-emerald-700 tabular-nums">
                        Rp {stop.stopTotalValue.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[11px] text-slate-400 block">{stop.distanceKm.toFixed(1)} km</span>
                    </div>
                  </div>

                  {/* Materials list inside this stop */}
                  <div className="mt-3 pt-3 border-t border-slate-200/70 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-600">Material yang Disetor ke Lokasi Ini:</p>
                    {stop.materials.map((mat) => (
                      <div
                        key={mat.categoryId}
                        className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200"
                      >
                        <div>
                          <span className="font-semibold text-slate-800">{mat.categoryName}</span>
                          <span className="text-slate-500 ml-1">
                            ({mat.quantity} {mat.unit} @ Rp {mat.pricePerUnit.toLocaleString('id-ID')})
                          </span>
                          {mat.qualityRequirements && (
                            <p className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium mt-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Syarat Mutu: {mat.qualityRequirements}</span>
                            </p>
                          )}
                        </div>
                        <span className="font-bold text-slate-900 tabular-nums">
                          Rp {mat.estimatedValue.toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions for this stop */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-500 font-medium">Kontak: {stop.contact}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${stop.contact}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>Telepon</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setSchedulingStop(stop)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xs transition active:scale-[0.99]"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Jadwalkan Setoran</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Unmatched items warning */}
            {currentAlternative.unmatchedItems && currentAlternative.unmatchedItems.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Material Belum Tertampung pada Opsi Ini:</span>
                </div>
                {currentAlternative.unmatchedItems.map((u) => (
                  <div key={u.categoryId} className="text-xs text-amber-800 ml-6">
                    • <strong>{u.categoryName}</strong> ({u.quantity} {u.unit}): {u.reason}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Interactive Sticky Map Canvas (6 Cols)           */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
          <RouteVisualizer
            userLocation={{ latitude: -6.914744, longitude: 107.60981, label: 'Lokasi Anda' }}
            stops={currentAlternative.stops}
            activeStopIndex={activeStopIndex}
            onSelectStop={setActiveStopIndex}
          />

          {/* Transparency & Disclaimer Box */}
          <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transparansi Harga & Ketentuan Daur Ulang</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Harga di atas adalah estimasi indikatif berdasarkan pembaruan data terakhir dari masing-masing mitra.
              Pastikan sampah memenuhi standar kebersihan yang disyaratkan saat penimbangan di lokasi.
            </p>
          </div>
        </div>
      </div>

      {/* Citizen Schedule Delivery Modal */}
      <ScheduleDeliveryModal
        isOpen={Boolean(schedulingStop)}
        stop={schedulingStop}
        sessionId={sessionId}
        onClose={() => setSchedulingStop(null)}
      />
    </div>
  );
}

export default function MatchResultsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Menghitung optimasi rute dan perbandingan harga...</p>
        </div>
      }
    >
      <MatchResultsContent />
    </React.Suspense>
  );
}
