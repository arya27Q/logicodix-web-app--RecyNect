'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Package,
  MapPin,
  Scale,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const InteractiveBannerCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      badge: 'LANGKAH 01 • PEMILAHAN RUMAH',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      title: 'Pilah Sampah Bernilai di Rumah: Kardus, Botol PET, & Jelantah',
      description:
        'Kumpulkan material daur ulang kering tanpa tercampur sampah organik atau cairan sisa. Pemilahan yang bersih langsung meningkatkan penawaran harga beli dari mitra pengelola resmi.',
      ctaText: 'Mulai Hitung Sampah Anda',
      ctaHref: '/match',
      visual: (
        <div className="w-full space-y-3">
          {/* Large High-Res Photo Container */}
          <div className="relative h-64 sm:h-80 md:h-[360px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-md group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80"
              alt="Pemilahan sampah kardus dan botol plastik bersih"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/35 to-transparent"></div>

            <div className="absolute top-4 left-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-white bg-emerald-600/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-400/40 shadow-xs">
                Foto Riil: Pemilahan Terpisah
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-extrabold text-base sm:text-lg text-white drop-shadow-xs">
                Kardus & Botol Plastik PET Bersih
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Kering, tanpa sampah basah, siap ditimbang dengan nilai rupiah tertinggi
              </p>
            </div>
          </div>

          {/* Quick Step Indicators */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs font-medium">
              <span className="text-[10px] font-black text-amber-600 block">KARDUS BOKS</span>
              <p className="font-bold text-slate-900 mt-0.5">Lipat & Ikat Rapi</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs font-medium">
              <span className="text-[10px] font-black text-emerald-600 block">BOTOL PET</span>
              <p className="font-bold text-slate-900 mt-0.5">Pipihkan & Bersihkan</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs font-medium">
              <span className="text-[10px] font-black text-sky-600 block">JELANTAH</span>
              <p className="font-bold text-slate-900 mt-0.5">Jerigen / Botol Rapat</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      badge: 'LANGKAH 02 • PENIMBANGAN TRANSPARAN',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      title: 'Penimbangan Digital Bebas Calo & Harga Resmi Terbuka',
      description:
        'Timbang di hadapan Anda dengan timbangan digital terkalibrasi resmi. Mitra RecyNect terikat SOP transparansi tanpa selisih timbangan atau potongan terselubung.',
      ctaText: 'Cek Direktori Harga Pasar',
      ctaHref: '/recyclers',
      visual: (
        <div className="w-full space-y-3">
          {/* Large High-Res Photo Container */}
          <div className="relative h-64 sm:h-80 md:h-[360px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-md group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=1200&q=80"
              alt="Fasilitas penimbangan daur ulang terverifikasi"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/35 to-transparent"></div>

            <div className="absolute top-4 left-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-white bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-xs">
                Mitra Resmi Terverifikasi GPS
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-extrabold text-base sm:text-lg text-white drop-shadow-xs">
                Penimbangan Digital Akurat & Terbuka
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Standar nota resmi dan pembayaran langsung cair di tempat
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Botol Plastik PET</p>
                <span className="text-[10px] text-slate-500">Pengepul Jaya</span>
              </div>
              <span className="text-xs font-black text-emerald-700 tabular-nums">Rp 4.200/kg</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Kardus & Karton</p>
                <span className="text-[10px] text-slate-500">Bank Sampah RW</span>
              </div>
              <span className="text-xs font-black text-amber-700 tabular-nums">Rp 2.500/kg</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      badge: 'LANGKAH 03 • DIREKTORI 4 KATEGORI',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      title: 'Bandingkan Penawaran dari Bank Sampah, Pengepul, hingga Pabrik',
      description:
        'Sistem menampilkan daftar harga terkini dari 4 kategori mitra resmi berizin. Ketahui langsung siapa yang membeli kardus atau botol Anda dengan harga rupiah tertinggi hari ini.',
      ctaText: 'Jelajahi Mitra Pengelola',
      ctaHref: '/recyclers',
      visual: (
        <div className="w-full space-y-3">
          {/* Large High-Res Photo Container */}
          <div className="relative h-64 sm:h-80 md:h-[360px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-md group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80"
              alt="Gudang penyimpanan dan pengumpulan material daur ulang"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/35 to-transparent"></div>

            <div className="absolute top-4 left-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-white bg-indigo-700/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-400/30 shadow-xs">
                Katalog Pengelola Lengkap
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-extrabold text-base sm:text-lg text-white drop-shadow-xs">
                Akses Langsung ke Pengepul & Pabrik Peleburan
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Dapatkan harga tangan pertama untuk kuantitas setoran lebih besar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Minyak Jelantah</p>
                <span className="text-[10px] text-slate-500">Pabrik Biodiesel</span>
              </div>
              <span className="text-xs font-black text-amber-700 tabular-nums">Rp 7.500/L</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Kaleng Aluminium</p>
                <span className="text-[10px] text-slate-500">Pengepul Logam</span>
              </div>
              <span className="text-xs font-black text-emerald-700 tabular-nums">Rp 14.000/kg</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      badge: 'LANGKAH 04 • OPTIMASI RUTE MULTI-STOP',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      title: 'Kalkulasi Rute Cerdas: Sekali Jalan, Semua Sampah Laku',
      description:
        'Punya berbagai jenis sampah bernilai? Algoritma RecyNect mengurutkan lokasi singgah paling hemat bahan bakar agar Anda tidak bolak-balik dan memaksimalkan cuan bersih.',
      ctaText: 'Coba Rute Multi-Stop',
      ctaHref: '/match',
      visual: (
        <div className="w-full space-y-3">
          {/* Large High-Res Photo Container */}
          <div className="relative h-64 sm:h-80 md:h-[360px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-md group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80"
              alt="Logistik pengumpulan dan rute daur ulang efisien"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/35 to-transparent"></div>

            <div className="absolute top-4 left-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-white bg-sky-600/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-sky-400/40 shadow-xs">
                Simulasi Rute Paling Hemat
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-extrabold text-base sm:text-lg text-white drop-shadow-xs">
                2 Titik Singgah • Hemat Jarak 4.8 km
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Kombinasi terbaik antara waktu perjalanan dan penerimaan rupiah bersih
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Estimasi Total Pendapatan Bersih:</span>
            <span className="font-black text-slate-900 text-sm tabular-nums">Rp 43.500</span>
          </div>
        </div>
      ),
    },
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-100/70 via-slate-50 to-emerald-50/30 p-6 sm:p-10 shadow-sm overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Slide Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[220px]">
        {/* Left: Text & CTA */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border tracking-wider ${slides[currentSlide].badgeColor}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {slides[currentSlide].badge}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Layar {currentSlide + 1} dari {slides.length}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {slides[currentSlide].title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
            {slides[currentSlide].description}
          </p>

          <div className="pt-2">
            <Link
              href={slides[currentSlide].ctaHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs hover:shadow transition-all active:scale-[0.98]"
            >
              <span>{slides[currentSlide].ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right: Rich Interactive Visual */}
        <div className="lg:col-span-6 flex items-center justify-center">
          {slides[currentSlide].visual}
        </div>
      </div>

      {/* Carousel Controls (Arrows & Dots) */}
      <div className="relative z-10 mt-8 pt-4 border-t border-slate-200/60 flex items-center justify-between">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-emerald-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Arrow buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs transition"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs transition"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

