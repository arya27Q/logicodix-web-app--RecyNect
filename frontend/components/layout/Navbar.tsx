'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  Recycle,
  ArrowRight,
  Menu,
  X,
  User,
  LogOut,
} from 'lucide-react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'recycler' | 'admin';
}

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/match', label: 'Pencocokan Rute' },
    { href: '/recyclers', label: 'Direktori Pengelola' },
    { href: '/categories', label: 'Kategori Sampah' },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchSession = async () => {
      try {
        const user = await apiClient<AuthUser>('/auth/me');
        if (isMounted) {
          // Web publik ini murni POV Warga. Hanya aktifkan sesi jika role adalah 'user' (Warga).
          if (user && user.role === 'user') {
            setCurrentUser(user);
          } else {
            setCurrentUser(null);
          }
        }
      } catch {
        if (isMounted) setCurrentUser(null);
      }
    };

    fetchSession();

    const handleAuthEvent = () => fetchSession();
    window.addEventListener('recynect-auth-changed', handleAuthEvent);
    return () => {
      isMounted = false;
      window.removeEventListener('recynect-auth-changed', handleAuthEvent);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // Abaikan error jaringan saat logout
    } finally {
      setCurrentUser(null);
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

  const getFirstName = (fullName: string) => {
    if (!fullName) return 'Warga';
    return fullName.trim().split(/\s+/)[0];
  };

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

        {/* Center Desktop Navigation */}
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

        {/* Right CTA (Khusus Sesi Warga & Navigasi Warga) */}
        <div className="hidden sm:flex items-center gap-2.5">
          {currentUser && currentUser.role === 'user' ? (
            <>
              {/* Profil Warga Terverifikasi */}
              <Link
                href="/profile"
                title={`Profil Warga: ${currentUser.name} (${currentUser.email})`}
                className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800 text-xs font-bold transition shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black shadow-xs group-hover:scale-105 transition-transform">
                  {getInitials(currentUser.name)}
                </div>
                <span className="truncate max-w-[120px]">{getFirstName(currentUser.name)}</span>
              </Link>

              <Link
                href="/match"
                className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition active:scale-[0.98]"
              >
                <span>Cari Rute</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title="Keluar dari Akun Warga"
                aria-label="Keluar dari Akun Warga"
                className="p-2 rounded-full border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-500 shadow-2xs transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {/* Tamu / Belum Login Warga */}
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 hover:text-white hover:bg-slate-900 transition-all duration-200"
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
            </>
          )}
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
            {currentUser && currentUser.role === 'user' ? (
              <>
                <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                      {getInitials(currentUser.name)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500">{currentUser.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200 uppercase">
                    Warga
                  </span>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl"
                >
                  Profil Warga
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition"
                >
                  Keluar (Logout)
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl"
                >
                  Masuk Akun
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl"
                >
                  Daftar Akun Baru
                </Link>
                <Link
                  href="/match"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-xs font-bold text-white bg-slate-900 rounded-xl shadow-xs"
                >
                  Mulai Pencocokan
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
