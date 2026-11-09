'use client';

import React, { useState } from 'react';
import { LineChart, BarChart3, PieChart, TrendingUp, ArrowUpRight } from 'lucide-react';

interface MonthlyPoint {
  month: string;
  volumeTon: number;
  valueJuta: number;
  growth: string;
  x: number;
  y: number;
}

// Coordinates mapped for SVG viewBox 0 0 600 220
// Y range: 180 (0 Ton) to 30 (12 Ton) -> 150px height span
const MONTHLY_DATA: MonthlyPoint[] = [
  { month: 'Jun', volumeTon: 4.8, valueJuta: 21.6, growth: '+5.2%', x: 60, y: 120 },
  { month: 'Jul', volumeTon: 5.6, valueJuta: 25.4, growth: '+16.6%', x: 162, y: 110 },
  { month: 'Agu', volumeTon: 6.2, valueJuta: 29.1, growth: '+10.7%', x: 264, y: 102.5 },
  { month: 'Sep', volumeTon: 7.1, valueJuta: 33.8, growth: '+14.5%', x: 366, y: 91.25 },
  { month: 'Okt', volumeTon: 8.4, valueJuta: 39.2, growth: '+18.3%', x: 468, y: 75 },
  { month: 'Nov', volumeTon: 9.8, valueJuta: 46.5, growth: '+16.7%', x: 570, y: 57.5 },
];

const COMPOSITION_DATA = [
  { name: 'Botol Plastik PET', percent: 35, ton: 16.9, color: '#10b981', bg: 'bg-emerald-500' },
  { name: 'Kardus & Karton', percent: 28, ton: 13.5, color: '#f59e0b', bg: 'bg-amber-500' },
  { name: 'Minyak Jelantah', percent: 18, ton: 8.7, color: '#6366f1', bg: 'bg-indigo-500' },
  { name: 'Kaleng Aluminium', percent: 12, ton: 5.8, color: '#0ea5e9', bg: 'bg-sky-500' },
  { name: 'Logam & Besi', percent: 7, ton: 3.4, color: '#64748b', bg: 'bg-slate-500' },
];

