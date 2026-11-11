'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { ManagementType } from '@/types';
import { apiClient } from '@/lib/api-client';

interface RecyclerPreview {
  id: string;
  name: string;
  type: ManagementType;
  typeLabel: string;
  address: string;
  contact: string;
  distanceKm: number;
  materialsCount: number;
  sampleMaterials: string[];
  isVerified: boolean;
  hours: string;
}

const DEMO_RECYCLERS: RecyclerPreview[] = [
  {
    id: 'rec-banksampah-1',
    name: 'Bank Sampah Berkah Mandiri',
    type: 'bank_sampah',
    typeLabel: 'Bank Sampah RW',
    address: 'Jl. Merdeka No. 12, Kel. Sukajaya, Bandung',
    contact: '081298765432',
    distanceKm: 1.8,
    materialsCount: 4,
    sampleMaterials: ['Kardus', 'Botol PET', 'Minyak Jelantah', 'Kertas HVS'],
    isVerified: true,
    hours: 'Senin - Sabtu (08:00 - 15:00)',
  },
  {
    id: 'rec-pengepul-1',
    name: 'Pengepul Logam & Plastik Jaya Abadi',
    type: 'pengepul',
    typeLabel: 'Pengepul Berizin',
    address: 'Jl. Raya Kopo No. 88, Bandung',
    contact: '085712348899',
    distanceKm: 2.1,
    materialsCount: 5,
    sampleMaterials: ['Botol PET', 'Kardus', 'Aluminium', 'Kertas HVS', 'Besi Tua'],
    isVerified: true,
    hours: 'Setiap Hari (07:30 - 17:00)',
  },
  {
    id: 'rec-tps3r-1',
    name: 'TPS3R Resik Barokah Kelurahan',
    type: 'tps3r',
    typeLabel: 'Fasilitas TPS3R',
    address: 'Jl. Terusan Buah Batu No. 45, Bandung',
    contact: '082155443322',
    distanceKm: 3.5,
    materialsCount: 3,
    sampleMaterials: ['Kardus', 'Kertas HVS', 'Botol PET'],
    isVerified: true,
    hours: 'Senin - Jumat (08:00 - 14:00)',
  },
  {
    id: 'rec-industri-1',
    name: 'PT Daur Ulang Nusantara (Pabrik Peleburan)',
    type: 'recycler_industry',
    typeLabel: 'Industri Daur Ulang',
    address: 'Kawasan Industri Cimareme Blok C No. 5, Bandung Barat',
    contact: '022-6868990',
    distanceKm: 8.2,
    materialsCount: 3,
    sampleMaterials: ['Plastik PET Bal (Min 50kg)', 'Aluminium Bal (Min 20kg)', 'Kardus Bal (Min 100kg)'],
    isVerified: true,
    hours: 'Senin - Jumat (08:00 - 17:00)',
  },
];

export default function RecyclersPage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [recyclersList, setRecyclersList] = useState<RecyclerPreview[]>(DEMO_RECYCLERS);

  useEffect(() => {
    let isMounted = true;
    apiClient<any[]>('/recyclers')
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        const typeLabelMap: Record<string, string> = {
          bank_sampah: 'Bank Sampah Unit/Induk',
          pengepul: 'Pengepul Berizin',
          tps3r: 'Fasilitas TPS3R',
          recycler_industry: 'Pabrik Daur Ulang',
        };
        const mapped: RecyclerPreview[] = data.map((r) => ({
          id: r.id,
          name: r.name,
          type: r.managementType || 'pengepul',
          typeLabel: typeLabelMap[r.managementType] || 'Pengepul Berizin',
          address: r.address || 'Alamat operasional',
          contact: r.contact || '-',
          distanceKm: 0,
          materialsCount: r.materials?.length || 0,
          sampleMaterials: Array.isArray(r.materials)
            ? r.materials.map((m: any) => m.category?.name || 'Material').slice(0, 4)
            : [],
          isVerified: r.verificationStatus === 'verified',
          hours: r.operatingHours || 'Senin - Sabtu (08:00 - 17:00)',
        }));
        setRecyclersList(mapped);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = recyclersList.filter((rec) => {
    const matchesSearch =
      rec.name.toLowerCase().includes(search.toLowerCase()) ||
      rec.address.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || rec.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Direktori Pengelola Sampah</h1>
        <p className="text-slate-600 text-sm mt-1">
          Katalog lengkap mitra penerima sampah daur ulang di area Bandung dan sekitarnya.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Semua Pengelola' },
            { id: 'bank_sampah', label: 'Bank Sampah' },
            { id: 'pengepul', label: 'Pengepul' },
            { id: 'tps3r', label: 'TPS3R' },
            { id: 'recycler_industry', label: 'Industri' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedType === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau kelurahan..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Recyclers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((rec) => (
          <div key={rec.id} className="card-surface rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{rec.name}</h3>
                    {rec.isVerified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Terverifikasi
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{rec.typeLabel}</span>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md tabular-nums">
                  ± {rec.distanceKm} km
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{rec.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{rec.contact} • {rec.hours}</span>
                </div>
              </div>

              {/* Sample materials */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500">Menerima ({rec.materialsCount} Material):</span>
                <div className="flex flex-wrap gap-1">
                  {rec.sampleMaterials.map((m, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href={`tel:${rec.contact}`}
                className="font-semibold text-slate-600 hover:text-slate-900"
              >
                Telepon Mitra
              </a>
              <Link
                href={`/recyclers/${rec.id}`}
                className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>Lihat Profil & Daftar Harga</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
