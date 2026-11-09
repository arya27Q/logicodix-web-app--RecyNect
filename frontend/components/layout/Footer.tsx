'use client';

import React from 'react';
import Link from 'next/link';
import { Recycle, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                <Recycle className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Recy<span className="text-emerald-600">Nect</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md">
              Platform cerdas penghubung masyarakat dengan mitra pengelola sampah daur ulang terverifikasi
              (Bank Sampah, Pengepul, TPS3R, dan Industri). Mengoptimalkan nilai rupiah dan efisiensi rute dalam sekali jalan.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transparansi harga indikatif dan verifikasi titik koordinat mitra.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/match" className="hover:text-emerald-600 transition">
                  Formulir Pencocokan
                </Link>
              </li>
              <li>
                <Link href="/recyclers" className="hover:text-emerald-600 transition">
                  Direktori Pengelola
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-emerald-600 transition">
                  Kategori Sampah & Satuan
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-600 transition">
                  Portal Mitra Pengelola
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Transparansi</h4>
            <p className="text-xs text-slate-500 leading-normal">
              RecyNect adalah platform pencocokan data dan rute digital, bukan pihak pembeli atau armada pengangkut fisik secara langsung.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Sistem Aktif (Bandung Demo Region)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 RecyNect • Logika Daur Ulang Berkelanjutan.</p>
          <p className="flex items-center gap-1 text-slate-500">
            Dibuat untuk efisiensi ekonomi sirkular Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
};
