'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserCheck,
  Layers,
  Scale,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronRight,
  Boxes,
  User,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  pendingVerificationsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen = true,
  onClose,
  pendingVerificationsCount = 3,
}) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Overview',
      href: '/admin',
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true,
    },
    {
      label: 'Verifikasi Pengelola',
      href: '/admin/verifications',
      icon: <UserCheck className="w-4 h-4" />,
      badge: pendingVerificationsCount > 0 ? pendingVerificationsCount : undefined,
    },
    {
      label: 'Kategori Master',
      href: '/admin/categories',
      icon: <Boxes className="w-4 h-4" />,
    },
    {
      label: 'Audit Harga Pasar',
      href: '/admin/price-audit',
      icon: <Scale className="w-4 h-4" />,
    },
    {
      label: 'Profil Administrator',
      href: '/admin/profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-extrabold shadow-sm">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
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

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            v2.4
          </span>
        </div>

        {/* Navigation Section */}
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
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-slate-950' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full tabular-nums ${
                          isActive
                            ? 'bg-slate-950 text-white'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
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
              Navigasi Cepat
            </p>
            <nav className="space-y-1">
              <Link
                href="/match"
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
              >
                <span>Lihat Engine Pencocokan</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
              >
                <span>Landing Page Publik</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </nav>
          </div>
        </div>

        {/* User Profile & Logout Bottom Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <Link
              href="/admin/profile"
              onClick={onClose}
              className="flex items-center gap-2.5 min-w-0 group hover:opacity-90 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                AP
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                  Arya Pratama
                </p>
                <p className="text-[10px] text-emerald-400 font-semibold truncate">
                  Super Administrator
                </p>
              </div>
            </Link>

            <Link
              href="/admin/login"
              title="Keluar dari sesi admin"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

