import React, { Suspense } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
} from 'lucide-react';

async function RecyclerDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Mock data for recycler details
  const recycler = {
    id,
    name: 'Pengepul Logam & Plastik Jaya Abadi',
    type: 'Pengepul Berizin',
    address: 'Jl. Raya Kopo No. 88, Kelurahan Babakan Asih, Kota Bandung',
    contact: '085712348899',
    operatingHours: 'Setiap Hari (07:30 - 17:00)',
    verifiedDate: 'Januari 2026',
    materials: [
      {
        name: 'Botol Plastik PET Bening',
        category: 'Plastik',
        price: 4200,
        unit: 'kg',
        minQty: 3.0,
        requirements: 'Bersih, tanpa kotoran tanah/lumpur, tutup botol dilepas',
        isAvailable: true,
      },
      {
        name: 'Kardus / Karton Tebal',
        category: 'Kertas',
        price: 2500,
        unit: 'kg',
        minQty: 5.0,
        requirements: 'Kering dan tidak berjamur, diikat rapi',
        isAvailable: true,
      },
      {
        name: 'Kaleng Aluminium / Minuman',
        category: 'Logam',
        price: 14000,
        unit: 'kg',
        minQty: 1.0,
        requirements: 'Kaleng dipipihkan / diinjak gepeng, cairan kosong',
        isAvailable: true,
      },
      {
        name: 'Kertas HVS / Buku Dokumen',
        category: 'Kertas',
        price: 2800,
        unit: 'kg',
        minQty: 5.0,
        requirements: 'Kertas putih tidak bercampur koran atau plastik',
        isAvailable: true,
      },
      {
        name: 'Besi Tua Campur',
        category: 'Logam',
        price: 4500,
        unit: 'kg',
        minQty: 5.0,
        requirements: 'Bebas dari semen/krikil tebal',
        isAvailable: true,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/recyclers"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Direktori Pengelola</span>
      </Link>

      {/* Recycler Profile Header Card */}
      <div className="card-elevated rounded-3xl p-6 sm:p-8 bg-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {recycler.type}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Mitra Terverifikasi ({recycler.verifiedDate})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {recycler.name}
            </h1>

            <div className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-600 max-w-xl">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{recycler.address}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
            <a
              href={`tel:${recycler.contact}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition active:scale-[0.98]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi ({recycler.contact})</span>
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(recycler.name + ' ' + recycler.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Petunjuk Arah Peta</span>
            </a>
          </div>
        </div>

        {/* 2-Column Info & Pricing Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Left Column: Operational Specs */}
          <div className="lg:col-span-4 space-y-4">
            <div className="card-surface rounded-2xl p-5 space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                Jadwal Operasional
              </h3>
              <p className="text-sm font-semibold text-slate-900">{recycler.operatingHours}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Buka Sekarang • Menerima Setoran Warga</span>
              </div>
            </div>

            <div className="card-surface rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Sistem Pembayaran
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pembayaran dilakukan langsung di tempat secara tunai (cash) atau transfer bank / e-wallet
                setelah proses penimbangan disepakati.
              </p>
            </div>
          </div>

          {/* Right Column: Accepted Materials Data Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Ketentuan Harga Beli Material</h3>
                <p className="text-xs text-slate-500">Daftar material yang saat ini aktif diterima oleh pengelola ini.</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">{recycler.materials.length} Material</span>
            </div>

            {/* Pricing Data Table */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200 tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Nama Material</th>
                      <th className="px-4 py-3">Harga Beli</th>
                      <th className="px-4 py-3">Min. Setoran</th>
                      <th className="px-4 py-3">Syarat Mutu Fisik</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recycler.materials.map((mat, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3.5 font-bold text-slate-900">
                          {mat.name}
                        </td>
                        <td className="px-4 py-3.5 font-extrabold text-emerald-700 tabular-nums text-sm">
                          Rp {mat.price.toLocaleString('id-ID')} <span className="text-[11px] font-normal text-slate-500">/ {mat.unit}</span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-700 tabular-nums">
                          Min. {mat.minQty} {mat.unit}
                        </td>
                        <td className="px-4 py-3.5 text-[11px] text-slate-500 max-w-xs">
                          {mat.requirements}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Aktif
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Freshness timestamp */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 px-1">
              <span>* Harga dapat berubah sewaktu-waktu mengikuti dinamika harga daur ulang regional.</span>
              <span className="font-semibold text-slate-500">Diperbarui: 3 hari lalu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecyclerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Memuat informasi profil pengelola...</p>
        </div>
      }
    >
      <RecyclerDetailContent params={params} />
    </Suspense>
  );
}
