'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  User,
  Mail,
  ShieldCheck,
  KeyRound,
  Lock,
  Building,
  CheckCircle2,
  Activity,
  Save,
  Clock,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';

interface AdminProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  adminRole?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminActivityRecord {
  id: string;
  type: 'verification' | 'category' | 'price';
  action: string;
  target: string;
  timestamp: string;
}

const ROLE_LABELS: Record<string, string> = {
  superadmin: 'Super Administrator',
  moderator: 'Moderator Mitra',
  auditor: 'Auditor Harga',
  admin: 'Administrator Platform',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AD';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'activity'>('info');

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [adminId, setAdminId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [adminRole, setAdminRole] = useState('admin');
  const [createdAt, setCreatedAt] = useState('');

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [activityLogs, setActivityLogs] = useState<AdminActivityRecord[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  const loadData = useCallback(async () => {
    setLoadError(null);
    setIsLoading(true);
    try {
      const [profile, activity] = await Promise.all([
        apiClient<AdminProfileResponse>('/admin/profile'),
        apiClient<AdminActivityRecord[]>('/admin/activity').catch(() => []),
      ]);

      setAdminId(profile.id);
      setFullName(profile.name);
      setEmail(profile.email);
      setAdminRole(profile.adminRole || profile.role || 'admin');
      setCreatedAt(profile.createdAt);
      setActivityLogs(Array.isArray(activity) ? activity : []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Gagal memuat profil administrator.');
    } finally {
      setIsLoading(false);
      setIsLoadingActivity(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      apiClient<AdminProfileResponse>('/admin/profile'),
      apiClient<AdminActivityRecord[]>('/admin/activity').catch(() => []),
    ])
      .then(([profile, activity]) => {
        if (!isMounted) return;
        setAdminId(profile.id);
        setFullName(profile.name);
        setEmail(profile.email);
        setAdminRole(profile.adminRole || profile.role || 'admin');
        setCreatedAt(profile.createdAt);
        setActivityLogs(Array.isArray(activity) ? activity : []);
        setLoadError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setLoadError(err instanceof Error ? err.message : 'Gagal memuat profil administrator.');
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
        setIsLoadingActivity(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    if (fullName.trim().length < 2) {
      setSaveError('Nama lengkap minimal 2 karakter.');
      return;
    }

    setIsSavingProfile(true);
    try {
      const updated = await apiClient<AdminProfileResponse>('/admin/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name: fullName.trim(), email: email.trim() }),
      });
      setFullName(updated.name);
      setEmail(updated.email);
      setSaveSuccess(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('admin-data-changed'));
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Gagal menyimpan profil administrator.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError('Kata sandi baru minimal 8 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await apiClient('/admin/password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.replace('/admin/login');
        router.refresh();
      }, 1800);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Gagal memperbarui kata sandi.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const roleLabel = ROLE_LABELS[adminRole.toLowerCase()] || 'Administrator';

  if (isLoading) {
    return (
      <div className="p-10 text-center text-xs font-semibold text-slate-600 bg-white rounded-2xl border border-slate-200">
        Memuat profil administrator...
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        role="alert"
        className="p-6 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-rose-800"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" aria-hidden="true" />
          <span>{loadError}</span>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="min-h-[40px] px-4 py-2 rounded-xl bg-white border border-rose-200 font-bold"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Profil Administrator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Pengaturan identitas akun administrator, pembaruan kata sandi, dan log aktivitas sistem.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 w-fit">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
          <span>{roleLabel}</span>
        </span>
      </div>

      <div className="card-surface rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 text-emerald-400 font-extrabold text-xl sm:text-2xl flex items-center justify-center border-2 border-slate-700 shadow-md shrink-0">
            {getInitials(fullName)}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 truncate">{fullName}</h2>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {adminId.slice(0, 8)}
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
              <span>{roleLabel}</span>
            </p>
            <p className="text-xs text-slate-600 font-medium">
              Terdaftar sejak {createdAt ? createdAt.split('T')[0] : '-'} | Tabel: admins
            </p>
          </div>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Menu pengaturan profil administrator"
        className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'info'}
          onClick={() => setActiveTab('info')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'info'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Informasi Identitas</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'security'}
          onClick={() => setActiveTab('security')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Keamanan & Sandi</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'activity'}
          onClick={() => setActiveTab('activity')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'activity'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Log Aktivitas Sistem</span>
        </button>
      </div>

      {activeTab === 'info' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Data Akun Administrator
            </h3>

            {saveError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" aria-hidden="true" />
                <span>{saveError}</span>
              </div>
            )}

            {saveSuccess && (
              <div
                role="status"
                className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                <span>Perubahan profil administrator berhasil disimpan ke database.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="admin-profile-name"
                  className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User
                    className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="admin-profile-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-profile-email"
                  className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
                >
                  Email Resmi Administrator
                </label>
                <div className="relative">
                  <Mail
                    className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="admin-profile-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="admin-profile-role"
                  className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
                >
                  Peran Otoritas
                </label>
                <div className="relative">
                  <Building
                    className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="admin-profile-role"
                    type="text"
                    disabled
                    value={roleLabel}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium shadow-2xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs transition disabled:opacity-60"
              >
                <Save className="w-4 h-4" aria-hidden="true" />
                <span>{isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <form
            onSubmit={handleUpdatePassword}
            className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4"
          >
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Pembaruan Kata Sandi Administrator
            </h3>

            {passwordError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" aria-hidden="true" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div
                role="status"
                className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                <span>Kata sandi diperbarui. Mengalihkan kembali ke halaman login...</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="admin-current-password"
                  className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
                >
                  Sandi Saat Ini <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock
                    className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="admin-current-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Kata sandi saat ini"
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-new-password"
                  className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
                >
                  Sandi Baru <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock
                    className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="admin-new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-confirm-password"
                  className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
                >
                  Ulangi Sandi Baru <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock
                    className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="admin-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi sandi baru"
                    className="w-full h-11 pl-10 pr-11 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-600 hover:text-slate-900 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition disabled:opacity-60"
              >
                <KeyRound className="w-4 h-4" aria-hidden="true" />
                <span>{isUpdatingPassword ? 'Memperbarui...' : 'Perbarui Kata Sandi'}</span>
              </button>
            </div>
          </form>

          <div className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Autentikasi Dua Faktor (2FA / MFA)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Belum tersedia pada versi MVP. Perubahan sandi otomatis membatalkan sesi lama melalui peningkatan auth_version.
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 w-fit shrink-0">
              Belum Tersedia (MVP)
            </span>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Riwayat Perubahan Data Platform
              </h3>
              <p className="text-xs text-slate-600">
                Aktivitas terbaru pada verifikasi mitra, kategori master, dan pembaruan harga dari database.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 font-mono tabular-nums">
              {activityLogs.length} Catatan
            </span>
          </div>

          {isLoadingActivity ? (
            <p className="text-xs text-slate-600 py-6 text-center font-semibold">
              Memuat catatan aktivitas sistem...
            </p>
          ) : activityLogs.length === 0 ? (
            <p className="text-xs text-slate-600 py-6 text-center">
              Belum ada catatan perubahan data di database.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0 mt-0.5">
                      {log.type === 'verification' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                      ) : log.type === 'category' ? (
                        <Activity className="w-4 h-4 text-sky-700" aria-hidden="true" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-700" aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{log.action}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{log.target}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
