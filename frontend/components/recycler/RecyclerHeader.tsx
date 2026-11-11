'use client';

import React from 'react';
import { Menu, Bell, Clock, Building2 } from 'lucide-react';

interface RecyclerHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
  operatingHours?: string;
}

export const RecyclerHeader: React.FC<RecyclerHeaderProps> = ({
  onToggleSidebar,
  title = 'Portal Mitra Pengelola',
  subtitle = 'Kelola penerimaan sampah, harga beli, dan operasional timbangan',
  operatingHours = '08:00 - 17:00',
}) => {
  // Hitung status buka/tutup gudang secara riil berdasarkan jam saat ini
  const { isOpen, displayText } = React.useMemo(() => {
    const raw = (operatingHours || '08:00 - 17:00').trim();
    const matchTime = raw.match(/(\d{1,2})[:.](\d{2})\s*[-–]\s*(\d{1,2})[:.](\d{2})/);
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDay(); // 0 = Minggu

    const isSunday = currentDay === 0;

    if (matchTime) {
      const openH = parseInt(matchTime[1], 10);
      const openM = parseInt(matchTime[2], 10);
      const closeH = parseInt(matchTime[3], 10);
      const closeM = parseInt(matchTime[4], 10);

      const currentTotalMin = currentHour * 60 + currentMinute;
      const openTotalMin = openH * 60 + openM;
      const closeTotalMin = closeH * 60 + closeM;

      const timeString = `${matchTime[1].padStart(2, '0')}:${matchTime[2]} - ${matchTime[3].padStart(2, '0')}:${matchTime[4]}`;
      const includesSunday = raw.toLowerCase().includes('minggu') || raw.toLowerCase().includes('setiap hari');
      const isDayOpen = !isSunday || includesSunday;
      const isTimeOpen = currentTotalMin >= openTotalMin && currentTotalMin < closeTotalMin;
      const openNow = isDayOpen && isTimeOpen;

      return {
        isOpen: openNow,
        displayText: openNow
          ? `Gudang Buka (${timeString})`
          : `Gudang Tutup (${timeString})`,
      };
    }

    return {
      isOpen: true,
      displayText: `Gudang Buka (${raw})`,
    };
  }, [operatingHours]);

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
        <div
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition shadow-2xs ${
            isOpen
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
          title={operatingHours}
        >
          <Clock className={`w-3.5 h-3.5 ${isOpen ? 'text-emerald-600' : 'text-slate-500'}`} />
          <span>{displayText}</span>
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

