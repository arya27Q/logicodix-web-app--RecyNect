'use client';

import React, { useState } from 'react';
import { TrendingUp, PieChart, Sparkles, ArrowUpRight, Scale, Leaf } from 'lucide-react';

interface UserMonthlyPoint {
  month: string;
  weightKg: number;
  earnedRp: number;
  x: number;
  y: number;
}

// SVG viewBox 0 0 540 200
// Y scale: 160 (0 kg) to 30 (50 kg max scale)
const USER_MONTHLY_DATA: UserMonthlyPoint[] = [
  { month: 'Jun', weightKg: 12.0, earnedRp: 46000, x: 50, y: 129 },
  { month: 'Jul', weightKg: 18.5, earnedRp: 72000, x: 142, y: 112 },
  { month: 'Agu', weightKg: 24.0, earnedRp: 95000, x: 234, y: 98 },
  { month: 'Sep', weightKg: 22.0, earnedRp: 84000, x: 326, y: 103 },
  { month: 'Okt', weightKg: 32.5, earnedRp: 126000, x: 418, y: 76 },
  { month: 'Nov', weightKg: 40.0, earnedRp: 154000, x: 510, y: 56 },
];

const USER_COMPOSITION = [
  { name: 'Kardus & Karton', percent: 48, weight: '59.8 kg', color: '#f59e0b', strokeOffset: '0', strokeDash: '120.63 251.32' },
  { name: 'Botol Plastik PET', percent: 28, weight: '34.8 kg', color: '#10b981', strokeOffset: '-120.63', strokeDash: '70.37 251.32' },
  { name: 'Minyak Jelantah', percent: 14, weight: '17.4 L', color: '#6366f1', strokeOffset: '-191.00', strokeDash: '35.18 251.32' },
  { name: 'Kaleng Logam', percent: 10, weight: '12.5 kg', color: '#0ea5e9', strokeOffset: '-226.18', strokeDash: '25.13 251.32' },
];

export const UserImpactCharts: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(USER_MONTHLY_DATA.length - 1);
  const activeMonth = USER_MONTHLY_DATA[selectedIdx];

  const linePath =
    'M 50,129 C 96,129 96,112 142,112 C 188,112 188,98 234,98 C 280,98 280,103 326,103 C 372,103 372,76 418,76 C 464,76 464,56 510,56';
  const areaPath = `${linePath} L 510,160 L 50,160 Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ============================================================== */}
      {/* CHART 1: Monthly Waste Contribution Line Chart (8 Cols)        */}
      {/* ============================================================== */}
      <div className="lg:col-span-8 card-surface rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Tren Penyetoran Sampah Pribadi
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Akumulasi bobot sampah yang berhasil Anda alihkan dari TPA selama 6 bulan terakhir.
            </p>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full w-fit">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>+23.1% Bulan Ini</span>
          </span>
        </div>

        {/* Selected Month Ribbon */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-3 text-xs">
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
              Bobot Setoran
            </span>
            <span className="font-extrabold text-emerald-700 text-sm tabular-nums">
              {activeMonth.weightKg} kg
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Rupiah Diperoleh
            </span>
            <span className="font-extrabold text-slate-900 text-sm tabular-nums">
              Rp {activeMonth.earnedRp.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative w-full pt-1 select-none">
          <svg className="w-full h-[180px] overflow-visible" viewBox="0 0 540 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="userAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="75%" stopColor="#10b981" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid & Axis */}
            <g stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3">
              <line x1="40" y1="30" x2="520" y2="30" />
              <line x1="40" y1="73" x2="520" y2="73" />
              <line x1="40" y1="116" x2="520" y2="116" />
              <line x1="40" y1="160" x2="520" y2="160" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="none" />
            </g>

            {/* Y Labels */}
            <g fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">
              <text x="34" y="34">50kg</text>
              <text x="34" y="77">33kg</text>
              <text x="34" y="120">16kg</text>
              <text x="34" y="163">0kg</text>
            </g>

            {/* Area & Smooth Line */}
            <path d={areaPath} fill="url(#userAreaGrad)" />
            <path
              d={linePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Points */}
            {USER_MONTHLY_DATA.map((pt, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <g
                  key={idx}
                  className="cursor-pointer group"
                  onClick={() => setSelectedIdx(idx)}
                >
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x}
                    y2={160}
                    stroke={isSelected ? '#10b981' : '#e2e8f0'}
                    strokeWidth={isSelected ? 1.5 : 1}
                    strokeDasharray="3,3"
                  />

                  {isSelected && (
                    <circle cx={pt.x} cy={pt.y} r="12" fill="#10b981" opacity="0.2" className="animate-pulse" />
                  )}

                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6.5 : 4.5}
                    fill="#ffffff"
                    stroke={isSelected ? '#059669' : '#10b981'}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all group-hover:scale-125"
                  />

                  {/* Value Pill */}
                  <g transform={`translate(${pt.x}, ${pt.y - 10})`}>
                    <rect
                      x="-18"
                      y="-14"
                      width="36"
                      height="16"
                      rx="4"
                      fill={isSelected ? '#0f172a' : '#ffffff'}
                      stroke={isSelected ? '#0f172a' : '#cbd5e1'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-3"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill={isSelected ? '#ffffff' : '#334155'}
                    >
                      {pt.weightKg}k
                    </text>
                  </g>

                  {/* X-Label */}
                  <text
                    x={pt.x}
                    y="176"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fill={isSelected ? '#059669' : '#64748b'}
                  >
                    {pt.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CHART 2: Waste Category Contribution Donut (4 Cols)            */}
      {/* ============================================================== */}
      <div className="lg:col-span-4 card-surface rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <PieChart className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Komposisi Sampah Disetor
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Proporsi kategori material yang Anda setorkan ke mitra pengelola.
          </p>
        </div>

        {/* SVG Donut */}
        <div className="py-3 flex items-center justify-center relative">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
            {USER_COMPOSITION.map((item, idx) => (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={item.color}
                strokeWidth="12"
                strokeDasharray={item.strokeDash}
                strokeDashoffset={item.strokeOffset}
                className="transition-all duration-500 hover:opacity-85"
              />
            ))}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Setoran
            </span>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              124.5 kg
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
          {USER_COMPOSITION.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 font-medium truncate max-w-[130px]">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 tabular-nums">
                <span className="text-slate-400 text-[11px]">{item.weight}</span>
                <span className="font-bold text-slate-900">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
