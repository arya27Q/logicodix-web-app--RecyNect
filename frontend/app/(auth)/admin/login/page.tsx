'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  LockKeyhole,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Quick Demo Auto-fill for Administrator
  const handleFillDemoAdmin = () => {
    setEmail('admin@recynect.id');
    setPassword('superadmin2026');
    setSecurityCode('ADM-SEC-9921');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Mohon isi email dinas dan kata sandi administrator.');
      return;
    }

    setIsLoading(true);

    // Simulate verification authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin');
    }, 700);
  };

  return (
    <div className="card-elevated rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* ============================================================== */}
      {/* LEFT COLUMN: Visual Photographic Showcase Panel (Desktop)      */}
      {/* ============================================================== */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 text-white min-h-[580px] overflow-hidden group">
        {/* Real High-Resolution Photography */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
          alt="Operasional Pusat Kendali Administrator"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 brightness-[0.35]"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60"></div>
        <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay"></div>

        {/* Content Top: Trust Badge */}
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zona Akses Internal Terbatas</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white leading-snug">
            Pusat Verifikasi & Tata Kelola Ekosistem
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Memastikan transparansi harga material, kepatuhan syarat mutu fisik, dan validasi legalitas mitra pengelola.
          </p>
        </div>

        {/* Content Middle: Security Highlights */}
        <div className="relative z-10 space-y-2.5 py-6">
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Enkripsi 256-Bit TLS & Sesi Terisolasi</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Audit Trail Otomatis Setiap Aksi Verifikasi</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Deteksi Dini Anomali Deviasi Harga Pasar</span>
          </div>
        </div>

        {/* Content Bottom: Disclaimer Badge */}
        <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-slate-400">
          Setiap aktivitas login dan modifikasi data master dicatat dalam log audit kepatuhan RecyNect.
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Administrator Login Form                         */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
        {/* Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
            <LockKeyhole className="w-3.5 h-3.5" />
            <span>Portal Administrator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Masuk ke Console Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Gunakan akun staf terdaftar untuk meninjau berkas mitra dan data master.
          </p>
        </div>

        {/* Quick Demo Credentials Auto-Fill Pill */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Coba simulasi login pengujian?</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:text-emerald-700 transition shadow-2xs shrink-0"
          >
            <span>Isi Akun Demo Admin</span>
          </button>
        </div>

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Dinas Input */}
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
                placeholder="nama@recynect.id"
                className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
              >
                Lupa sandi?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Optional Security Code / Passcode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Kode Otoritas / Security Passcode (Opsional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                placeholder="ADM-SEC-XXXX"
                className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-mono uppercase text-slate-900"
              />
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs text-slate-600 font-medium">
                Ingat sesi ini di perangkat dinas
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <span>Mengautentikasi Kredensial...</span>
            ) : (
              <>
                <span>Masuk ke Console Administrator</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Staf baru belum memiliki akun?{' '}
            <Link
              href="/admin/register"
              className="font-bold text-emerald-700 hover:text-emerald-800 transition underline ml-1"
            >
              Registrasi Staf
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/recycler/login"
              className="text-slate-400 hover:text-slate-600 transition"
            >
              Mitra Pengelola →
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/login"
              className="text-slate-400 hover:text-slate-600 transition"
            >
              Portal Warga →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

