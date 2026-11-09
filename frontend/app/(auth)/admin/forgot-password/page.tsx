'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LockKeyhole,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Mohon masukkan email dinas terdaftar.');
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
        {/* Real High-Resolution Photography */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80"
          alt="Keamanan Enkripsi Kredensial Administrator"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 brightness-[0.35]"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60"></div>
        <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay"></div>

        {/* Content Top */}
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Pemulihan Kredensial Terenkripsi</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white leading-snug">
            Protokol Keamanan Akun Dinas
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Tautan pemulihan kata sandi hanya dikirimkan ke domain resmi staf dengan enkripsi tanda tangan digital bertenggang waktu 15 menit.
          </p>
        </div>

        {/* Content Middle */}
        <div className="relative z-10 space-y-2.5 py-6">
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verifikasi Ganda Melalui Server Dinas</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Inaktivasi Sesi Aktif Sebelumnya Secara Otomatis</span>
          </div>
        </div>

        {/* Content Bottom */}
        <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-slate-400">
          Jika mengalami kendala akses darurat, hubungi Helpdesk Tim IT Security RecyNect.
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Forgot Password Form                             */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
        {isSubmitted ? (
          <div className="space-y-6 text-center sm:text-left py-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Tautan Reset Terkirim
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Kami telah mengirimkan tautan reset kata sandi dan instruksi verifikasi ke{' '}
                <span className="font-bold text-slate-900 font-mono">{email}</span>. Silakan periksa kotak masuk email dinas Anda.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Halaman Login Admin</span>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
                <LockKeyhole className="w-3.5 h-3.5" />
                <span>Pemulihan Sandi Administrator</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Lupa Kata Sandi Akun Dinas?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Masukkan email dinas dan Nomor Induk Pegawai Anda untuk verifikasi identitas.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Email Resmi Administrator <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama.staf@recynect.id"
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nomor Induk Staf / NIP Dinas (Opsional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="ADM-EMP-XXXX"
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-mono uppercase text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 mt-3"
              >
                {isLoading ? (
                  <span>Mengirim Tautan Pemulihan...</span>
                ) : (
                  <>
                    <span>Kirim Tautan Reset Sandi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Login Admin</span>
              </Link>
              <Link href="/forgot-password" className="text-slate-400 hover:text-slate-600 transition">
                Portal Warga →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

