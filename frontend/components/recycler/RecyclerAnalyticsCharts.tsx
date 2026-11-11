'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, BarChart3, TrendingUp, ArrowUpRight, Warehouse } from 'lucide-react';

export interface DailyPoint {
  day: string;
  volumeTon: number;
  payoutJuta: number;
  x: number;
  y: number;
}

export interface StorageCategory {
  name: string;
  ton: number;
  capacityTon: number;
  percent: number;
  color: string;
}

interface RecyclerAnalyticsChartsProps {
  dailyData?: DailyPoint[];
  storageBreakdown?: StorageCategory[];
  totalStorageTon?: number;
  maxCapacityTon?: number;
  warehouseCapacityPercent?: number;
}

// Fallback jika belum selesai fetch dari database
const DEFAULT_DAILY_DATA: DailyPoint[] = [
  { day: 'Sen', volumeTon: 2.1, payoutJuta: 7.2, x: 50, y: 117 },
  { day: 'Sel', volumeTon: 2.8, payoutJuta: 9.6, x: 133, y: 96 },
  { day: 'Rab', volumeTon: 3.4, payoutJuta: 11.8, x: 216, y: 78 },
  { day: 'Kam', volumeTon: 3.1, payoutJuta: 10.5, x: 300, y: 87 },
  { day: 'Jum', volumeTon: 4.2, payoutJuta: 14.7, x: 383, y: 54 },
  { day: 'Sab', volumeTon: 4.8, payoutJuta: 16.9, x: 466, y: 36 },
  { day: 'Min', volumeTon: 1.5, payoutJuta: 5.2, x: 550, y: 135 },
];

const DEFAULT_STORAGE_BREAKDOWN: StorageCategory[] = [
  { name: 'Kardus & Karton', ton: 8.2, capacityTon: 10.0, percent: 82, color: '#f59e0b' },
  { name: 'Botol Plastik PET', ton: 6.1, capacityTon: 8.0, percent: 76, color: '#10b981' },
  { name: 'Logam & Besi', ton: 2.8, capacityTon: 4.0, percent: 70, color: '#64748b' },
  { name: 'Minyak Jelantah', ton: 1.4, capacityTon: 3.0, percent: 46, color: '#6366f1' },
];

