'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="card-elevated rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* Visual Photographic Showcase Panel */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 text-white min-h-[520px] overflow-hidden group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80"
          alt="Keamanan akun dan pemulihan daur ulang"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/65 to-slate-950/40"></div>

        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/90 backdrop-blur-md text-white border border-amber-300/30 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Keamanan Akun Warga
          </span>
          <h2 className="text-2xl font-bold tracking-tight leading-snug drop-shadow-xs">
            Pulihkan Akses Akun Daur Ulang Anda.
          </h2>
          <p className="text-xs text-slate-200 leading-relaxed opacity-90">
            Kami menjaga data riwayat setoran sampah dan saldo perkiraan cuan Anda dengan aman.
          </p>
        </div>

        <div className="relative z-10 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-slate-200">
          <p className="font-semibold text-white">Butuh Bantuan Lain?</p>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Tim dukungan teknis siap membantu kendala akun Anda di support@recynect.id.
          </p>
        </div>
      </div>

      {/* Form Column */}
      <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shadow-2xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Lupa Kata Sandi?
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Masukkan alamat email terdaftar akun RecyNect Anda. Tautan pemulihan akan dikirimkan secara instan.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Tautan Pemulihan Terkirim!</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Kami telah mengirimkan instruksi reset kata sandi ke <strong>{email}</strong>. Silakan periksa kotak
                masuk atau folder spam Anda.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 underline"
                >
                  <span>Kembali ke Halaman Masuk</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Alamat Email Terdaftar <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full h-11 rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Mengirimkan Tautan...</span>
                ) : (
                  <>
                    <span>Kirim Tautan Pemulihan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Masuk</span>
          </Link>
          <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
            Daftar Akun Baru ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
