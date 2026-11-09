import React, { Suspense } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InteractiveBannerCarousel } from '@/components/ui/InteractiveBannerCarousel';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Scale,
  Milestone,
  CheckCircle2,
  Package,
  Wine,
  Droplets,
  Layers,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Suspense fallback={<div className="h-20 border-b border-slate-200 bg-[#faf9f6]" />}>
        <Navbar />
      </Suspense>

      <main className="flex-1 w-full">
        {/* ============================================================== */}
        {/* 1. HERO SECTION (Clean, Minimalist Centered Layout)           */}
        {/* ============================================================== */}
        <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-200/70 bg-gradient-to-b from-[#faf9f6] via-white to-[#faf9f6]/80 text-center">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
            {/* Expressive Heading (Clean, Normal Bold) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.18] max-w-4xl mx-auto">
              Optimalkan Nilai Sampah{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-emerald-800 to-emerald-600">
                Daur Ulang Anda
                <span className="absolute bottom-1 left-0 w-full h-[3px] bg-emerald-500/30 rounded-full"></span>
              </span>{' '}
              dalam Sekali Jalan.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Hubungkan kardus, botol plastik, minyak jelantah, dan logam Anda dengan mitra pengelola
              terverifikasi. Dapatkan transparansi harga beli tertinggi, rute terdekat, dan kombinasi
              lokasi singgah paling hemat.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/match"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-slate-900 px-7 py-3.5 text-base font-bold text-white shadow-sm hover:bg-emerald-600 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>Mulai Pencocokan Sampah</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/recyclers"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-2xs"
              >
                Lihat Direktori Pengelola
              </Link>
            </div>

            {/* Trust bullets */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Transparansi Harga Resmi
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verifikasi Koordinat GPS Mitra
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tanpa Calo & Bebas Biaya
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. STATS BAR                                                   */}
        {/* ============================================================== */}
        <section className="border-b border-slate-200/80 bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">4 Kategori</p>
                <p className="text-xs text-slate-500 font-medium">Bank Sampah, Pengepul, TPS3R, Pabrik</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums">100% Terbuka</p>
                <p className="text-xs text-slate-500 font-medium">Transparansi Harga & Syarat Mutu</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">Multi-Stop</p>
                <p className="text-xs text-slate-500 font-medium">Optimasi Kombinasi Tempat Singgah</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 tabular-nums">Cuan Maksimal</p>
                <p className="text-xs text-slate-500 font-medium">Perbandingan Nilai Rupiah Tertinggi</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. INTERACTIVE BANNER SLIDER (Visual Alur Geser)                */}
        {/* ============================================================== */}
        <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Panduan Interaktif</h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Eksplorasi Fitur Unggulan RecyNect</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Gunakan tombol panah untuk menggeser kartu panduan ➔
            </span>
          </div>

          <InteractiveBannerCarousel />
        </section>

        {/* ============================================================== */}
        {/* 4. BENTO VALUE PILLARS                                         */}
        {/* ============================================================== */}
        <section className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                Keunggulan Sistem
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Mengapa Menggunakan Mesin Pencocokan RecyNect?
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Menghilangkan kebingungan masyarakat saat memilah dan menyetorkan sampah daur ulang.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="card-surface rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Input Sekaligus Hingga 5 Jenis</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Tidak perlu memilah dan mencari pembeli satu demi satu. Masukkan kardus, botol plastik, kertas putih,
                    dan minyak jelantah Anda dalam satu formulir pencarian.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <span>Mendukung multi-material simultan</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="card-surface rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Pilihan Prioritas yang Fleksibel</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Ingin pendapatan uang tertinggi? Pilih prioritas <em>Highest Value</em>. Sedang terburu-buru?
                    Pilih opsi <em>Fewest Stops</em> untuk menyetor semuanya hanya ke satu tempat terdekat.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-amber-700 flex items-center gap-1">
                  <span>Trade-off cerdas berbasis algoritma</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="card-surface rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Mitra Beragam & Terverifikasi</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Bukan hanya bank sampah! RecyNect menghubungkan Anda dengan pengepul barang bekas, fasilitas TPS3R
                    kelurahan, hingga pabrik peleburan daur ulang.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-sky-700 flex items-center gap-1">
                  <span>Verifikasi izin & titik lokasi GPS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. BOTTOM CTA                                                  */}
        {/* ============================================================== */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-lg">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Punya Sampah Daur Ulang di Rumah?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Jangan buang sembarangan ke TPA. Cek potensi pendapatan rupiahnya dan temukan pengelola terdekat dalam hitungan detik.
              </p>
              <div className="pt-2">
                <Link
                  href="/match"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3.5 shadow transition-all active:scale-[0.98]"
                >
                  <span>Mulai Cocokkan Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
