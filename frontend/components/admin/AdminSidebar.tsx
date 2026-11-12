'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  LayoutDashboard,
  UserCheck,
  Scale,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Boxes,
  User,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  pendingVerificationsCount?: number;
  adminName?: string;
  adminRoleLabel?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AD';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen = true,
  onClose,
  pendingVerificationsCount = 0,
  adminName = 'Administrator',
  adminRoleLabel = 'Admin Console',
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutError, setLogoutError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLogoutError('');
    setIsLoggingOut(true);
    try {
      await apiClient('/auth/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Logout gagal. Coba lagi.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    {
      label: 'Overview',
      href: '/admin',
      icon: <LayoutDashboard className="w-4 h-4" aria-hidden="true" />,
      exact: true,
    },
    {
      label: 'Verifikasi Pengelola',
      href: '/admin/verifications',
      icon: <UserCheck className="w-4 h-4" aria-hidden="true" />,
      badge: pendingVerificationsCount > 0 ? pendingVerificationsCount : undefined,
    },
    {
      label: 'Kategori Master',
      href: '/admin/categories',
      icon: <Boxes className="w-4 h-4" aria-hidden="true" />,
    },
    {
      label: 'Audit Harga Pasar',
      href: '/admin/price-audit',
      icon: <Scale className="w-4 h-4" aria-hidden="true" />,
    },
    {
      label: 'Profil Administrator',
      href: '/admin/profile',
      icon: <User className="w-4 h-4" aria-hidden="true" />,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Navigasi Administrator"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col transition-transform duration-200 ease-in-out motion-reduce:transition-none lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-extrabold shadow-sm">
              <ShieldCheck className="w-5 h-5 text-slate-950" aria-hidden="true" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">
                RecyNect
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        <div className="flex-1 py-5 px-3 space-y-6 overflow-y-auto">
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Menu Utama
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-slate-950' : 'text-slate-300'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full tabular-nums ${
                          isActive
                            ? 'bg-slate-950 text-white'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Navigasi Publik
            </p>
            <nav className="space-y-1">
              <Link
                href="/categories"
                target="_blank"
                className="flex items-center justify-between min-h-[44px] px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span>Katalog Kategori Publik</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
              </Link>
              <Link
                href="/match"
                target="_blank"
                className="flex items-center justify-between min-h-[44px] px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span>Engine Pencocokan</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between min-h-[44px] px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span>Landing Page Publik</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
              </Link>
            </nav>
          </div>
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/40 shrink-0">
          {logoutError && (
            <p role="alert" className="mb-2 px-2 text-xs text-rose-300">
              {logoutError}
            </p>
          )}
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-2">
            <Link
              href="/admin/profile"
              onClick={onClose}
              className="flex items-center gap-2.5 min-w-0 group hover:opacity-90 transition rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                {getInitials(adminName)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                  {adminName}
                </p>
                <p className="text-[10px] text-emerald-300 font-semibold truncate">
                  {adminRoleLabel}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Keluar dari sesi admin"
              aria-label="Keluar dari sesi admin"
              className="min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-300 hover:text-rose-300 hover:bg-slate-700/60 transition shrink-0 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 flex items-center justify-center"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
