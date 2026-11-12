'use client';

import React, { useState } from 'react';
import { LineChart, BarChart3, PieChart, TrendingUp, AlertCircle } from 'lucide-react';
import type { MaterialCompositionPoint, MonthlyVolumePoint } from '@/hooks/admin/useAdminStats';

interface AdminAnalyticsChartsProps {
  monthlyTrend: MonthlyVolumePoint[];
  materialComposition: MaterialCompositionPoint[];
  compositionBasis: 'matching_items' | 'recycler_materials';
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const DONUT_RADIUS = 40;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

export const AdminAnalyticsCharts: React.FC<AdminAnalyticsChartsProps> = ({
  monthlyTrend,
  materialComposition,
  compositionBasis,
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 card-surface rounded-2xl p-6 border border-slate-200/90 h-[360px] flex items-center justify-center text-xs font-semibold text-slate-600">
          Memuat grafik tren penyerapan sampah...
        </div>
        <div className="lg:col-span-4 card-surface rounded-2xl p-6 border border-slate-200/90 h-[360px] flex items-center justify-center text-xs font-semibold text-slate-600">
          Memuat komposisi material...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="card-surface rounded-2xl p-6 border border-rose-200 bg-rose-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 text-xs text-rose-800 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" aria-hidden="true" />
          <span>{error}</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-800 text-xs font-bold hover:bg-rose-100 transition min-h-[44px]"
          >
            Muat Ulang Analitik
          </button>
        )}
      </div>
    );
  }

  const effectiveIdx =
    selectedMonthIdx !== null && selectedMonthIdx < monthlyTrend.length
      ? selectedMonthIdx
      : Math.max(0, monthlyTrend.length - 1);
  const activeMonth = monthlyTrend[effectiveIdx];

  const hasMonthlyVolume = monthlyTrend.some((m) => m.volumeKg > 0);
  const maxVolumeKg = Math.max(...monthlyTrend.map((m) => m.volumeKg), 100);
  const chartScaleMaxKg = Math.ceil((maxVolumeKg * 1.2) / 100) * 100;

  // Pemetaan koordinat SVG: X dari 60..540, Y dari 180 (0 kg) sampai 30 (puncak skala)
  const plottedPoints = monthlyTrend.map((pt, idx) => {
    const step = monthlyTrend.length > 1 ? 480 / (monthlyTrend.length - 1) : 0;
    const x = Math.round(60 + idx * step);
    const ratio = chartScaleMaxKg > 0 ? pt.volumeKg / chartScaleMaxKg : 0;
    const y = Math.round(180 - Math.min(150, ratio * 150));
    return { ...pt, x, y };
  });

  const linePath =
    plottedPoints.length > 0
      ? plottedPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`).join(' ')
      : '';
  const areaPath =
    plottedPoints.length > 0
      ? `${linePath} L ${plottedPoints[plottedPoints.length - 1].x},180 L ${plottedPoints[0].x},180 Z`
      : '';

  const totalCompValue = materialComposition.reduce((sum, item) => sum + item.value, 0);
  const donutSegments = materialComposition.reduce<
    Array<
      (typeof materialComposition)[number] & {
        dashArray: string;
        dashOffset: string;
        nextOffset: number;
      }
    >
  >((acc, item) => {
    const prevOffset = acc.length > 0 ? acc[acc.length - 1].nextOffset : 0;
    const share = totalCompValue > 0 ? item.value / totalCompValue : 0;
    const dashLength = share * DONUT_CIRCUMFERENCE;
    acc.push({
      ...item,
      dashArray: `${dashLength.toFixed(2)} ${DONUT_CIRCUMFERENCE.toFixed(2)}`,
      dashOffset: (-prevOffset).toFixed(2),
      nextOffset: prevOffset + dashLength,
    });
    return acc;
  }, []);

  const formatVolumeCompact = (kg: number) => {
    if (kg >= 1000) return `${(kg / 1000).toFixed(2)} Ton`;
    return `${kg.toLocaleString('id-ID')} kg`;
  };

  const formatRupiahCompact = (rp: number) => {
    if (rp >= 1000000) return `Rp ${(rp / 1000000).toFixed(2)} Jt`;
    return `Rp ${rp.toLocaleString('id-ID')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <div className="lg:col-span-8 card-surface rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Volume Setoran Selesai 6 Bulan Terakhir
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Akumulasi berat aktual setoran warga yang telah selesai ditimbang oleh mitra.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setChartType('line')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition min-h-[36px] ${
                  chartType === 'line'
                    ? 'bg-white text-emerald-800 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LineChart className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Garis</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition min-h-[36px] ${
                  chartType === 'bar'
                    ? 'bg-white text-emerald-800 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Batang</span>
              </button>
            </div>
          </div>
        </div>

        {activeMonth && (
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block tracking-wider">
                Bulan Terpilih
              </span>
              <span className="font-extrabold text-slate-900 text-sm">{activeMonth.label}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block tracking-wider">
                Volume Setoran
              </span>
              <span className="font-extrabold text-emerald-800 text-sm tabular-nums">
                {formatVolumeCompact(activeMonth.volumeKg)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block tracking-wider">
                Nilai Transaksi
              </span>
              <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                {formatRupiahCompact(activeMonth.valueRp)}
              </span>
            </div>
          </div>
        )}

        {!hasMonthlyVolume ? (
          <div className="flex-1 min-h-[200px] flex flex-col items-center justify-center text-center p-6 rounded-xl bg-slate-50/70 border border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-700">
              Belum ada setoran selesai tercatat dalam 6 bulan terakhir
            </p>
            <p className="text-xs text-slate-600 mt-1 max-w-md">
              Grafik tren bulanan akan terisi otomatis setelah warga menjadwalkan setoran dan mitra menyelesaikan penimbangan.
            </p>
          </div>
        ) : (
          <div className="relative w-full pt-1 select-none">
            <svg
              role="img"
              aria-label="Grafik volume setoran sampah 6 bulan terakhir"
              className="w-full h-[220px] overflow-visible"
              viewBox="0 0 600 220"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="chartBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              <g className="text-slate-500 text-[10px] font-semibold">
                <line x1="45" y1="30" x2="585" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
                <text x="38" y="34" textAnchor="end" fill="#64748b">
                  {chartScaleMaxKg >= 1000 ? `${(chartScaleMaxKg / 1000).toFixed(1)}T` : `${chartScaleMaxKg}kg`}
                </text>

                <line x1="45" y1="105" x2="585" y2="105" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
                <text x="38" y="109" textAnchor="end" fill="#64748b">
                  {chartScaleMaxKg >= 1000 ? `${(chartScaleMaxKg / 2000).toFixed(1)}T` : `${Math.round(chartScaleMaxKg / 2)}kg`}
                </text>

                <line x1="45" y1="180" x2="585" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
                <text x="38" y="184" textAnchor="end" fill="#64748b">0</text>
              </g>

              {chartType === 'line' && (
                <>
                  <path d={areaPath} fill="url(#chartAreaGradient)" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {plottedPoints.map((pt, idx) => {
                    const isSelected = effectiveIdx === idx;
                    return (
                      <g
                        key={pt.label}
                        className="cursor-pointer"
                        onClick={() => setSelectedMonthIdx(idx)}
                      >
                        <line
                          x1={pt.x}
                          y1={pt.y}
                          x2={pt.x}
                          y2={180}
                          stroke={isSelected ? '#059669' : '#e2e8f0'}
                          strokeWidth={isSelected ? 1.5 : 1}
                          strokeDasharray="3,3"
                        />
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? 7 : 5}
                          fill="#ffffff"
                          stroke={isSelected ? '#047857' : '#10b981'}
                          strokeWidth={isSelected ? 3.5 : 2.5}
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 12}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="bold"
                          fill={isSelected ? '#0f172a' : '#475569'}
                        >
                          {pt.volumeKg >= 1000 ? `${pt.volumeTon}T` : `${pt.volumeKg}kg`}
                        </text>
                      </g>
                    );
                  })}
                </>
              )}

              {chartType === 'bar' && (
                <g>
                  {plottedPoints.map((pt, idx) => {
                    const isSelected = effectiveIdx === idx;
                    const barWidth = 42;
                    const barHeight = Math.max(2, 180 - pt.y);
                    const barX = pt.x - barWidth / 2;
                    return (
                      <g
                        key={pt.label}
                        className="cursor-pointer"
                        onClick={() => setSelectedMonthIdx(idx)}
                      >
                        <rect
                          x={barX}
                          y={pt.y}
                          width={barWidth}
                          height={barHeight}
                          rx="6"
                          fill={isSelected ? '#047857' : 'url(#chartBarGradient)'}
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 8}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="bold"
                          fill={isSelected ? '#047857' : '#475569'}
                        >
                          {pt.volumeKg >= 1000 ? `${pt.volumeTon}T` : `${pt.volumeKg}kg`}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              <g className="text-xs font-bold">
                {plottedPoints.map((pt, idx) => {
                  const isSelected = effectiveIdx === idx;
                  return (
                    <text
                      key={pt.label}
                      x={pt.x}
                      y="204"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight={isSelected ? '800' : '600'}
                      fill={isSelected ? '#047857' : '#475569'}
                      className="cursor-pointer"
                      onClick={() => setSelectedMonthIdx(idx)}
                    >
                      {pt.month}
                    </text>
                  );
                })}
              </g>
            </svg>
          </div>
        )}
      </div>

      <div className="lg:col-span-4 card-surface rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
              <PieChart className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Komposisi Material Teratas
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            {compositionBasis === 'matching_items'
              ? 'Proporsi berdasarkan volume permintaan pencocokan warga.'
              : 'Proporsi berdasarkan penawaran material aktif dari mitra.'}
          </p>
        </div>

        {donutSegments.length === 0 ? (
          <div className="flex-1 min-h-[200px] my-4 flex flex-col items-center justify-center text-center p-4 rounded-xl bg-slate-50/70 border border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-700">Belum ada data komposisi material</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Data akan muncul setelah ada sesi pencocokan atau penawaran material mitra.
            </p>
          </div>
        ) : (
          <>
            <div className="py-4 flex items-center justify-center relative">
              <svg
                role="img"
                aria-label="Diagram donat komposisi kategori material"
                className="w-40 h-40 -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={DONUT_RADIUS}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="14"
                />
                {donutSegments.map((seg) => (
                  <circle
                    key={seg.name}
                    cx="50"
                    cy="50"
                    r={DONUT_RADIUS}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth="14"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                    className="transition-opacity duration-200 hover:opacity-85"
                  />
                ))}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Total
                </span>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight tabular-nums">
                  {totalCompValue.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] font-semibold text-slate-600">
                  {compositionBasis === 'matching_items' ? 'unit input' : 'penawaran'}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              {donutSegments.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <span className="text-slate-700 font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 tabular-nums shrink-0">
                    <span className="text-slate-600 text-[11px]">
                      {item.value} {item.unit}
                    </span>
                    <span className="font-bold text-slate-900">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
