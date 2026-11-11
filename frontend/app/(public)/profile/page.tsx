'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Save,
  Clock,
  ShieldCheck,
  Eye,
  EyeOff,
  LogOut,
  Loader2,
  AlertCircle,
  KeyRound,
  Recycle,
  Coins,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface HistoryItem {
  id: string;
  internalId?: string;
  date: string;
  materials: string;
  totalWeight: string;
  recyclerName: string;
  recyclerType: string;
  recyclerAddress?: string;
  amountRp: number;
  status: 'selesai' | 'antre' | 'timbang' | 'batal';
  notes?: string;
  arrivalTime?: string;
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
];

export default function UserProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'security'>('overview');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showSampleDemo, setShowSampleDemo] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [summary, setSummary] = useState({
    totalWeightKg: 0,
    totalPayoutRp: 0,
    completedCount: 0,
    pendingCount: 0,
  });
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Profile Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Jl. Cihampelas No. 128, RT 02/05, Coblong');
  const [city, setCity] = useState('Kota Bandung, Jawa Barat');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveProfileError, setSaveProfileError] = useState('');

  // Security / Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const user = await apiClient<{ id: string; name: string; email: string; phone?: string; role: string }>('/auth/me');
        if (isMounted) {
          setName(user.name);
          setEmail(user.email);
          setPhone(user.phone || '');

          // Muat alamat default yang tersimpan di browser
          if (typeof window !== 'undefined') {
            const savedAddress = localStorage.getItem('recynect_user_address');
            if (savedAddress) setAddress(savedAddress);
            const savedCity = localStorage.getItem('recynect_user_city');
            if (savedCity) setCity(savedCity);
          }

          setIsLoadingUser(false);
        }
      } catch {
        if (isMounted) {
          router.replace('/login?redirect=/profile');
        }
      }
    };

    const loadHistory = async () => {
      try {
        const res = await apiClient<{
          history: HistoryItem[];
          summary: {
            totalWeightKg: number;
            totalPayoutRp: number;
            completedCount: number;
            pendingCount: number;
          };
        }>('/auth/history');
        if (isMounted && res) {
          setHistory(res.history || []);
          if (res.summary) setSummary(res.summary);
        }
      } catch {
        // Abaikan jika history kosong
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    };

    loadProfile();
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // Abaikan error saat logout
    } finally {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('recynect-auth-changed'));
      }
      router.replace('/login');
      router.refresh();
    }
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return fullName.slice(0, 2).toUpperCase();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveProfileError('');
    setIsSavingProfile(true);

    try {
      const updated = await apiClient<{ id: string; name: string; phone: string }>('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });

      setName(updated.name);
      setPhone(updated.phone || '');

      // Simpan alamat lokal untuk kenyamanan pencocokan rute
      if (typeof window !== 'undefined') {
        localStorage.setItem('recynect_user_address', address);
        localStorage.setItem('recynect_user_city', city);
        window.dispatchEvent(new Event('recynect-auth-changed'));
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (error) {
      setSaveProfileError(error instanceof Error ? error.message : 'Gagal menyimpan perubahan profil.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setPasswordError('Kata sandi baru minimal 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setPasswordError('');
    setPasswordSuccess(false);
    setIsUpdatingPassword(true);

    try {
      await apiClient('/auth/password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Berikan jeda agar pengguna membaca notifikasi sukses sebelum kembali login
      setTimeout(() => {
        router.replace('/login?passwordUpdated=1');
      }, 1800);
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Gagal memperbarui kata sandi. Periksa kembali kata sandi saat ini.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm font-semibold">Memuat profil akun Anda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ============================================================== */}
      {/* TOP PROFILE HERO CARD                                          */}
      {/* ============================================================== */}
      <div className="card-surface rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center border-2 border-emerald-400/50 shadow-md shrink-0 uppercase tracking-tight">
            {getInitials(name)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
                {name || 'Warga RecyNect'}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Warga Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Email: <span className="font-semibold text-slate-700">{email}</span> • Telp:{' '}
              <span className="font-semibold text-slate-700">{phone || 'Belum diisi'}</span>
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {address}, {city}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/match"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs hover:shadow transition active:scale-[0.99]"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mulai Setor Sampah</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs border ${
              activeTab === 'security'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-700'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ganti Sandi</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar dari Akun"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* NAVIGATION TABS (Overview / Profile Data / Security)           */}
      {/* ============================================================== */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
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
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Ubah Data Diri & Alamat</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'security'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Keamanan & Ganti Sandi</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: RIWAYAT SETOR & STATUS WARGA                            */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Ringkasan Ringkas Akun Warga */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-surface rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
                <Recycle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Sampah Disetor
                </span>
                <span className="text-xl font-extrabold text-slate-900">{summary.totalWeightKg.toFixed(1)} kg</span>
                <p className="text-[11px] text-slate-500">
                  {summary.completedCount > 0 ? `${summary.completedCount} transaksi selesai ditimbang` : 'Akun baru terdaftar'}
                </p>
              </div>
            </div>

            <div className="card-surface rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Cuan Diterima
                </span>
                <span className="text-xl font-extrabold text-slate-900">
                  Rp {summary.totalPayoutRp.toLocaleString('id-ID')}
                </span>
                <p className="text-[11px] text-slate-500">
                  {summary.totalPayoutRp > 0 ? 'Telah cair dari pengelola' : 'Saldo siap diisi setoran'}
                </p>
              </div>
            </div>

            <div className="card-surface rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Status Keanggotaan
                </span>
                <span className="text-xl font-extrabold text-emerald-600">Warga Aktif</span>
                <p className="text-[11px] text-slate-500">
                  {summary.pendingCount > 0 ? `${summary.pendingCount} setoran dalam antrean` : 'Bisa langsung setor sampah'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabel Riwayat Riil / Clean Welcome State */}
          {history.length > 0 ? (
            <div className="card-surface rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xs">
              <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Daftar Riwayat Penyetoran Sampah</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rekam jejak transaksi timbangan dan pencairan pembayaran dari mitra pengelola resmi.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 w-fit">
                  {history.length} Transaksi Tercatat
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-5">ID Transaksi & Tanggal</th>
                      <th className="py-3.5 px-5">Material Daur Ulang</th>
                      <th className="py-3.5 px-5">Mitra Pengelola Tujuan</th>
                      <th className="py-3.5 px-5 text-right">Nilai Diterima</th>
                      <th className="py-3.5 px-5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-4 px-5">
                          <span className="font-mono font-bold text-slate-900 block text-xs">{item.id}</span>
                          <span className="text-[11px] text-slate-400 font-normal">{item.date}</span>
                          {item.arrivalTime && (
                            <span className="text-[10px] text-slate-500 block mt-0.5">Jadwal: {item.arrivalTime}</span>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          <p className="font-bold text-slate-900">{item.materials}</p>
                          <span className="text-[11px] text-slate-500 font-normal">
                            Total Bobot: <span className="font-semibold text-slate-700">{item.totalWeight}</span>
                          </span>
                          {item.notes && (
                            <p className="text-[10px] text-slate-500 italic mt-0.5">Catatan: {item.notes}</p>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          <p className="font-bold text-slate-900">{item.recyclerName}</p>
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60 mt-0.5">
                            {item.recyclerType}
                          </span>
                          {item.recyclerAddress && (
                            <p className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">{item.recyclerAddress}</p>
                          )}
                        </td>
                        <td className="py-4 px-5 text-right font-extrabold text-emerald-700 text-sm tabular-nums whitespace-nowrap">
                          Rp {item.amountRp.toLocaleString('id-ID')}
                        </td>
                        <td className="py-4 px-5 text-center">
                          {item.status === 'selesai' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Selesai & Cair</span>
                            </span>
                          )}
                          {(item.status === 'antre' || item.status === 'timbang') && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Menunggu Timbang</span>
                            </span>
                          )}
                          {item.status === 'batal' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                              <span>Dibatalkan</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card-surface rounded-3xl p-8 sm:p-10 border border-slate-200/90 text-center space-y-4 max-w-2xl mx-auto shadow-2xs">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-2xs">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Belum Ada Riwayat Penyetoran Sampah
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Halo <span className="font-bold text-slate-800">{name || 'Warga'}</span>! Akun Anda siap digunakan. Mulai masukkan jenis sampah daur ulang Anda di fitur Pencocokan Rute untuk mendapatkan rekomendasi bank sampah atau pengepul dengan harga terbaik.
                </p>
              </div>
              <div className="pt-2 flex justify-center">
                <Link
                  href="/match"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs hover:shadow transition active:scale-[0.98]"
                >
                  <span>Mulai Pencocokan Rute Pertama Anda</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>
              </div>
            </div>
          )}

          {/* Collapsible Format Preview */}
          <div className="pt-4 border-t border-slate-200/70 text-center">
            <button
              type="button"
              onClick={() => setShowSampleDemo(!showSampleDemo)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-1 px-3 rounded-lg hover:bg-slate-100"
            >
              <span>{showSampleDemo ? 'Tutup contoh simulasi transaksi' : 'Lihat contoh format simulasi transaksi'}</span>
              {showSampleDemo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showSampleDemo && (
              <div className="mt-4 text-left card-surface rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs animate-in fade-in duration-200">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Format Bukti Penimbangan Mitra Pengelola Resmi
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Tabel ini akan terisi otomatis begitu Anda selesai menyetorkan sampah di fasilitas mitra.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Contoh Format
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">ID Transaksi & Tanggal</th>
                        <th className="py-3 px-4">Material Daur Ulang</th>
                        <th className="py-3 px-4">Mitra Pengelola Tujuan</th>
                        <th className="py-3 px-4 text-right">Nilai Diterima</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {SAMPLE_HISTORY.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-slate-900 block">{item.id}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{item.date}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-800">{item.materials}</p>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Total Bobot: {item.totalWeight}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900">{item.recyclerName}</p>
                            <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                              {item.recyclerType}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700 text-xs tabular-nums whitespace-nowrap">
                            Rp {item.amountRp.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
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
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: UBAH DATA DIRI & ALAMAT                                 */}
      {/* ============================================================== */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleSaveProfile}
          className="card-surface rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6 animate-in fade-in duration-200"
        >
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Ubah Informasi Pribadi & Kontak
            </h3>
            <p className="text-xs text-slate-500">
              Data ini digunakan saat penyetoran sampah dan kalkulasi rute jemput/antar ke mitra pengelola.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Data profil Anda berhasil disimpan ke sistem!</span>
            </div>
          )}

          {saveProfileError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{saveProfileError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Alamat Email (Readonly) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Alamat Email
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">(Permanen ID)</span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-medium shadow-2xs"
                />
              </div>
            </div>

            {/* Nomor Telepon / WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Nomor Telepon / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Kota / Wilayah */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Kota / Wilayah Domisili
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Contoh: Kota Bandung"
                  className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Alamat Rumah Lengkap */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Alamat Rumah / Titik Keberangkatan Default
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Nama Jalan No. XX, RT/RW, Kelurahan, Kecamatan"
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99] disabled:opacity-60"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* TAB 3: KEAMANAN & GANTI KATA SANDI                             */}
      {/* ============================================================== */}
      {activeTab === 'security' && (
        <form
          onSubmit={handleUpdatePassword}
          className="card-surface rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6 animate-in fade-in duration-200 max-w-2xl"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Keamanan Akun Warga</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Ubah Kata Sandi Akun
            </h3>
            <p className="text-xs text-slate-500">
              Pastikan kata sandi baru Anda minimal 8 karakter dan belum pernah digunakan sebelumnya.
            </p>
          </div>

          {passwordSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-950">Kata sandi berhasil diperbarui!</p>
                <p className="text-[11px] text-emerald-800">
                  Mengarahkan ke halaman login untuk memperbarui sesi masuk...
                </p>
              </div>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Kata Sandi Sekarang */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Kata Sandi Sekarang <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama Anda"
                  className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  aria-label={showCurrentPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Kata Sandi Baru */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter baru"
                  className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  aria-label={showNewPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Kombinasi huruf, angka, dan simbol lebih disarankan untuk keamanan maksimal.
              </p>
            </div>

            {/* Konfirmasi Kata Sandi Baru */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Ulangi Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi baru"
                  className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99] disabled:opacity-60"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Perbarui Kata Sandi</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
