'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Recycle, ArrowRight, Menu, X, User, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/match', label: 'Pencocokan Rute' },
    { href: '/recyclers', label: 'Direktori Pengelola' },
    { href: '/categories', label: 'Kategori Sampah' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-[#faf9f6]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-600 transition-all duration-300">
              <Recycle className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Recy<span className="text-emerald-600">Nect</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
                Circular Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Center Desktop Navigation (Clean with Black Pill Hover / Active) */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-white hover:bg-slate-900 font-medium'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA (Black Pill Button with User Circle) */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 hover:text-white hover:bg-slate-900 transition-all duration-200"
          >
            Masuk
          </Link>
          <Link
            href="/match"
            className="group inline-flex items-center gap-2.5 rounded-full bg-slate-900 pl-4 pr-1.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 hover:shadow transition-all active:scale-[0.98]"
          >
            <span>Mulai Sekarang</span>
            <div className="w-7 h-7 rounded-full bg-white/20 group-hover:bg-emerald-500 text-white flex items-center justify-center transition-colors">
              <User className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/match"
            className="rounded-full bg-slate-900 px-3 py-1.5 text-white text-xs font-bold"
          >
            Cocokkan
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-white/80"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-[#faf9f6] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-200/80 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl"
            >
              Masuk Akun
            </Link>
            <Link
              href="/match"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 text-xs font-bold text-white bg-slate-900 rounded-xl shadow-xs"
            >
              Mulai Pencocokan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
