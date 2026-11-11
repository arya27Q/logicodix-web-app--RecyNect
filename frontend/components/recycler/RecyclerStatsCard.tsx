'use client';

import React from 'react';
import { Package, CheckCircle2, TrendingUp, Users } from 'lucide-react';

interface RecyclerStatsCardProps {
  activeMaterials: number;
  totalMaterials: number;
  completedPickups?: number;
  rating?: number;
}

export const RecyclerStatsCard: React.FC<RecyclerStatsCardProps> = ({
  activeMaterials,
  totalMaterials,
  completedPickups = 0,
  rating = 0,
}) => {
  const stats = [
    {
      label: 'Material Aktif',
      value: `${activeMaterials} / ${totalMaterials}`,
      subtext: 'Penerimaan dibuka',
      icon: <Package className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200/60',
    },
    {
      label: 'Total Setoran Selesai',
      value: `${completedPickups}`,
      subtext: completedPickups > 0 ? 'Bulan ini' : 'Belum ada setoran',
      icon: <CheckCircle2 className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50 border-sky-200/60',
    },
    {
      label: 'Rating Kepuasan',
      value: rating > 0 ? `${rating.toFixed(1)} / 5.0` : 'Baru',
      subtext: rating > 0 ? 'Berdasarkan ulasan warga' : 'Belum ada ulasan warga',
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className={`card-surface rounded-2xl p-4 border transition hover:shadow-sm ${item.bg}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {item.label}
            </span>
            <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              {item.icon}
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{item.value}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">{item.subtext}</p>
        </div>
      ))}
    </div>
  );
};