export const RecyclerAnalyticsCharts: React.FC<RecyclerAnalyticsChartsProps> = ({
  dailyData = DEFAULT_DAILY_DATA,
  storageBreakdown = DEFAULT_STORAGE_BREAKDOWN,
  totalStorageTon = 18.5,
  maxCapacityTon = 25.0,
  warehouseCapacityPercent = 74,
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  const points = dailyData && dailyData.length > 0 ? dailyData : DEFAULT_DAILY_DATA;
  const breakdown = storageBreakdown && storageBreakdown.length > 0 ? storageBreakdown : DEFAULT_STORAGE_BREAKDOWN;

  const [activeIdx, setActiveIdx] = useState<number>(() => Math.max(0, points.length - 2));
  const safeIdx = Math.min(activeIdx, points.length - 1);
  const activeDay = points[safeIdx] || points[0];

  // Hitung kurva spline mulus dinamis berdasarkan koordinat points
  const { linePath, areaPath } = useMemo(() => {
    if (!points || points.length === 0) {
      return { linePath: '', areaPath: '' };
    }
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const midX = (p0.x + p1.x) / 2;
      d += ` C ${midX},${p0.y} ${midX},${p1.y} ${p1.x},${p1.y}`;
    }
    const last = points[points.length - 1];
    const first = points[0];
    const area = `${d} L ${last.x},180 L ${first.x},180 Z`;
    return { linePath: d, areaPath: area };
  }, [points]);

  // Hitung circumference lingkar keterisian gudang (r = 40)
  const circumference = 251.32;
  const strokeOffset = ((warehouseCapacityPercent / 100) * circumference).toFixed(2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ============================================================== */}
      {/* CHART 1: Daily Waste Intake Curve (8 Cols)                     */}
      {/* ============================================================== */}
      <div className="lg:col-span-8 card-surface rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Tren Penerimaan Sampah Harian
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Volume material masuk hasil setoran warga dan bank sampah binaan.
            </p>
          </div>

          <div className="flex items-center gap-2">
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
              +14.2% Minggu Ini
            </span>
          </div>
        </div>

        {/* Selected Day Inspector Ribbon */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Hari Terpilih
            </span>
            <span className="font-extrabold text-slate-900 text-sm">
              {activeDay.day} (Minggu Ini)
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Volume Masuk
            </span>
            <span className="font-extrabold text-emerald-700 text-sm tabular-nums">
              {activeDay.volumeTon} Ton
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Pembayaran
            </span>
            <span className="font-extrabold text-slate-900 text-sm tabular-nums">
              Rp {activeDay.payoutJuta} Jt
            </span>
          </div>
        </div>

        {/* Vector SVG Chart */}
        <div className="relative w-full pt-1 select-none">
          <svg className="w-full h-[220px] overflow-visible" viewBox="0 0 600 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="recAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="recBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <linearGradient id="recBarGradActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>

            {/* Grid & Y Labels */}
            <g className="text-slate-400 text-[10px] font-semibold">
              {/* 5.0 Ton */}
              <line x1="40" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
              <text x="30" y="34" textAnchor="end" fill="#94a3b8">5.0T</text>

              {/* Target Harian (3.5 Ton) Y = 75 */}
              <line x1="40" y1="75" x2="570" y2="75" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,5" />
              <rect x="440" y="64" width="130" height="18" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
              <text x="505" y="76" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">
                Target Harian (3.5T)
              </text>

              {/* 2.5 Ton (Y = 105) */}
              <line x1="40" y1="105" x2="570" y2="105" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
              <text x="30" y="109" textAnchor="end" fill="#94a3b8">2.5T</text>

              {/* 0 Ton (Y = 180) */}
              <line x1="40" y1="180" x2="570" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
              <text x="30" y="184" textAnchor="end" fill="#94a3b8">0T</text>
            </g>

            {/* Line View */}
            {chartType === 'line' && (
              <>
                <path d={areaPath} fill="url(#recAreaGrad)" />
                <path
                  d={linePath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {points.map((pt, idx) => {
                  const isSelected = safeIdx === idx;
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer group"
                      onClick={() => setActiveIdx(idx)}
                    >
                      <line
                        x1={pt.x}
                        y1={pt.y}
                        x2={pt.x}
                        y2={180}
                        stroke={isSelected ? '#10b981' : '#e2e8f0'}
                        strokeWidth={isSelected ? 1.5 : 1}
                        strokeDasharray="3,3"
                      />

                      {isSelected && (
                        <circle cx={pt.x} cy={pt.y} r="14" fill="#10b981" opacity="0.2" className="animate-pulse" />
                      )}

                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 7 : 5}
                        fill="#ffffff"
                        stroke={isSelected ? '#059669' : '#10b981'}
                        strokeWidth={isSelected ? 3.5 : 2.5}
                        className="transition-all group-hover:scale-125"
                      />

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

            {/* Bar View */}
            {chartType === 'bar' && (
              <g>
                {points.map((pt, idx) => {
                  const isSelected = safeIdx === idx;
                  const barWidth = 38;
                  const barHeight = Math.max(8, 180 - pt.y);
                  const barX = pt.x - barWidth / 2;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer group"
                      onClick={() => setActiveIdx(idx)}
                    >
                      <rect
                        x={barX}
                        y={pt.y}
                        width={barWidth}
                        height={barHeight}
                        rx="8"
                        fill={isSelected ? 'url(#recBarGradActive)' : 'url(#recBarGrad)'}
                        className="transition-all duration-300 hover:opacity-90"
                      />
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

            {/* X Labels */}
            <g className="text-xs font-bold">
              {points.map((pt, idx) => {
                const isSelected = safeIdx === idx;
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
                    onClick={() => setActiveIdx(idx)}
                  >
                    {pt.day}
                  </text>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CHART 2: Warehouse Storage Capacity Breakdown (4 Cols)         */}
      {/* ============================================================== */}
      <div className="lg:col-span-4 card-surface rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Warehouse className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Kapasitas Gudang Aktif
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Tingkat keterisian ruang penyimpanan material penampungan.
          </p>
        </div>

        {/* Circular Gauge */}
        <div className="py-4 flex items-center justify-center relative">
          <svg className="w-38 h-38 -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
            {/* Filled Progress */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="12"
              strokeDasharray={`${strokeOffset} ${circumference}`}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Keterisian
            </span>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {warehouseCapacityPercent}%
            </span>
            <span className="text-[10px] font-semibold text-slate-500">{totalStorageTon} / {maxCapacityTon} Ton</span>
          </div>
        </div>

        {/* Progress Bars per Material */}
        <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
          {breakdown.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">{item.name}</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {item.ton} / {item.capacityTon}T ({item.percent}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

