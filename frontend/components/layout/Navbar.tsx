import React from 'react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xl">
              ♻
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Sampah<span className="text-emerald-600">Hub</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
            <Link href="/match" className="hover:text-emerald-600 transition">
              Cari Pengelola (Matching)
            </Link>
            <Link href="/recyclers" className="hover:text-emerald-600 transition">
              Direktori Pengelola
            </Link>
            <Link href="/categories" className="hover:text-emerald-600 transition">
              Kategori Sampah
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 hover:text-emerald-600 px-3 py-1.5"
          >
            Masuk
          </Link>
          <Link
            href="/match"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
          >
            Cocokkan Sampah
          </Link>
        </div>
      </div>
    </header>
  );
};

