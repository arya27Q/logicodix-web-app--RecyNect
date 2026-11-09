'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  FileText,
  ArrowLeft,
  Warehouse,
} from 'lucide-react';

export default function RecyclerForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [nib, setNib] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nib) {
      alert('Mohon masukkan email resmi usaha dan NIB terdaftar.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 700);
  };

  return (
    <div className="card-elevated rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* ============================================================== */}
      {/* LEFT COLUMN: Visual Photographic Showcase Panel (Desktop)      */}
      {/* ============================================================== */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 text-white min-h-[540px] overflow-hidden group">
        {/* Real Industrial Recovery Photography */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
          alt="Operasional Fasilitas Daur Ulang Berstandar Tinggi"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 brightness-[0.35]"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60"></div>
        <div className="absolute inset-0 bg-amber-950/20 mix-blend-overlay"></div>

        {/* Content Top */}
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Pemulihan Akses Akun Kemitraan</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white leading-snug">
            Keamanan Data Operasional & Finansial Mitra
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Untuk melindungi data riwayat transaksi timbangan dan saldo pencairan, pemulihan akun memerlukan pencocokan ganda antara email resmi dan Nomor Induk Berusaha (NIB).
          </p>
        </div>

        {/* Content Middle */}
        <div className="relative z-10 space-y-2.5 py-6">
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Verifikasi NIB Terdaftar di Database Kementerian</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Tautan Reset Berlaku 15 Menit dengan Token Sekali Pakai</span>
          </div>
        </div>

        {/* Content Bottom */}
        <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-slate-400">
          Butuh bantuan langsung tim IT Support RecyNect? Hubungi hotline +62 811-RECYNECT.
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Password Recovery Form                           */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
        <Link
          href="/recycler/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition mb-6 w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Masuk Mitra</span>
        </Link>

        {isSubmitted ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Tautan Reset Telah Dikirim
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kami telah mengirimkan instruksi pemulihan kata sandi ke email{' '}
              <strong className="text-slate-900">{email}</strong> yang cocok dengan data NIB{' '}
              <strong className="text-slate-900">{nib}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">Langkah selanjutnya:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Buka kotak masuk atau folder spam email resmi usaha Anda.</li>
                <li>Klik tombol verifikasi dalam waktu maksimal 15 menit.</li>
                <li>Buat kata sandi baru dan perbarui PIN otorisasi timbangan.</li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href="/recycler/login"
                className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition flex items-center justify-center gap-2"
              >
                <span>Kembali Masuk ke Console Mitra</span>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md mb-2 border border-amber-200/60">
                <Warehouse className="w-3.5 h-3.5 text-amber-600" />
                <span>Pemulihan Sandi Pengelola</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Lupa Sandi Akun Mitra?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Masukkan email usaha dan NIB fasilitas Anda untuk menerima tautan pemulihan aman.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Email Resmi Mitra <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@perusahaan-daurulang.co.id"
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nomor Induk Berusaha (NIB) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={nib}
                    onChange={(e) => setNib(e.target.value)}
                    placeholder="13 Digit Nomor NIB"
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 mt-3"
              >
                {isLoading ? (
                  <span>Memvalidasi Data Mitra...</span>
                ) : (
                  <>
                    <span>Kirim Tautan Pemulihan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
              Ingat kata sandi akun?{' '}
              <Link
                href="/recycler/login"
                className="font-bold text-amber-700 hover:text-amber-800 transition underline ml-1"
              >
                Masuk ke Console
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
