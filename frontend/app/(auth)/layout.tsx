import React from 'react';
import Link from 'next/link';
import { Recycle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Brand Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-600 transition-all">
            <Recycle className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Recy<span className="text-emerald-600">Nect</span>
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 shadow-2xs transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Main Form Container (Spacious Split Screen Support) */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-5xl xl:max-w-6xl">
          {children}
        </div>
      </div>

      {/* Auth Footer */}
      <div className="py-6 text-center text-xs text-slate-500 border-t border-slate-200/60">
        <p>© 2026 RecyNect • Platform Logistik Daur Ulang & Transparansi Harga</p>
      </div>
    </div>
  );
}
