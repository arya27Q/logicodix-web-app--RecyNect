'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Phone,
  MapPin,
  Warehouse,
} from 'lucide-react';

export default function RecyclerRegisterPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [facilityType, setFacilityType] = useState('pengepul');
  const [picName, setPicName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nib, setNib] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Quick Demo Auto-fill for Mitra registration
  const handleFillDemo = () => {
    setBusinessName('CV Berkah Daur Sentosa');
    setFacilityType('pengepul');
    setPicName('Agus Santoso');
    setPhone('+62 812-9988-7711');
    setEmail('mitra.berkah@daursentosa.com');
    setNib('NIB-881290341829');
    setAddress('Jl. Raya Narogong Km. 14 No. 8, Cileungsi, Bogor, Jawa Barat');
    setPassword('mitrapassword2026');
    setConfirmPassword('mitrapassword2026');
    setAgreePolicy(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !picName || !phone || !email || !password || !nib || !address) {
      alert('Mohon lengkapi seluruh formulir registrasi mitra pengelola.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (!agreePolicy) {
      alert('Anda wajib menyetujui Pakta Integritas Mutu & Transparansi Timbangan Mitra.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert('Pendaftaran kemitraan berhasil! Berkas Anda sedang diproses tim verifikasi.');
      router.push('/recycler');
    }, 700);
  };

  return (
    <div className="card-elevated rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* ============================================================== */}
      {/* LEFT COLUMN: Photographic Showcase Panel (Desktop)             */}
      {/* ============================================================== */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 text-white min-h-[640px] overflow-hidden group">
        {/* Real Logistics & Material Recovery Facility Photography */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=80"
          alt="Pemberdayaan Mitra Pengelola Daur Ulang"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 brightness-[0.35]"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60"></div>
        <div className="absolute inset-0 bg-amber-950/20 mix-blend-overlay"></div>

        {/* Content Top: Trust Badge */}
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold backdrop-blur-md">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Pendaftaran Mitra Pengelola Baru</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white leading-snug">
            Perluas Jangkauan Pasokan Sampah Daur Ulang
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Dapatkan pasokan material terpilah dari ribuan warga, pantau antrean timbangan secara langsung, dan tingkatkan utilisasi kapasitas gudang Anda.
          </p>
        </div>

        {/* Content Middle: Partner Requirements */}
        <div className="relative z-10 space-y-2.5 py-6">
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Memiliki Izin Usaha / NIB yang Sah</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Instrumen Timbangan Tervalidasi</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Komitmen Transparansi Harga Beli & Payout Tepat Waktu</span>
          </div>
        </div>

        {/* Content Bottom */}
        <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-slate-400">
          Proses verifikasi berkas izin dilakukan dalam 1x24 jam kerja oleh tim administrator.
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Mitra Registration Form                          */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
        {/* Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md mb-2 border border-amber-200/60">
            <Warehouse className="w-3.5 h-3.5 text-amber-600" />
            <span>Formulir Kemitraan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Daftarkan Fasilitas Daur Ulang
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftarkan lapak, pengepul, bank sampah, atau pabrik Anda ke jaringan ekosistem RecyNect.
          </p>
        </div>

        {/* Quick Demo Credentials Auto-Fill Pill */}
        <div className="mb-6 p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Simulasi isi formulir otomatis?</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-amber-300 rounded-xl hover:bg-amber-100/60 transition shadow-2xs shrink-0"
          >
            <span>Isi Data Demo Mitra</span>
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Usaha */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Nama Usaha / Gudang <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="PT / CV / Lapak Mandiri"
                  className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Kategori Skala Usaha */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Kategori Skala Usaha <span className="text-rose-500">*</span>
              </label>
              <select
                value={facilityType}
                onChange={(e) => setFacilityType(e.target.value)}
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900 bg-white"
              >
                <option value="lapak">Lapak Pengumpul (&lt; 2 Ton)</option>
                <option value="pengepul">Pengepul Menengah (2 - 10 Ton)</option>
                <option value="banksampah">Bank Sampah Induk / Unit</option>
                <option value="pabrik">Pabrik Pengolahan (&gt; 10 Ton)</option>
              </select>
            </div>

            {/* Nama PIC */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Nama Penanggung Jawab (PIC) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                placeholder="Nama lengkap PIC"
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
              />
            </div>

            {/* Nomor WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Nomor WhatsApp Operasional <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-xxxx-xxxx"
                  className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Resmi Usaha <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operasional@mitra.com"
                  className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
              </div>
            </div>

            {/* NIB */}
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
          </div>

          {/* Alamat Gudang */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Alamat Lengkap Gudang / Lokasi Timbangan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Lokasi Gudang No. X, Kelurahan, Kecamatan, Kota / Kabupaten..."
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Kata Sandi Akun <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 karakter"
                  className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Konfirmasi Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi sandi"
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
          </div>

          {/* Agree Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={agreePolicy}
                onChange={(e) => setAgreePolicy(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300 shrink-0"
              />
              <span className="text-xs text-slate-600 leading-relaxed font-medium">
                Saya menyatakan bahwa seluruh data badan usaha, NIB, dan sarana timbangan yang didaftarkan adalah sah, serta berkomitmen mematuhi ketentuan harga beli wajar dan transparansi penimbangan di platform RecyNect.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 mt-3"
          >
            {isLoading ? (
              <span>Mendaftarkan Fasilitas Mitra...</span>
            ) : (
              <>
                <span>Kirim Berkas Pendaftaran Kemitraan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Sudah memiliki akun kemitraan?{' '}
            <Link
              href="/recycler/login"
              className="font-bold text-amber-700 hover:text-amber-800 transition underline ml-1"
            >
              Masuk di sini
            </Link>
          </div>
          <Link
            href="/login"
            className="text-slate-400 hover:text-slate-600 transition"
          >
            Bukan Pengelola? Portal Warga →
          </Link>
        </div>
      </div>
    </div>
  );
}

