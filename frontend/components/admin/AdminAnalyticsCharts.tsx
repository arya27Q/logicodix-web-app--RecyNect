'use client';

import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';

interface MonthlyPoint {
  month: string;
  volumeTon: number;
  valueJuta: number;
  growth: string;
}

const MONTHLY_DATA: MonthlyPoint[] = [
  { month: 'Jun', volumeTon: 4.8, valueJuta: 21.6, growth: '+5.2%' },
  { month: 'Jul', volumeTon: 5.6, valueJuta: 25.4, growth: '+16.6%' },
  { month: 'Agu', volumeTon: 6.2, valueJuta: 29.1, growth: '+10.7%' },
  { month: 'Sep', volumeTon: 7.1, valueJuta: 33.8, growth: '+14.5%' },
  { month: 'Okt', volumeTon: 8.4, valueJuta: 39.2, growth: '+18.3%' },
  { month: 'Nov', volumeTon: 9.8, valueJuta: 46.5, growth: '+16.7%' },
];

const COMPOSITION_DATA = [
  { name: 'Botol Plastik PET', percent: 35, ton: 16.9, color: '#10b981', bg: 'bg-emerald-500' },
  { name: 'Kardus & Karton', percent: 28, ton: 13.5, color: '#f59e0b', bg: 'bg-amber-500' },
  { name: 'Minyak Jelantah', percent: 18, ton: 8.7, color: '#6366f1', bg: 'bg-indigo-500' },
  { name: 'Kaleng Aluminium', percent: 12, ton: 5.8, color: '#0ea5e9', bg: 'bg-sky-500' },
  { name: 'Logam & Besi', percent: 7, ton: 3.4, color: '#64748b', bg: 'bg-slate-500' },
];

export const AdminAnalyticsCharts: React.FC = () => {
  const [activeMonthIdx, setActiveMonthIdx] = useState<number>(MONTHLY_DATA.length - 1);
  const activeMonth = MONTHLY_DATA[activeMonthIdx];

  // SVG Chart Dimensions
  const maxVolume = 12; // Scale max for 12 Ton
  const chartHeight = 160;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ============================================================== */}
      {/* CHART 1: Monthly Waste Volume Bar Chart (8 Cols)               */}
      {/* ============================================================== */}
      <div className="lg:col-span-8 card-surface rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Tren Penyerapan Sampah & Transaksi Bulanan
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Data akumulasi volume sampah daur ulang yang berhasil tersalurkan ke mitra pengelola.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {activeMonth.growth} MoM
            </span>
            <span className="text-xs font-semibold text-slate-500">6 Bulan Terakhir</span>
          </div>
        </div>

        {/* Selected Month Inspector Ribbon */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Bulan Dipilih
            </span>
            <span className="font-extrabold text-slate-900 text-sm">
              {activeMonth.month} 2026
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Volume Sampah
            </span>
            <span className="font-extrabold text-emerald-700 text-sm tabular-nums">
              {activeMonth.volumeTon} Ton
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Nilai Rupiah
            </span>
            <span className="font-extrabold text-slate-900 text-sm tabular-nums">
              Rp {activeMonth.valueJuta} Jt
            </span>
          </div>
        </div>

        {/* Native Vector SVG Bar Chart */}
        <div className="relative pt-2">
          {/* Reference Grid lines */}
          <div className="absolute inset-x-0 top-0 flex flex-col justify-between h-[160px] pointer-events-none text-[10px] text-slate-400">
            <div className="border-b border-dashed border-slate-200 flex justify-between">
              <span>12 Ton</span>
              <span className="text-slate-400">Target Kuartal (10 Ton)</span>
            </div>
            <div className="border-b border-dashed border-slate-200 flex justify-between">
              <span>8 Ton</span>
            </div>
            <div className="border-b border-dashed border-slate-200 flex justify-between">
              <span>4 Ton</span>
            </div>
            <div className="border-b border-slate-200 flex justify-between">
              <span>0 Ton</span>
            </div>
          </div>

          {/* Bars Container */}
          <div className="flex items-end justify-between gap-2 sm:gap-4 h-[160px] px-8 sm:px-12 relative z-10">
            {MONTHLY_DATA.map((item, idx) => {
              const heightPercent = (item.volumeTon / maxVolume) * 100;
              const isSelected = activeMonthIdx === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveMonthIdx(idx)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition mb-1 tabular-nums ${
                      isSelected
                        ? 'bg-slate-900 text-white opacity-100 shadow-sm'
                        : 'opacity-0 group-hover:opacity-100 bg-slate-800 text-slate-200'
                    }`}
                  >
                    {item.volumeTon}T
                  </div>

                  {/* Bar Body */}
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden relative transition-all duration-300 group-hover:scale-y-105 origin-bottom">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-xl transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md ring-2 ring-emerald-500/40'
                          : 'bg-gradient-to-t from-slate-400 to-slate-300 group-hover:from-emerald-500 group-hover:to-emerald-300'
                      }`}
                    />
                  </div>

                  {/* Label Month */}
                  <span
                    className={`text-xs mt-2.5 font-bold transition ${
                      isSelected ? 'text-emerald-700 font-extrabold' : 'text-slate-500 group-hover:text-slate-800'
                    }`}
                  >
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CHART 2: Waste Composition Radial / Segment Breakdown (4 Cols) */}
      {/* ============================================================== */}
      <div className="lg:col-span-4 card-surface rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <PieChart className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Komposisi Material
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Proporsi kategori material yang masuk ke fasilitas daur ulang.
          </p>
        </div>

        {/* SVG Donut Chart */}
        <div className="py-4 flex items-center justify-center relative">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="14"
            />
            {/* Segment 1: Botol PET (35%) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="14"
              strokeDasharray="87.96 251.32"
              strokeDashoffset="0"
              className="transition-all duration-500 hover:opacity-80"
            />
            {/* Segment 2: Kardus (28%) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="14"
              strokeDasharray="70.37 251.32"
              strokeDashoffset="-87.96"
              className="transition-all duration-500 hover:opacity-80"
            />
            {/* Segment 3: Minyak Jelantah (18%) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#6366f1"
              strokeWidth="14"
              strokeDasharray="45.24 251.32"
              strokeDashoffset="-158.33"
              className="transition-all duration-500 hover:opacity-80"
            />
            {/* Segment 4: Kaleng Aluminium (12%) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#0ea5e9"
              strokeWidth="14"
              strokeDasharray="30.16 251.32"
              strokeDashoffset="-203.57"
              className="transition-all duration-500 hover:opacity-80"
            />
            {/* Segment 5: Logam (7%) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#64748b"
              strokeWidth="14"
              strokeDasharray="17.59 251.32"
              strokeDashoffset="-233.73"
              className="transition-all duration-500 hover:opacity-80"
            />
          </svg>

          {/* Center Donut Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Ton
            </span>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              48.3 T
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
          {COMPOSITION_DATA.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 font-medium truncate max-w-[120px]">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 tabular-nums">
                <span className="text-slate-400 text-[11px]">{item.ton}T</span>
                <span className="font-bold text-slate-900">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
