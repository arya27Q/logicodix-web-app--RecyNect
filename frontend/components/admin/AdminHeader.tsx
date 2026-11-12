'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, Bell, ShieldAlert, Scale, CheckCircle2 } from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
  pendingVerificationsCount?: number;
  priceAlertCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  title = 'Console Administrator',
  subtitle = 'Pengawasan mitra pengelola, master kategori, dan audit harga',
  pendingVerificationsCount = 0,
  priceAlertCount = 0,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const totalAlerts = pendingVerificationsCount + priceAlertCount;

  useEffect(() => {
    if (!isNotifOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsNotifOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  return (
    <header className="h-16 px-4 sm:px-8 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="min-w-[44px] min-h-[44px] p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-none truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-slate-600 font-medium hidden sm:block mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          onClick={() => setIsNotifOpen((prev) => !prev)}
          aria-expanded={isNotifOpen}
          aria-haspopup="true"
          aria-label={`Peringatan pengawasan (${totalAlerts} perlu tindakan)`}
          className="relative min-w-[44px] min-h-[44px] p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
          {totalAlerts > 0 && (
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white"
              aria-hidden="true"
            />
          )}
        </button>

        {isNotifOpen && (
          <div
            role="dialog"
            aria-label="Ringkasan peringatan pengawasan"
            className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-lg p-3 z-40 space-y-2"
          >
            <div className="flex items-center justify-between px-2 py-1 border-b border-slate-100">
              <span className="text-xs font-extrabold text-slate-900">Ringkasan Pengawasan</span>
              <span className="text-[11px] font-semibold text-slate-600 tabular-nums">
                {totalAlerts} item
              </span>
            </div>

            {totalAlerts === 0 ? (
              <div className="px-2 py-4 text-center space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" aria-hidden="true" />
                <p className="text-xs font-semibold text-slate-800">Semua status terpantau normal</p>
                <p className="text-[11px] text-slate-600">
                  Tidak ada antrean verifikasi baru atau temuan harga saat ini.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {pendingVerificationsCount > 0 && (
                  <Link
                    href="/admin/verifications"
                    onClick={() => setIsNotifOpen(false)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-50 border border-amber-200/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">
                        {pendingVerificationsCount} Mitra Menunggu Verifikasi
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Tinjau profil pengelola di antrean verifikasi.
                      </p>
                    </div>
                  </Link>
                )}
                {priceAlertCount > 0 && (
                  <Link
                    href="/admin/price-audit"
                    onClick={() => setIsNotifOpen(false)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-50/60 hover:bg-rose-50 border border-rose-200/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <Scale className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">
                        {priceAlertCount} Temuan Audit Harga
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Periksa deviasi harga di atas 20% atau pembaruan usang.
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
