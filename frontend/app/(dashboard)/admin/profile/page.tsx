'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  KeyRound,
  Lock,
  Building,
  CheckCircle2,
  Calendar,
  Activity,
  Save,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'activity'>('info');

  // Form states
  const [fullName, setFullName] = useState('Arya Pratama, S.Kom.');
  const [email, setEmail] = useState('arya.pratama@recynect.id');
  const [phone, setPhone] = useState('+62 812-3456-7890');
  const [department, setDepartment] = useState('Super Administrator & Tata Kelola Ekosistem');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Activity logs
  const activityLogs = [
    {
      action: 'Menyetujui Verifikasi Kemitraan',
      target: 'PT Hijau Daur Perkasa (Pabrik)',
      time: 'Hari ini, 14:20 WIB',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      action: 'Pembaruan Batas Harga Kategori Master',
      target: 'Botol Plastik PET Bening (Rp 3.800 - Rp 4.800)',
      time: 'Kemarin, 09:45 WIB',
      icon: <Activity className="w-4 h-4 text-sky-600" />,
    },
    {
      action: 'Broadcast Peringatan Audit Anomali',
      target: '3 Mitra dengan Deviasi Harga >20%',
      time: '08 Nov 2026, 16:10 WIB',
      icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
    },
    {
      action: 'Login Sesi Console Administrator',
      target: 'Browser Chrome pada Windows (IP 103.144.18.22)',
      time: '08 Nov 2026, 08:00 WIB',
      icon: <Clock className="w-4 h-4 text-slate-500" />,
    },
  ];

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Profil Administrator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pengaturan identitas staf, hak akses otoritas, kredensial keamanan, dan riwayat aktivitas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Otoritas Super Admin</span>
          </span>
        </div>
      </div>

      {/* Main Profile Summary Card */}
      <div className="card-surface rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-emerald-400 font-extrabold text-2xl flex items-center justify-center border-2 border-slate-700 shadow-md shrink-0">
            AP
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{fullName}</h2>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                ADM-EMP-8812
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{department}</span>
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Bergabung sejak 15 Januari 2025 • Status: Aktif & Terverifikasi
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 text-xs text-slate-500 gap-1 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Tingkat Akses Sistem
          </span>
          <span className="text-sm font-extrabold text-slate-900">Level 1 (Full Root)</span>
          <span className="text-[11px] text-emerald-700 font-semibold">Semua Izin Aktif</span>
        </div>
      </div>

      {/* Tab Nav Buttons */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'info'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Informasi Identitas</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Keamanan & Sandi</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'activity'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Log Audit Aktivitas</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: INFORMASI IDENTITAS                                     */}
      {/* ============================================================== */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Data Pribadi Staf Administrator
            </h3>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Perubahan profil staf berhasil disimpan.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nama Lengkap & Gelar
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Email Resmi Dinas
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
                  Nomor Handphone / WhatsApp Dinas
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
                  Departemen / Divisi
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    disabled
                    value={department}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium cursor-not-allowed shadow-2xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99]"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* TAB 2: KEAMANAN & KATA SANDI                                   */}
      {/* ============================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change Password Card */}
          <form onSubmit={handleUpdatePassword} className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Pembaruan Kata Sandi Akun Dinas
            </h3>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kata sandi berhasil diperbarui dengan aman.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Sandi Saat Ini <span className="text-rose-500">*</span>
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
                  Sandi Baru <span className="text-rose-500">*</span>
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
                  Ulangi Sandi Baru <span className="text-rose-500">*</span>
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
                <KeyRound className="w-4 h-4" />
                <span>Perbarui Kata Sandi</span>
              </button>
            </div>
          </form>

          {/* 2FA & Session Security Card */}
          <div className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Autentikasi Dua Faktor (2FA)
                </h3>
                <p className="text-xs text-slate-500">
                  Wajib bagi akun Super Administrator untuk memvalidasi setiap login console.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  twoFactorEnabled
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {twoFactorEnabled ? '2FA Aktif' : '2FA Nonaktif'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LOG AUDIT AKTIVITAS                                     */}
      {/* ============================================================== */}
      {activeTab === 'activity' && (
        <div className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Riwayat Aksi Administrator
              </h3>
              <p className="text-xs text-slate-500">
                Log audit kepatuhan internal terhadap manipulasi data mitra dan sistem.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono">
              Total {activityLogs.length} Aksi Terakhir
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {activityLogs.map((log, idx) => (
              <div key={idx} className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0 mt-0.5">
                    {log.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{log.action}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{log.target}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
