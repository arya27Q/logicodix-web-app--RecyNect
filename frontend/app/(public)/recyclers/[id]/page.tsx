import React, { Suspense } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  ArrowRight,
  Truck,
  Wallet,
  CheckCircle2,
} from 'lucide-react';

interface RecyclerMaterialDetail {
  categoryId: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  minQty: number;
  requirements: string;
  isAvailable: boolean;
}

interface RecyclerDetail {
  id: string;
  name: string;
  type: string;
  badge: string;
  address: string;
  contact: string;
  operatingHours: string;
  verifiedDate: string;
  vehicleAccess: string;
  description: string;
  paymentMethods: string;
  materials: RecyclerMaterialDetail[];
}

const RECYCLERS_DATA: Record<string, RecyclerDetail> = {
  'rec-banksampah-1': {
    id: 'rec-banksampah-1',
    name: 'Bank Sampah Berkah Mandiri',
    type: 'Bank Sampah RW',
    badge: 'Mitra Terverifikasi RW Sukajaya',
    address: 'Jl. Merdeka No. 12, Kelurahan Sukajaya, Kecamatan Sukajadi, Kota Bandung',
    contact: '081298765432',
    operatingHours: 'Senin - Sabtu (08:00 - 15:00)',
    verifiedDate: 'Januari 2026',
    vehicleAccess: 'Akses Motor, Gerobak, dan Mobil Pribadi',
    description:
      'Bank sampah binaan lingkungan RW yang melayani tabungan sampah warga dan pembayaran tunai langsung di tempat dengan timbangan digital akurat. Sangat ideal untuk setoran sampah rumah tangga rutin dengan kuantitas minimal rendah.',
    paymentMethods:
      'Pembayaran tunai langsung saat penimbangan atau dicatat ke Buku Tabungan Sampah Warga / transfer bank.',
    materials: [
      {
        categoryId: 'cat-kardus',
        name: 'Kardus / Karton Cokelat',
        category: 'Kertas / Karton',
        price: 2000,
        unit: 'kg',
        minQty: 1.0,
        requirements: 'Kering, bersih dari staples besar atau lakban tebal berlebih, diikat rapi.',
        isAvailable: true,
      },
      {
        categoryId: 'cat-pet',
        name: 'Botol Plastik PET Bening',
        category: 'Plastik Daur Ulang',
        price: 3500,
        unit: 'kg',
        minQty: 0.5,
        requirements: 'Sudah dipipihkan, tutup botol dilepas, bersih dari sisa cairan manis.',
        isAvailable: true,
      },
      {
        categoryId: 'cat-minyak',
        name: 'Minyak Jelantah',
        category: 'Minyak Nabati Bekas',
        price: 6500,
        unit: 'liter',
        minQty: 1.0,
        requirements: 'Disaring dari sisa remah makanan, ditampung dalam jeriken/botol tertutup rapat.',
        isAvailable: true,
      },
      {
        categoryId: 'cat-hvs',
        name: 'Kertas HVS & Buku Dokumen',
        category: 'Kertas',
        price: 2200,
        unit: 'kg',
        minQty: 1.0,
        requirements: 'Kertas putih bersih, kering, tidak terkena minyak atau air, tanpa cover plastik mika.',
        isAvailable: true,
      },
    ],
  },
  'rec-pengepul-1': {
    id: 'rec-pengepul-1',
    name: 'Pengepul Logam & Plastik Jaya Abadi',
    type: 'Pengepul Berizin',
    badge: 'Pengepul Resmi Dinas LH',
    address: 'Jl. Raya Kopo No. 88, Kelurahan Babakan Asih, Kota Bandung',
    contact: '085712348899',
    operatingHours: 'Setiap Hari (07:30 - 17:00)',
    verifiedDate: 'Januari 2026',
    vehicleAccess: 'Akses Motor Roda Tiga, Mobil Pickup L300, dan Truk Engkel',
    description:
      'Pengepul resmi berizin skala menengah yang menerima partai kecil maupun volume besar dengan pembayaran tunai di tempat. Memiliki fasilitas timbang gantung dan duduk digital berkalibrasi resmi serta menerima material logam bernilai tinggi.',
    paymentMethods:
      'Uang tunai (cash) langsung cair di tempat setelah nota timbangan dicetak, atau transfer instant QRIS / e-wallet.',
    materials: [
      {
        categoryId: 'cat-pet',
        name: 'Botol Plastik PET Bening',
        category: 'Plastik Daur Ulang',
        price: 4200,
        unit: 'kg',
        minQty: 3.0,
        requirements: 'Bersih, tanpa kotoran tanah/lumpur, tutup botol dilepas.',
        isAvailable: true,
      },
      {
        categoryId: 'cat-kardus',
        name: 'Kardus / Karton Tebal',
        category: 'Kertas / Karton',
        price: 2500,
        unit: 'kg',
        minQty: 5.0,
        requirements: 'Kering dan tidak berjamur, dilipat dan diikat dengan tali rafia kuat.',
        isAvailable: true,
      },
      {
        categoryId: 'cat-alum',
        name: 'Kaleng Aluminium / Minuman',
        category: 'Logam Ringan',
        price: 14000,
        unit: 'kg',
        minQty: 1.0,
        requirements: 'Kaleng dipipihkan / diinjak gepeng, cairan kosong, bebas kontaminan tanah.',
        isAvailable: true,
      },
      {
        categoryId: 'cat-hvs',
        name: 'Kertas HVS / Buku Dokumen',
        category: 'Kertas',
        price: 2800,
        unit: 'kg',
        minQty: 5.0,
        requirements: 'Kertas putih tidak bercampur koran atau plastik sampul.',
        isAvailable: true,
      },
      {
        categoryId: 'cat-besi',
        name: 'Besi Tua & Logam Berat',
        category: 'Logam Berat',
        price: 4500,
        unit: 'kg',
        minQty: 5.0,
        requirements: 'Bebas dari adukan semen/krikil tebal, aman tanpa tabung gas atau bahan mudah terbakar.',
        isAvailable: true,
      },
    ],
  },
  'rec-tps3r-1': {
    id: 'rec-tps3r-1',
    name: 'TPS3R Resik Barokah Kelurahan',
    type: 'Fasilitas TPS3R',
    badge: 'Fasilitas Pemerintah Kota Bandung',
    address: 'Jl. Terusan Buah Batu No. 45, Batununggal, Kota Bandung',
    contact: '082155443322',
    operatingHours: 'Senin - Jumat (08:00 - 14:00)',
    verifiedDate: 'Februari 2026',
    vehicleAccess: 'Akses Motor, Gerobak Warga, dan Mobil Pickup',
    description:
      'Tempat Pengolahan Sampah Reuse-Reduce-Recycle binaan Dinas Lingkungan Hidup yang fokus menyerap sampah anorganik terpilah warga kelurahan guna menekan volume timbulan sampah ke TPA Sarimukti.',
    paymentMethods:
      'Insentif tunai warga atau transfer dompet digital (GoPay/OVO/DANA) sesuai rekap timbangan.',
    materials: [
      {
        categoryId: 'cat-kardus',
        name: 'Kardus / Karton Cokelat',
        category: 'Kertas / Karton',
        price: 1600,
        unit: 'kg',
        minQty: 2.0,
        requirements: 'Bersih dan kering, terlipat rapi dalam ikatan.',
        isAvailable: true,
      },
      {
        categoryId: 'cat-hvs',
        name: 'Kertas HVS / Buku Dokumen',
        category: 'Kertas',
        price: 2500,
        unit: 'kg',
        minQty: 2.0,
        requirements: 'Kertas putih bersih tanpa jilid kawat tebal atau lem plastik keras.',
        isAvailable: true,
      },
      {
        categoryId: 'cat-pet',
        name: 'Botol Plastik PET Bening',
        category: 'Plastik Daur Ulang',
        price: 3200,
        unit: 'kg',
        minQty: 1.0,
        requirements: 'Botol air mineral kosong, dibilas air sekali dan dipadatkan gepeng.',
        isAvailable: true,
      },
    ],
  },
  'rec-industri-1': {
    id: 'rec-industri-1',
    name: 'PT Daur Ulang Nusantara (Pabrik Peleburan)',
    type: 'Industri Daur Ulang',
    badge: 'Pabrik Pengolah Skala Industri',
    address: 'Kawasan Industri Cimareme Blok C No. 5, Ngamprah, Bandung Barat',
    contact: '022-6868990',
    operatingHours: 'Senin - Jumat (08:00 - 17:00)',
    verifiedDate: 'Januari 2026',
    vehicleAccess: 'Akses Truk Fuso, Colt Diesel Double (CDD), dan Truk Kontainer',
    description:
      'Pabrik peleburan dan manufaktur daur ulang skala industri yang menerima setoran volume besar (partai bal press atau cacahan bersih) dari pengepul dan komunitas dengan penawaran harga pabrik tertinggi regional Jawa Barat.',
    paymentMethods:
      'Transfer rekening bank resmi (BCA / Mandiri / BNI) diterbitkan hari kerja H+0 setelah surat timbang jembatan (weighbridge) disetujui.',
    materials: [
      {
        categoryId: 'cat-pet',
        name: 'Plastik PET Bal Press / Cacahan Murni',
        category: 'Plastik Industri',
        price: 5500,
        unit: 'kg',
        minQty: 50.0,
        requirements: 'Grade A murni transparan/biru muda, sudah dipres kubus bal atau dicacah rapi tanpa label PVC.',
        isAvailable: true,
      },
      {
        categoryId: 'cat-alum',
        name: 'Kaleng Aluminium Bal Press',
        category: 'Logam Industri',
        price: 16500,
        unit: 'kg',
        minQty: 20.0,
        requirements: 'Blok bal pres murni aluminium bekas minuman tanpa kontaminan besi atau timbal.',
        isAvailable: true,
      },
      {
        categoryId: 'cat-kardus',
        name: 'Kardus Industri Bal Press',
        category: 'Kertas Industri',
        price: 2600,
        unit: 'kg',
        minQty: 100.0,
        requirements: 'Bal padat kering berikat kawat baja, kadar air maksimal 12%, bebas minyak atau limbah B3.',
        isAvailable: true,
      },
    ],
  },
};

