'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Leaf,
  Coins,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Save,
  Clock,
  ChevronRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

interface HistoryItem {
  id: string;
  date: string;
  materials: string;
  totalWeight: string;
  recyclerName: string;
  recyclerType: string;
  amountRp: number;
  status: 'selesai' | 'proses';
}

const SAMPLE_HISTORY: HistoryItem[] = [
  {
    id: 'TRX-9921',
    date: '08 Nov 2026',
    materials: 'Kardus Cokelat (10 kg) • Botol PET (5 kg)',
    totalWeight: '15.0 kg',
    recyclerName: 'PT Hijau Daur Perkasa',
    recyclerType: 'Pabrik',
    amountRp: 42000,
    status: 'selesai',
  },
  {
    id: 'TRX-9844',
    date: '02 Nov 2026',
    materials: 'Minyak Jelantah (4 liter)',
    totalWeight: '4.0 L',
    recyclerName: 'Pengepul Berkah Jaya',
    recyclerType: 'Pengepul',
    amountRp: 26000,
    status: 'selesai',
  },
  {
    id: 'TRX-9702',
    date: '25 Okt 2026',
    materials: 'Kardus Box Bekas (15 kg)',
    totalWeight: '15.0 kg',
    recyclerName: 'Bank Sampah Mandiri',
    recyclerType: 'Bank Sampah',
    amountRp: 30000,
    status: 'selesai',
  },
  {
    id: 'TRX-9620',
    date: '18 Okt 2026',
    materials: 'Kaleng Minuman Aluminium (3 kg)',
    totalWeight: '3.0 kg',
    recyclerName: 'UD Logam Berkah',
    recyclerType: 'Pengepul',
    amountRp: 42000,
    status: 'selesai',
  },
];

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  // Profile Form States
  const [name, setName] = useState('Santi Damayanti');
  const [email, setEmail] = useState('santi.damayanti@gmail.com');
  const [phone, setPhone] = useState('+62 821-9988-7766');
  const [address, setAddress] = useState('Jl. Cihampelas No. 128, RT 02/05, Coblong');
  const [city, setCity] = useState('Kota Bandung, Jawa Barat');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Profile Hero Card */}
      <div className="card-surface rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center border-2 border-emerald-400/50 shadow-md shrink-0">
            SD
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Warga Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Member RecyNect sejak Maret 2025 • Tingkat: Eco-Champion Level 3
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{address}, {city}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/match"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mulai Setor Sampah</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Eco-Impact KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-surface rounded-2xl p-5 border border-emerald-200/60 bg-emerald-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Total Sampah Disetor
            </span>
            <div className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-700">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            124.5 kg
          </p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">4 jenis material daur ulang</p>
        </div>

        <div className="card-surface rounded-2xl p-5 border border-amber-200/60 bg-amber-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Total Rupiah Didapat
            </span>
            <div className="p-2 rounded-xl bg-white border border-amber-200 text-amber-700">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            Rp 482.000
          </p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Pendapatan daur ulang bersih</p>
        </div>

        <div className="card-surface rounded-2xl p-5 border border-sky-200/60 bg-sky-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Jejak Emisi Dicegah
            </span>
            <div className="p-2 rounded-xl bg-white border border-sky-200 text-sky-700">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            86.2 kg
          </p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Estimasi reduksi CO₂e</p>
        </div>

        <div className="card-surface rounded-2xl p-5 border border-indigo-200/60 bg-indigo-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Pohon Terselamatkan
            </span>
            <div className="p-2 rounded-xl bg-white border border-indigo-200 text-indigo-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            ± 3 Pohon
          </p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Dari daur ulang kardus/kertas</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Riwayat Setor Sampah</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Pengaturan Akun & Alamat</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: RIWAYAT PENYETORAN SAMPAH                               */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="card-surface rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs">
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Riwayat Transaksi Penyetoran Sampah
              </h3>
              <p className="text-xs text-slate-500">
                Catatan penimbangan resmi di fasilitas mitra pengelola daur ulang.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {SAMPLE_HISTORY.length} Transaksi Terakhir
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">ID Transaksi & Tanggal</th>
                  <th className="py-3.5 px-5">Material Daur Ulang</th>
                  <th className="py-3.5 px-5">Mitra Pengelola Tujuan</th>
                  <th className="py-3.5 px-5 text-right">Nilai Diterima</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {SAMPLE_HISTORY.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-5">
                      <span className="font-mono font-bold text-slate-900 block">{item.id}</span>
                      <span className="text-[11px] text-slate-400 font-normal">{item.date}</span>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-semibold text-slate-800">{item.materials}</p>
                      <span className="text-[11px] text-slate-500 font-normal">
                        Total Bobot: {item.totalWeight}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-900">{item.recyclerName}</p>
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {item.recyclerType}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-extrabold text-emerald-700 text-sm tabular-nums whitespace-nowrap">
                      Rp {item.amountRp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Selesai</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PENGATURAN AKUN & ALAMAT                                */}
      {/* ============================================================== */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveProfile} className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Informasi Pribadi & Kontak
            </h3>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Data profil berhasil diperbarui.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Kota / Wilayah
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Alamat Rumah / Titik Keberangkatan Default
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99]"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Profil</span>
              </button>
            </div>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handleUpdatePassword} className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Ubah Kata Sandi Akun
            </h3>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kata sandi Anda berhasil diperbarui.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Sandi Sekarang
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Ulangi Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi sandi baru"
                    className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
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

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99]"
              >
                <span>Ubah Sandi Akun</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

