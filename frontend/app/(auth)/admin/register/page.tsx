'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  LockKeyhole,
  Building,
} from 'lucide-react';

export default function AdminRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('verifikasi');
  const [inviteCode, setInviteCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Quick Demo Auto-fill for registration
  const handleFillDemo = () => {
    setFullName('Budi Setiawan, S.T.');
    setEmail('budi.setiawan@recynect.id');
    setDepartment('verifikasi');
    setInviteCode('ADM-INV-2026-X8');
    setPassword('adminpassword2026');
    setConfirmPassword('adminpassword2026');
    setAgreePolicy(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !inviteCode) {
      alert('Mohon lengkapi seluruh kolom formulir registrasi staf.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (!agreePolicy) {
      alert('Anda wajib menyetujui Pakta Integritas & Kerahasiaan Data Administrator.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert('Registrasi staf administrator berhasil disetujui. Mengalihkan ke console admin...');
      router.push('/admin');
    }, 700);
  };

  return (
    <div className="card-elevated rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* ============================================================== */}
      {/* LEFT COLUMN: Visual Photographic Showcase Panel (Desktop)      */}
      {/* ============================================================== */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 text-white min-h-[640px] overflow-hidden group">
        {/* Real High-Resolution Photography */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
          alt="Kolaborasi Tim Verifikasi & Administrator"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 brightness-[0.35]"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60"></div>
        <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay"></div>

        {/* Content Top: Trust Badge */}
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Onboarding Staf & Operator</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white leading-snug">
            Bergabung dengan Tim Tata Kelola RecyNect
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Akses ke alat verifikasi legalitas mitra, pengawasan transparansi harga, dan standardisasi mutu daur ulang nasional.
          </p>
        </div>

        {/* Content Middle: Responsibility Highlights */}
        <div className="relative z-10 space-y-2.5 py-6">
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pemeriksaan Berkas NIB & Izin Lingkungan</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pengawasan Deviasi Harga Acuan Pasar</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Manajemen Master Data Kategori Material</span>
          </div>
        </div>

        {/* Content Bottom: Disclaimer Badge */}
        <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-slate-400">
          Registrasi membutuhkan kode undangan dinas yang diterbitkan oleh Super Administrator.
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Administrator Register Form                      */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
        {/* Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
            <LockKeyhole className="w-3.5 h-3.5" />
            <span>Registrasi Staf Administrator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Aktivasi Akun Staf Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Lengkapi formulir dengan kode undangan resmi untuk mendapatkan hak akses.
          </p>
        </div>

        {/* Quick Demo Pill */}
        <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Gunakan data demo staf untuk pengujian cepat?</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:text-emerald-700 transition shadow-2xs shrink-0"
          >
            <span>Isi Data Demo Staf</span>
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Invite Code */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Kode Undangan Dinas (Invite Code) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="ADM-INV-XXXX-XX"
                className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-mono uppercase text-slate-900"
              />
            </div>
          </div>

          {/* Full Name & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Nama Lengkap & Gelar <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Departemen / Peran <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-semibold text-slate-900"
                >
                  <option value="verifikasi">Tim Verifikasi Legalitas & Mutu</option>
                  <option value="harga">Analis Audit Harga Pasar</option>
                  <option value="koordinator">Koordinator Logistik Wilayah</option>
                  <option value="superadmin">Super Administrator</option>
                </select>
              </div>
            </div>
          </div>

          {/* Email Dinas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Email Resmi Dinas <span className="text-rose-500">*</span>
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

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 karakter"
                  className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Ulangi Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi"
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
          </div>

          {/* Pakta Integritas */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={agreePolicy}
                onChange={(e) => setAgreePolicy(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs text-slate-600 leading-relaxed font-normal">
                Saya menyetujui <span className="font-bold text-slate-900">Pakta Integritas & Kerahasiaan Data RecyNect</span> serta siap bertanggung jawab penuh atas setiap validasi pengelola yang saya lakukan.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <span>Memproses Verifikasi Akses...</span>
            ) : (
              <>
                <span>Aktivasi Akun Administrator</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Sudah memiliki akun dinas?{' '}
            <Link
              href="/admin/login"
              className="font-bold text-emerald-700 hover:text-emerald-800 transition underline ml-1"
            >
              Masuk ke Console
            </Link>
          </div>
          <Link href="/login" className="text-slate-400 hover:text-slate-600 transition">
            Portal Warga →
          </Link>
        </div>
      </div>
    </div>
  );
}

