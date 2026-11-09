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
  Building2,
  CheckCircle2,
  Warehouse,
  KeyRound,
  Scale,
} from 'lucide-react';

export default function RecyclerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [warehouseCode, setWarehouseCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Quick Demo Auto-fill for Mitra Pengelola
  const handleFillDemoMitra = () => {
    setEmail('mitra@recynect.id');
    setPassword('mitra2026');
    setWarehouseCode('GDG-JKT-001');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Mohon isi email resmi mitra dan kata sandi operasional.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/recycler');
    }, 700);
  };

  return (
    <div className="card-elevated rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* ============================================================== */}
      {/* LEFT COLUMN: Photographic Showcase Panel (Desktop)             */}
      {/* ============================================================== */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 text-white min-h-[580px] overflow-hidden group">
        {/* Real Industrial Recycling Photography */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80"
          alt="Operasional Fasilitas Daur Ulang & Gudang Mitra"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 brightness-[0.35]"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60"></div>
        <div className="absolute inset-0 bg-amber-950/20 mix-blend-overlay"></div>

        {/* Content Top: Trust Badge */}
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold backdrop-blur-md">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Portal Mitra Pengelola & Gudang</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white leading-snug">
            Efisiensi Penyerapan Material & Timbangan Digital
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Hubungkan gudang pengolahan Anda dengan ribuan warga di sekitar lokasi untuk suplai material daur ulang yang konsisten.
          </p>
        </div>

        {/* Content Middle: Key Partner Advantages */}
        <div className="relative z-10 space-y-2.5 py-6">
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Penerimaan Setoran Terjadwal Tanpa Penumpukan</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Integrasi Timbangan Digital & Otomasi Nota Payout</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Transparansi Margin Harga & Sertifikasi Mutu</span>
          </div>
        </div>

        {/* Content Bottom */}
        <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-slate-400">
          Operasional mitra dijamin oleh sistem verifikasi kepatuhan RecyNect.
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Mitra Login Form                                 */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
        {/* Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md mb-2 border border-amber-200/60">
            <Warehouse className="w-3.5 h-3.5 text-amber-600" />
            <span>Portal Pengelola & Lapak</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Masuk ke Console Mitra
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Akses timbangan digital, daftar penerimaan sampah, dan kelola harga beli material.
          </p>
        </div>

        {/* Quick Demo Credentials Auto-Fill Pill */}
        <div className="mb-6 p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
            <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Simulasi login pengujian mitra pengelola?</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoMitra}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-amber-300 rounded-xl hover:bg-amber-100/60 transition shadow-2xs shrink-0"
          >
            <span>Isi Akun Demo Mitra</span>
          </button>
        </div>

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Mitra Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Email Resmi Usaha <span className="text-rose-500">*</span>
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
                placeholder="nama@perusahaan-daurulang.co.id"
                className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
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
                href="/recycler/forgot-password"
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition"
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
                className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
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

          {/* Optional Warehouse Identifier */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Kode Unit Gudang / Drop-Point (Opsional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Scale className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={warehouseCode}
                onChange={(e) => setWarehouseCode(e.target.value)}
                placeholder="GDG-JKT-XXXX"
                className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-mono uppercase text-slate-900"
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
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <span className="text-xs text-slate-600 font-medium">
                Ingat sesi di komputer timbangan ini
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
              <span>Memverifikasi Akun Mitra...</span>
            ) : (
              <>
                <span>Masuk ke Console Mitra Pengelola</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Belum menjadi mitra terdaftar?{' '}
            <Link
              href="/recycler/register"
              className="font-bold text-amber-700 hover:text-amber-800 transition underline ml-1"
            >
              Daftar Kemitraan
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-slate-400 hover:text-slate-600 transition"
            >
              Portal Warga →
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/admin/login"
              className="text-slate-400 hover:text-slate-600 transition"
            >
              Admin →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