async function RecyclerDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Lookup data pengelola berdasarkan ID yang diklik
  const recycler = RECYCLERS_DATA[id] || {
    id,
    name: 'Pengelola Mitra Daur Ulang',
    type: 'Mitra Pengelola Berizin',
    badge: 'Mitra Terverifikasi Sistem',
    address: 'Area Layanan Kota Bandung & Sekitarnya',
    contact: '081200000000',
    operatingHours: 'Senin - Sabtu (08:00 - 16:00)',
    verifiedDate: '2026',
    vehicleAccess: 'Akses Kendaraan Standar',
    description:
      'Fasilitas pengolahan sampah daur ulang terdaftar pada platform RecyNect dengan komitmen penimbangan adil dan transparansi harga beli.',
    paymentMethods: 'Pembayaran tunai langsung di lokasi atau transfer bank.',
    materials: [
      {
        categoryId: 'cat-kardus',
        name: 'Kardus / Karton Cokelat',
        category: 'Kertas',
        price: 2000,
        unit: 'kg',
        minQty: 2.0,
        requirements: 'Kering dan diikat rapi',
        isAvailable: true,
      },
      {
        categoryId: 'cat-pet',
        name: 'Botol Plastik PET Bening',
        category: 'Plastik',
        price: 3800,
        unit: 'kg',
        minQty: 2.0,
        requirements: 'Bersih tanpa tutup botol',
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
                {recycler.badge} ({recycler.verifiedDate})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {recycler.name}
            </h1>

            <div className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-600 max-w-xl">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{recycler.address}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl pt-1">
              {recycler.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
            <a
              href={`tel:${recycler.contact}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition active:scale-[0.98]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi Pengelola ({recycler.contact})</span>
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(recycler.name + ' ' + recycler.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Petunjuk Arah Google Maps</span>
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
                <span>Buka Hari Ini • Menerima Setoran Warga</span>
              </div>
            </div>

            <div className="card-surface rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" />
                Sistem Pembayaran
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {recycler.paymentMethods}
              </p>
            </div>

            <div className="card-surface rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                Akses Armada & Kendaraan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {recycler.vehicleAccess}
              </p>
            </div>
          </div>

          {/* Right Column: Accepted Materials Data Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Ketentuan Harga Beli Material</h3>
                <p className="text-xs text-slate-500">
                  Daftar material daur ulang yang resmi diterima saat ini oleh fasilitas ini.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {recycler.materials.length} Jenis Sampah
              </span>
            </div>

            {/* Pricing Data Table */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200 tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Nama Material</th>
                      <th className="px-4 py-3">Harga Beli</th>
                      <th className="px-4 py-3">Min. Setor</th>
                      <th className="px-4 py-3">Syarat Mutu Fisik</th>
                      <th className="px-4 py-3 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recycler.materials.map((mat, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">{mat.name}</div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                            {mat.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-extrabold text-emerald-700 tabular-nums text-sm whitespace-nowrap">
                          Rp {mat.price.toLocaleString('id-ID')} <span className="text-[11px] font-normal text-slate-500">/ {mat.unit}</span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-700 tabular-nums whitespace-nowrap">
                          Min. {mat.minQty} {mat.unit}
                        </td>
                        <td className="px-4 py-3.5 text-[11px] text-slate-600 max-w-xs leading-relaxed">
                          {mat.requirements}
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <Link
                            href={`/match?category=${mat.categoryId}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition active:scale-95"
                          >
                            <span>Cocokkan</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Freshness & Quality Assurance banner */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-emerald-950 block">Jaminan Transparansi Harga & Mutu RecyNect</span>
                Seluruh harga beli di atas dijamin transparan tanpa potongan tersembunyi. Silakan cocokkan sampah Anda melalui fitur pencocokan rute untuk menghitung estimasi pendapatan bersih.
              </div>
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
