import React from 'react';
import Link from 'next/link';
import { ArrowRight, Package, Wine, Droplets, Box, FileText, Wrench, Sparkles } from 'lucide-react';

const CATEGORIES_DATA = [
  {
    id: 'kardus',
    name: 'Kardus / Karton Cokelat',
    unit: 'kg',
    priceRange: 'Rp 1.800 - Rp 2.500 / kg',
    description: 'Kardus boks pengiriman barang, kotak mie instan, karton cokelat tebal.',
    tips: 'Lipat dan dipipihkan agar hemat tempat, lepaskan lakban plastik tebal, ikat dengan tali rafia.',
    icon: <Package className="w-6 h-6 text-amber-700" />,
    badgeBg: 'bg-amber-50 border-amber-200',
  },
  {
    id: 'pet',
    name: 'Botol Plastik PET Bening',
    unit: 'kg',
    priceRange: 'Rp 3.500 - Rp 5.500 / kg',
    description: 'Botol air mineral transparan, botol minuman soda, atau plastik berkode daur ulang #1.',
    tips: 'Kosongkan sisa cairan manis, bilas air bersih sekali, lepas tutup dan cincin segel, lalu injak gepeng.',
    icon: <Wine className="w-6 h-6 text-emerald-700" />,
    badgeBg: 'bg-emerald-50 border-emerald-200',
  },
  {
    id: 'minyak',
    name: 'Minyak Jelantah',
    unit: 'liter',
    priceRange: 'Rp 6.000 - Rp 7.500 / liter',
    description: 'Minyak goreng bekas pakai rumah tangga atau usaha kuliner untuk bahan baku biodiesel.',
    tips: 'Dinginkan terlebih dahulu, saring dari sisa remah makanan atau endapan tepung, simpan dalam jeriken/botol plastik tertutup.',
    icon: <Droplets className="w-6 h-6 text-sky-700" />,
    badgeBg: 'bg-sky-50 border-sky-200',
  },
  {
    id: 'alum',
    name: 'Kaleng Aluminium & Logam Ringan',
    unit: 'kg',
    priceRange: 'Rp 12.000 - Rp 17.000 / kg',
    description: 'Kaleng minuman bersoda, kaleng susu kental manis, atau wadah aerosol yang sudah habis.',
    tips: 'Pastikan isi cairan benar-benar habis, cuci bersih jika ada sisa manis, dipipihkan agar menghemat volume.',
    icon: <Box className="w-6 h-6 text-purple-700" />,
    badgeBg: 'bg-purple-50 border-purple-200',
  },
  {
    id: 'hvs',
    name: 'Kertas HVS / Buku Tulis',
    unit: 'kg',
    priceRange: 'Rp 2.000 - Rp 3.000 / kg',
    description: 'Kertas dokumen cetak putih, kertas folio, buku tulis bekas tanpa sampul plastik.',
    tips: 'Kering dan tidak terkena minyak atau air, pisahkan dari kertas koran atau kertas cokelat.',
    icon: <FileText className="w-6 h-6 text-indigo-700" />,
    badgeBg: 'bg-indigo-50 border-indigo-200',
  },
  {
    id: 'besi',
    name: 'Besi Tua & Logam Berat',
    unit: 'kg',
    priceRange: 'Rp 4.000 - Rp 6.000 / kg',
    description: 'Rangka besi, paku, kawat, peralatan rumah tangga berbahan logam/baja.',
    tips: 'Kumpulkan dalam wadah yang aman dan terbebas dari benda tajam berbahaya.',
    icon: <Wrench className="w-6 h-6 text-slate-700" />,
    badgeBg: 'bg-slate-100 border-slate-200',
  },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Katalog Resmi Jenis Material
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Kategori Sampah Daur Ulang & Standar Mutu
        </h1>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          Pelajari standar satuan, kisaran harga pasar indikatif, serta tips pemilahan agar sampah Anda
          memenuhi syarat penerimaan mitra pengelola dan bernilai jual optimal.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES_DATA.map((cat) => (
          <div key={cat.id} className="card-surface rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-2xl border flex items-center justify-center ${cat.badgeBg}`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                  Satuan: {cat.unit}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.description}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <span className="text-[11px] font-semibold text-amber-900 block">Estimasi Kisaran Harga:</span>
                <span className="text-sm font-extrabold text-slate-900 tabular-nums">{cat.priceRange}</span>
              </div>

              <div className="text-xs space-y-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tips Penyiapan Mutu:</span>
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">{cat.tips}</p>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100">
              <Link
                href="/match"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 rounded-xl transition"
              >
                <span>Cocokkan Material Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
