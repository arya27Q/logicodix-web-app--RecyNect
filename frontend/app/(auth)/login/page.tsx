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
  Sparkles,
  CheckCircle2,
  Star,
  UserCheck,
  Store,
  ShieldCheck,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Quick Demo fill for User/Warga
  const handleFillDemoUser = () => {
    setEmail('warga@recynect.id');
    setPassword('password123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Mohon isi email dan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    // Simulate login redirect for Citizen/User
    setTimeout(() => {
      setIsLoading(false);
      router.push('/match');
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
          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80"
          alt="Pemilahan sampah kardus dan botol plastik daur ulang"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        {/* Dark Gradient Backdrop Overlay for High Contrast Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/65 to-slate-950/40"></div>

        {/* Top Badges */}
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/90 backdrop-blur-md text-white border border-emerald-300/30 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Portal Warga & Rumah Tangga
          </span>
          <h2 className="text-2xl font-bold tracking-tight leading-snug drop-shadow-xs">
            Ubah Sampah Pilahan Jadi Cuan Nyata.
          </h2>
          <p className="text-xs text-slate-200 leading-relaxed opacity-90">
            Dapatkan transparansi harga beli resmi tertinggi dari Bank Sampah dan Pengepul terverifikasi di sekitar Anda.
          </p>
        </div>

        {/* Bottom Testimonial & Social Proof Card */}
        <div className="relative z-10 space-y-3">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg space-y-2">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-[11px] font-bold text-white ml-1">5.0</span>
            </div>
            <p className="text-xs text-slate-100 italic leading-relaxed">
              &ldquo;Sekali jalan setor kardus bekas dan botol PET langsung dapat Rp 43.500. Rute singgahnya jelas dan gak ada calo!&rdquo;
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-300">
              <span className="font-semibold text-white">Ibu Ratna Hendrawan</span>
              <span>Warga Bandung Barat</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>100% Gratis & Langsung Cair di Tempat</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Dedicated User/Warga Auth Form                   */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Khusus Akun Warga / Penyetor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Masuk Akun Warga
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Mulai pencocokan sampah daur ulang Anda dan hitung rute paling menguntungkan.
            </p>
          </div>

          {/* Quick Demo Fill Button */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 block">Ingin Coba Langsung?</span>
              <span className="text-[11px] text-slate-500">Klik untuk isi otomatis akun simulasi</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemoUser}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Isi Akun Demo</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Alamat Email <span className="text-rose-500">*</span>
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Kata Sandi <span className="text-rose-500">*</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 rounded-xl border border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span>Ingat saya di perangkat ini</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Memproses Masuk...</span>
              ) : (
                <>
                  <span>Masuk sebagai Warga</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Alternative Switch */}
          <div className="pt-2 text-center text-xs text-slate-500 space-y-2">
            <p>
              Belum punya akun warga?{' '}
              <Link href="/register" className="font-bold text-slate-900 hover:text-emerald-700 underline">
                Daftar Akun Baru
              </Link>
            </p>
          </div>
        </div>

        {/* Mitra Recycler Secondary Switch (Cleanly Separated) */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-amber-600" />
            <span>Pengelola / Bank Sampah?</span>
          </span>
          <Link
            href="/recycler"
            className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            Portal Mitra Pengelola ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
