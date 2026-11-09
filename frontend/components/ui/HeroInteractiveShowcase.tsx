'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Package,
  Wine,
  Droplets,
  Milestone,
  MapPin,
  Sparkles,
  ShieldCheck,
  Layers,
  CheckCircle2,
  Sliders,
  Scale,
} from 'lucide-react';

export const HeroInteractiveShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flow' | 'simulation'>('flow');
  const [flowStep, setFlowStep] = useState<number>(0);

  // Real Photographic steps for recycling workflow
  const steps = [
    {
      step: 1,
      badge: 'Langkah 1 • Pemilahan',
      title: 'Pilah Sampah Bernilai di Rumah',
      description: 'Kumpulkan kardus, botol plastik PET bersih, minyak jelantah, dan kaleng logam terpisah dari sampah organik basah.',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Pemilahan sampah kardus dan botol plastik daur ulang',
      tag: 'Kering & Terpilah',
    },
    {
      step: 2,
      badge: 'Langkah 2 • Optimasi Rute',
      title: 'Kalkulasi Otomatis Rute & Nilai Tertinggi',
      description: 'Algoritma cerdas membandingkan daftar harga beli mitra terdekat dan menyusun rute multi-stop paling hemat BBM.',
      imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Fasilitas daur ulang modern dan pengelolaan terverifikasi',
      tag: 'Harga Resmi Terbuka',
    },
    {
      step: 3,
      badge: 'Langkah 3 • Setor & Cuan',
      title: 'Timbang Akurat, Terima Cuan Langsung',
      description: 'Datangi mitra Bank Sampah atau Pengepul resmi. Timbangan digital transparan, bayaran langsung cair tanpa potongan calo.',
      imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Penimbangan dan transaksi daur ulang transparan',
      tag: 'Cair Tunai / QRIS',
    },
  ];

  const handlePrevStep = () => {
    setFlowStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  };

  const handleNextStep = () => {
    setFlowStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };

  const currentStep = steps[flowStep];

  return (
    <div className="card-elevated rounded-3xl p-5 sm:p-6 bg-white relative overflow-hidden border border-slate-200/90 shadow-sm">
      {/* Top Slide Switcher Toolbar (Clean Anti-Slop, No Emojis) */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/90 border border-slate-200/70 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('flow')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'flow'
                ? 'bg-white text-slate-900 font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Panduan Alur</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('simulation')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'simulation'
                ? 'bg-white text-slate-900 font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulasi Cepat</span>
          </button>
        </div>

        {/* Step Counter & Nav Buttons */}
        {activeTab === 'flow' ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">
              {flowStep + 1} / {steps.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition"
                aria-label="Langkah sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition"
                aria-label="Langkah selanjutnya"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            Demo Real-Time
          </span>
        )}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: PANDUAN DENGAN FOTO NYATA (Real Photography Carousel)   */}
      {/* ============================================================== */}
      {activeTab === 'flow' && (
        <div className="mt-4 space-y-4 animate-in fade-in duration-300">
          {/* Real Photo Card with Image Overlay */}
          <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentStep.imageUrl}
              alt={currentStep.imageAlt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                {currentStep.badge}
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-500/30">
                {currentStep.tag}
              </span>
            </div>

            {/* Bottom Caption inside Photo */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h4 className="font-extrabold text-sm sm:text-base tracking-tight leading-snug drop-shadow-xs">
                {currentStep.title}
              </h4>
              <p className="text-[11px] text-slate-200 line-clamp-2 mt-0.5 leading-normal opacity-90">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* 3 Step Interactive Progress Pills */}
          <div className="grid grid-cols-3 gap-2">
            {steps.map((st, idx) => (
              <button
                key={st.step}
                type="button"
                onClick={() => setFlowStep(idx)}
                className={`text-left p-2 rounded-xl border transition-all text-xs ${
                  flowStep === idx
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    flowStep === idx ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {st.step}
                  </span>
                  {flowStep === idx && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <p className="font-bold text-[11px] truncate mt-1">
                  {idx === 0 ? 'Pilah Sampah' : idx === 1 ? 'Hitung Rute' : 'Terima Uang'}
                </p>
              </button>
            ))}
          </div>

          <div className="pt-1">
            <Link
              href="/match"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-xs"
            >
              <span>Mulai Ikuti Alur Pencocokan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: SIMULASI CEPAT (Quick Live Calculation)                 */}
      {/* ============================================================== */}
      {activeTab === 'simulation' && (
        <div className="mt-4 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Hasil Rekomendasi Contoh
            </span>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              Peringkat 1 Terbaik
            </span>
          </div>

          {/* Clean Vector Badges (No Emojis) */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-slate-500">Material Sampah yang Disetor:</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-950 px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs">
                <Package className="w-3.5 h-3.5 text-amber-700" />
                <span>Kardus:</span>
                <strong className="text-slate-900 font-extrabold">10 kg</strong>
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                <Wine className="w-3.5 h-3.5 text-emerald-700" />
                <span>Botol PET:</span>
                <strong className="text-slate-900 font-extrabold">5 kg</strong>
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-sky-50 text-sky-950 px-2.5 py-1 rounded-lg border border-sky-200 shadow-2xs">
                <Droplets className="w-3.5 h-3.5 text-sky-700" />
                <span>Jelantah:</span>
                <strong className="text-slate-900 font-extrabold">2 L</strong>
              </span>
            </div>
          </div>

          {/* Estimated Value */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50/80 to-emerald-50/40 border border-amber-200/90 shadow-2xs">
            <span className="text-[11px] font-semibold text-amber-900">Estimasi Total Pendapatan</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">Rp 43.500</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Optimal
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-1.5 font-medium">
              <span className="flex items-center gap-1">
                <Milestone className="w-3.5 h-3.5 text-slate-500" /> 2 Titik Singgah
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> 4.8 km Rute
              </span>
            </div>
          </div>

          {/* Stops List */}
          <div className="space-y-1.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-900">Pengepul Jaya Abadi</p>
                  <p className="text-[11px] text-slate-500">5 kg Botol PET @ Rp 4.200</p>
                </div>
              </div>
              <span className="font-extrabold text-slate-800 tabular-nums">Rp 21.000</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900">Bank Sampah Berkah</p>
                  <p className="text-[11px] text-slate-500">10 kg Kardus + 2 L Jelantah</p>
                </div>
              </div>
              <span className="font-extrabold text-slate-800 tabular-nums">Rp 22.500</span>
            </div>
          </div>

          <div className="pt-1">
            <Link
              href="/match"
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition"
            >
              <span>Ubah & Hitung Sampah Anda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};


