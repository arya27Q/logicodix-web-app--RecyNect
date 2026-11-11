'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  FileText,
  Truck,
  Scale,
  Save,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  ExternalLink,
  KeyRound,
  AlertCircle,
} from 'lucide-react';

interface CurrentRecyclerSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  recycler?: {
    id: string;
    name: string;
    managementType: string;
    description?: string;
    address: string;
    contact: string;
    operatingHours?: string;
    latitude?: number;
    longitude?: number;
    verificationStatus?: string;
  } | null;
}

export default function RecyclerProfilePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'location' | 'legal' | 'security'>('info');

  // Form states - Facility Info
  const [companyName, setCompanyName] = useState('Bank Sampah Berkah Mandiri');
  const [facilityType, setFacilityType] = useState('bank_sampah');
  const [picName, setPicName] = useState('Pengelola Bank Sampah Berkah');
  const [phone, setPhone] = useState('081298765432');
  const [email, setEmail] = useState('mitra@recynect.id');
  const [operatingHours, setOperatingHours] = useState('Senin - Sabtu: 08:00 - 15:00');
  const [facilityBio, setFacilityBio] = useState(
    'Fasilitas bank sampah dan pengolahan material daur ulang binaan lingkungan, melayani tabungan dan pencairan tunai langsung warga.'
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Location & Logistics states
  const [warehouseAddress, setWarehouseAddress] = useState(
    'Jl. Merdeka No. 12, Kelurahan Sukajaya, Bandung'
  );
  const [latitude, setLatitude] = useState('-6.914744');
  const [longitude, setLongitude] = useState('107.60981');
  const [truckAccess, setTruckAccess] = useState('Motor Roda Tiga, Mobil Pickup L300, dan Truk Engkel');
  const [scaleType, setScaleType] = useState('Timbangan Digital Duduk & Gantung (Tera Metrologi 2026)');

  // Legal & Payout states
  const [nib] = useState('9120008231092');
  const [envPermit] = useState('Izin Lingkungan SPPL No. 660.1/044/IL/2026');
  const [bankName, setBankName] = useState('Bank Central Asia (BCA)');
  const [bankAccountNumber, setBankAccountNumber] = useState('8820-1928-3310');
  const [bankAccountHolder, setBankAccountHolder] = useState('Pengelola Bank Sampah Berkah');

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [weighingPin, setWeighingPin] = useState('8891');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Fetch real profile data on mount
  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const data = await apiClient<CurrentRecyclerSession>('/auth/me');
        if (data && isMounted) {
          if (data.name) setPicName(data.name);
          if (data.email) setEmail(data.email);
          if (data.phone) setPhone(data.phone);

          if (data.recycler) {
            if (data.recycler.name) setCompanyName(data.recycler.name);
            if (data.recycler.managementType) setFacilityType(data.recycler.managementType);
            if (data.recycler.address) setWarehouseAddress(data.recycler.address);
            if (data.recycler.contact) setPhone(data.recycler.contact);
            if (data.recycler.operatingHours) setOperatingHours(data.recycler.operatingHours);
            if (data.recycler.description) setFacilityBio(data.recycler.description);
            if (data.recycler.latitude) setLatitude(data.recycler.latitude.toString());
            if (data.recycler.longitude) setLongitude(data.recycler.longitude.toString());
          }
        }
      } catch {
        // Fallback ke default demo
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');

    try {
      await apiClient('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: picName,
          phone,
          facilityName: companyName,
          managementType: facilityType,
          address: warehouseAddress,
          operatingHours,
          description: facilityBio,
        }),
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Gagal menyimpan profil.');
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword) {
      setPasswordError('Mohon isi kata sandi saat ini dan kata sandi baru.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Kata sandi baru minimal 8 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    try {
      await apiClient('/auth/password', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Gagal memperbarui kata sandi. Pastikan kata sandi lama benar.');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'MP';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Profil & Fasilitas Gudang Pengelola
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola legalitas usaha, koordinat GPS gudang, armada logistik, dan rekening pencairan dana warga.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mitra Terverifikasi Resmi</span>
          </span>
        </div>
      </div>

      {/* Main Facility Summary Card */}
      <div className="card-surface rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-amber-400 font-extrabold text-2xl flex items-center justify-center border-2 border-slate-700 shadow-md shrink-0">
            {getInitials(companyName)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{companyName}</h2>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                {facilityType.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>PIC: {picName} ({email})</span>
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Fasilitas Terhubung Sistem RecyNect • Telepon/WA: {phone}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 text-xs text-slate-500 gap-1 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Jam Layanan Timbangan
          </span>
          <span className="text-sm font-extrabold text-slate-900">{operatingHours}</span>
          <span className="text-[11px] text-emerald-700 font-semibold">Menerima Setoran Warga</span>
        </div>
      </div>

      {/* Tab Nav Buttons */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'info'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Profil Fasilitas & Pemilik</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('location')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'location'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Lokasi Gudang & Logistik</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('legal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'legal'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Legalitas & Rekening Payout</span>
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
          <span>Keamanan & PIN Timbangan</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: PROFIL FASILITAS & PIC                                  */}
      {/* ============================================================== */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Identitas Fasilitas & Kontak Operasional
            </h3>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profil dan kontak fasilitas berhasil diperbarui.</span>
              </div>
            )}

            {saveError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nama Badan Usaha / Unit Pengelola <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Kategori Skala Usaha
                </label>
                <select
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900 bg-white"
                >
                  <option value="lapak">Lapak Pengumpul Kecil (Kapasitas &lt; 2 Ton)</option>
                  <option value="pengepul">Pengepul Menengah (Kapasitas 2 - 10 Ton)</option>
                  <option value="banksampah">Bank Sampah Induk / Komunitas</option>
                  <option value="pabrik">Pabrik Pengolahan & Daur Ulang Industri (&gt; 10 Ton)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nama Pemilik / Penanggung Jawab <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nomor WhatsApp Operasional Timbangan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

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
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Jam Buka & Operasional Penimbangan
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Deskripsi Sarana & Spesifikasi Pengolahan
              </label>
              <textarea
                rows={3}
                value={facilityBio}
                onChange={(e) => setFacilityBio(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Deskripsi ini akan ditampilkan pada direktori mitra yang dapat dibaca oleh warga saat memilih rute drop-off.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99]"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Fasilitas</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* TAB 2: LOKASI GUDANG & LOGISTIK                                */}
      {/* ============================================================== */}
      {activeTab === 'location' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Lokasi Gudang, GPS & Aksesibilitas Armada
                </h3>
                <p className="text-xs text-slate-500">
                  Pastikan titik koordinat akurat agar warga dan armada pengangkut dapat dinavigasikan tepat ke gerbang timbangan.
                </p>
              </div>

              <a
                href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs"
              >
                <span>Buka di Peta</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Alamat Fisik Gudang / Drop-Point <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <textarea
                  rows={2}
                  required
                  value={warehouseAddress}
                  onChange={(e) => setWarehouseAddress(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Koordinat Latitude (Garis Lintang)
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-6.291244"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-mono font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Koordinat Longitude (Garis Bujur)
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="107.142831"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-mono font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Aksesibilitas Kendaraan Masuk
                </label>
                <div className="relative">
                  <Truck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={truckAccess}
                    onChange={(e) => setTruckAccess(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Spesifikasi Instrumen Timbangan
                </label>
                <div className="relative">
                  <Scale className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={scaleType}
                    onChange={(e) => setScaleType(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99]"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Lokasi & Spesifikasi</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LEGALITAS & REKENING PAYOUT                             */}
      {/* ============================================================== */}
      {activeTab === 'legal' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Legalitas Badan Usaha & Rekening Penyaluran Dana Warga
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nomor Induk Berusaha (NIB)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    disabled
                    value={nib}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-mono font-medium shadow-2xs cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  NIB telah diverifikasi oleh Administrator RecyNect pada 12 Feb 2025.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Dokumen Izin Lingkungan Hidup
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    disabled
                    value={envPermit}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium shadow-2xs cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Rekening Bank Payout Saldo Setoran Warga
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Nama Bank Mitra
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Nomor Rekening Bank
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-mono font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Atas Nama Rekening
                  </label>
                  <input
                    type="text"
                    value={bankAccountHolder}
                    onChange={(e) => setBankAccountHolder(e.target.value)}
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99]"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Rekening Payout</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* TAB 4: KEAMANAN & PIN TIMBANGAN                                */}
      {/* ============================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveSecurity} className="card-surface rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Pembaruan Kata Sandi Akun Mitra
            </h3>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kata sandi operasional berhasil diperbarui.</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Sandi Saat Ini
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi sandi baru"
                    className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-medium text-slate-900"
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

            <div className="pt-4 border-t border-slate-100">
              <div className="max-w-xs">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  PIN Otorisasi Timbangan Digital (4-Digit)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={weighingPin}
                  onChange={(e) => setWeighingPin(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-2xs font-mono font-bold tracking-widest text-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Digunakan staf operator timbangan saat mengonfirmasi nota cetak timbang warga.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition active:scale-[0.99]"
              >
                <KeyRound className="w-4 h-4" />
                <span>Simpan Kredensial Keamanan</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