export const AdminAnalyticsCharts: React.FC = () => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [activeMonthIdx, setActiveMonthIdx] = useState<number>(MONTHLY_DATA.length - 1);
  const activeMonth = MONTHLY_DATA[activeMonthIdx];

  // SVG Line & Area Curves
  const linePath =
    'M 60,120 C 111,120 111,110 162,110 C 213,110 213,102.5 264,102.5 C 315,102.5 315,91.25 366,91.25 C 417,91.25 417,75 468,75 C 519,75 519,57.5 570,57.5';
  const areaPath = `${linePath} L 570,180 L 60,180 Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ============================================================== */}
      {/* CHART 1: Monthly Waste Volume Chart (8 Cols)                   */}
      {/* ============================================================== */}
      <div className="lg:col-span-8 card-surface rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-4 h-4" />
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
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setChartType('line')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                  chartType === 'line'
                    ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LineChart className="w-3.5 h-3.5" />
                <span>Garis</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                  chartType === 'bar'
                    ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Batang</span>
              </button>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {activeMonth.growth} MoM
            </span>
          </div>
        </div>

        {/* Selected Month Inspector Ribbon */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Bulan Terpilih
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

        {/* ============================================================== */}
        {/* NATIVE VECTOR SVG CHART (LINE & AREA / BAR)                    */}
        {/* ============================================================== */}
        <div className="relative w-full pt-1 select-none">
          <svg
            className="w-full h-[220px] overflow-visible"
            viewBox="0 0 600 220"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Emerald Area Gradient */}
              <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>

              {/* Bar Fill Gradient */}
              <linearGradient id="chartBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              {/* Active Bar Gradient */}
              <linearGradient id="chartBarGradientActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>

            {/* Background Grid Lines & Y-Axis Labels */}
            <g className="text-slate-400 text-[10px] font-semibold">
              {/* 12 Ton */}
              <line x1="45" y1="30" x2="585" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
              <text x="35" y="34" textAnchor="end" fill="#94a3b8">12T</text>

              {/* Target Line: 10 Ton (Y = 55) */}
              <line x1="45" y1="55" x2="585" y2="55" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,5" />
              <rect x="440" y="44" width="145" height="18" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
              <text x="512" y="56" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">
                Target Kuartal (10 Ton)
              </text>

              {/* 8 Ton (Y = 80) */}
              <line x1="45" y1="80" x2="585" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
              <text x="35" y="84" textAnchor="end" fill="#94a3b8">8T</text>

              {/* 4 Ton (Y = 130) */}
              <line x1="45" y1="130" x2="585" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
              <text x="35" y="134" textAnchor="end" fill="#94a3b8">4T</text>

              {/* Baseline: 0 Ton (Y = 180) */}
              <line x1="45" y1="180" x2="585" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
              <text x="35" y="184" textAnchor="end" fill="#94a3b8">0T</text>
            </g>

            {/* CHART VIEW 1: LINE & AREA */}
            {chartType === 'line' && (
              <>
                {/* Area Fill */}
                <path d={areaPath} fill="url(#chartAreaGradient)" />

                {/* Glowing Trend Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-xs"
                />

                {/* Vertical Cursor Guidelines & Interactive Data Points */}
                {MONTHLY_DATA.map((pt, idx) => {
                  const isSelected = activeMonthIdx === idx;
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer group"
                      onClick={() => setActiveMonthIdx(idx)}
                    >
                      {/* Vertical Guideline */}
                      <line
                        x1={pt.x}
                        y1={pt.y}
                        x2={pt.x}
                        y2={180}
                        stroke={isSelected ? '#10b981' : '#e2e8f0'}
                        strokeWidth={isSelected ? 1.5 : 1}
                        strokeDasharray="3,3"
                        className="transition-colors"
                      />

                      {/* Halo Pulse for Selected Node */}
                      {isSelected && (
                        <circle cx={pt.x} cy={pt.y} r="14" fill="#10b981" opacity="0.2" className="animate-pulse" />
                      )}

                      {/* Data Point Node */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 7 : 5}
                        fill="#ffffff"
                        stroke={isSelected ? '#059669' : '#10b981'}
                        strokeWidth={isSelected ? 3.5 : 2.5}
                        className="transition-all group-hover:scale-125 origin-center"
                      />

                      {/* Value Badge Pill above Node */}
                      <g transform={`translate(${pt.x}, ${pt.y - 12})`}>
                        <rect
                          x="-22"
                          y="-16"
                          width="44"
                          height="18"
                          rx="4"
                          fill={isSelected ? '#0f172a' : '#ffffff'}
                          stroke={isSelected ? '#0f172a' : '#cbd5e1'}
                          strokeWidth="1"
                          className="drop-shadow-2xs transition-colors"
                        />
                        <text
                          x="0"
                          y="-4"
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          fill={isSelected ? '#ffffff' : '#334155'}
                        >
                          {pt.volumeTon}T
                        </text>
                      </g>
                    </g>
                  );
                })}
              </>
            )}

            {/* CHART VIEW 2: BAR CHART */}
            {chartType === 'bar' && (
              <g>
                {MONTHLY_DATA.map((pt, idx) => {
                  const isSelected = activeMonthIdx === idx;
                  const barWidth = 44;
                  const barHeight = 180 - pt.y;
                  const barX = pt.x - barWidth / 2;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer group"
                      onClick={() => setActiveMonthIdx(idx)}
                    >
                      {/* Bar Rectangle */}
                      <rect
                        x={barX}
                        y={pt.y}
                        width={barWidth}
                        height={barHeight}
                        rx="8"
                        fill={isSelected ? 'url(#chartBarGradientActive)' : 'url(#chartBarGradient)'}
                        className="transition-all duration-300 hover:opacity-90"
                      />

                      {/* Value text above Bar */}
                      <text
                        x={pt.x}
                        y={pt.y - 8}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill={isSelected ? '#059669' : '#475569'}
                      >
                        {pt.volumeTon}T
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Month Labels along X-Axis */}
            <g className="text-xs font-bold">
              {MONTHLY_DATA.map((pt, idx) => {
                const isSelected = activeMonthIdx === idx;
                return (
                  <text
                    key={idx}
                    x={pt.x}
                    y="204"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isSelected ? '800' : '600'}
                    fill={isSelected ? '#059669' : '#64748b'}
                    className="cursor-pointer transition-colors"
                    onClick={() => setActiveMonthIdx(idx)}
                  >
                    {pt.month}
                  </text>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CHART 2: Waste Composition Radial / Donut Chart (4 Cols)       */}
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
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
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
