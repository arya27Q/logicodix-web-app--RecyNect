'use client';

import React from 'react';
import { Menu, Bell, Clock, Building2 } from 'lucide-react';

interface RecyclerHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
}

export const RecyclerHeader: React.FC<RecyclerHeaderProps> = ({
  onToggleSidebar,
  title = 'Portal Mitra Pengelola',
  subtitle = 'Kelola penerimaan sampah, harga beli, dan operasional timbangan',
}) => {
  return (
    <header className="h-16 px-4 sm:px-8 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-none">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Warehouse Operational Status */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gudang Buka (08:00 - 17:00)</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          aria-label="Lihat notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
};

