'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  Truck,
  Scale,
  FileCheck2,
  Banknote,
  ArrowRight,
  TrendingUp,
  User,
} from 'lucide-react';
import { IncomingDelivery } from '@/hooks/recycler/useRecyclerIncoming';

interface HourlyQueueSlot {
  timeRange: string;
  startHour: number;
  endHour: number;
  count: number;
  capacity: number;
  density: 'rendah' | 'sedang' | 'tinggi';
  totalKg: number;
  citizens: string[];
}

interface IncomingQueueDiagramsProps {
  deliveries?: IncomingDelivery[];
}

const TIME_SLOT_DEFS = [
  { timeRange: '08:00 - 10:00', startHour: 8, endHour: 10, capacity: 6 },
  { timeRange: '10:00 - 12:00', startHour: 10, endHour: 12, capacity: 6 },
  { timeRange: '12:00 - 13:00', startHour: 12, endHour: 13, capacity: 4 },
  { timeRange: '13:00 - 15:00', startHour: 13, endHour: 15, capacity: 6 },
  { timeRange: '15:00 - 17:00', startHour: 15, endHour: 17, capacity: 5 },
];

function extractHourFromArrivalTime(timeStr?: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2})[:.](\d{2})/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

function extractWeight(delivery: IncomingDelivery): number {
  if (delivery.actualWeight && delivery.actualWeight > 0) {
    return delivery.actualWeight;
  }
  const weightStr = delivery.totalEstimatedWeight || '';
  const match = weightStr.match(/([\d.]+)/);
  if (match) {
    return parseFloat(match[1]) || 0;
  }
  return 0;
}

export const IncomingQueueDiagrams: React.FC<IncomingQueueDiagramsProps> = ({ deliveries }) => {
  // Hitung distribusi antrean riil dari daftar deliveries aktif/masuk
  const hourlyData = useMemo<HourlyQueueSlot[]>(() => {
    if (!deliveries) {
      return [
        { timeRange: '08:00 - 10:00', startHour: 8, endHour: 10, count: 3, capacity: 6, density: 'sedang', totalKg: 120, citizens: ['Warga RT 01', 'Budi Santoso'] },
        { timeRange: '10:00 - 12:00', startHour: 10, endHour: 12, count: 6, capacity: 6, density: 'tinggi', totalKg: 280, citizens: ['Santi Damayanti', 'Rian Hidayat'] },
        { timeRange: '12:00 - 13:00', startHour: 12, endHour: 13, count: 1, capacity: 4, density: 'rendah', totalKg: 45, citizens: ['Joko Susilo'] },
        { timeRange: '13:00 - 15:00', startHour: 13, endHour: 15, count: 5, capacity: 6, density: 'tinggi', totalKg: 210, citizens: ['Bank Sampah Dago'] },
        { timeRange: '15:00 - 17:00', startHour: 15, endHour: 17, count: 2, capacity: 5, density: 'rendah', totalKg: 85, citizens: ['Armada RW 07'] },
      ];
    }

    return TIME_SLOT_DEFS.map((slot) => {
      const slotDeliveries = deliveries.filter((d) => {
        // Abaikan transaksi yang berstatus dibatalkan
        if (d.status === 'batal') return false;
        const h = extractHourFromArrivalTime(d.arrivalTime);
        if (h === null) return false;
        return h >= slot.startHour && h < slot.endHour;
      });

      const count = slotDeliveries.length;
      const totalKg = Math.round(slotDeliveries.reduce((sum, d) => sum + extractWeight(d), 0) * 10) / 10;
      const citizens = slotDeliveries.map((d) => d.citizenName);

      const ratio = count / slot.capacity;
      const density: 'rendah' | 'sedang' | 'tinggi' =
        count === 0 ? 'rendah' : ratio >= 0.7 ? 'tinggi' : ratio >= 0.3 ? 'sedang' : 'rendah';

      return {
        ...slot,
        count,
        totalKg,
        density,
        citizens,
      };
    });
  }, [deliveries]);

  // Pilih slot aktif: prioritaskan slot dengan antrean terbanyak atau default slot ke-1
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number>(() => {
    return 1;
  });

  const activeSlot = hourlyData[selectedSlotIdx] || hourlyData[0];

  const workflowSteps = [
    {
      step: '01',
      title: 'Warga Tiba di Gerbang',
      desc: 'Pengecekan ID antrean atau nomor WhatsApp warga.',
      icon: <Truck className="w-4 h-4 text-amber-600" />,
      tag: 'Verifikasi Awal',
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
    },
    {
      step: '02',
      title: 'Uji Mutu & Pilah Fisik',
      desc: 'Inspeksi tingkat kontaminasi, kadar air, dan kebersihan.',
      icon: <CheckCircle2 className="w-4 h-4 text-sky-600" />,
      tag: 'Standar Mutu',
      bg: 'bg-sky-50 border-sky-200 text-sky-800',
    },
    {
      step: '03',
      title: 'Penimbangan Digital',
      desc: 'Bobot tercatat riil melalui jembatan timbang terkalibrasi.',
      icon: <Scale className="w-4 h-4 text-indigo-600" />,
      tag: 'Tera Metrologi',
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    },
    {
      step: '04',
      title: 'Cetak Nota & Payout',
      desc: 'Kalkulasi otomatis harga per kg dan pencairan ke warga.',
      icon: <Banknote className="w-4 h-4 text-emerald-600" />,
      tag: 'Pencairan Instan',
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* DIAGRAM 1: Alur Standar Operasional Timbangan (Workflow)       */}
      {/* ============================================================== */}
      <div className="card-surface rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              <span>Diagram Alur Penerimaan & Pembayaran Timbangan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Standar Operasional Prosedur (SOP) verifikasi fisik sampah dari warga hingga nota tercetak resmi.
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full w-fit">
            4 Tahapan Verifikasi
          </span>
        </div>

        {/* Responsive Connected Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs flex flex-col justify-between space-y-3 group hover:border-amber-400 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-slate-400 group-hover:text-amber-600 transition">
                    TAHAP {step.step}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${step.bg}`}>
                    {step.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 shrink-0">
                    {step.icon}
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
                    {step.title}
                  </h4>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              {/* Connecting Arrow for desktop (between items) */}
              {idx < workflowSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-slate-100 border border-slate-300 text-slate-400">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* DIAGRAM 2: Grafik Distribusi Jam Kedatangan Timbangan Hari Ini */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 card-surface rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Kepadatan Jam Kedatangan Warga Hari Ini
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Prakiraan beban kerja timbangan per interval waktu operasional.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Antrean Masuk</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                <span>Kapasitas Timbang</span>
              </span>
            </div>
          </div>

          {/* SVG Hourly Distribution Chart */}
          <div className="relative w-full pt-1 select-none">
            <svg className="w-full h-[180px] overflow-visible" viewBox="0 0 550 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="hourlyActiveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="hourlyNormalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <g stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3">
                <line x1="30" y1="20" x2="520" y2="20" />
                <line x1="30" y1="65" x2="520" y2="65" />
                <line x1="30" y1="110" x2="520" y2="110" />
                <line x1="30" y1="145" x2="520" y2="145" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="none" />
              </g>

              {/* Y Labels */}
              <g fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">
                <text x="24" y="24">6 Slot</text>
                <text x="24" y="69">4 Slot</text>
                <text x="24" y="114">2 Slot</text>
                <text x="24" y="148">0</text>
              </g>

              {/* Bars per Slot */}
              {hourlyData.map((slot, idx) => {
                const isSelected = selectedSlotIdx === idx;
                const slotWidth = 72;
                const slotX = 50 + idx * 98;
                // Height calculation: 145 is Y0, 20 is Y6 (span 125px -> 20.8px per unit)
                const barHeight = Math.min(125, slot.count * 20.8);
                const capHeight = slot.capacity * 20.8;
                const barY = 145 - barHeight;
                const capY = 145 - capHeight;

                return (
                  <g
                    key={idx}
                    className="cursor-pointer group"
                    onClick={() => setSelectedSlotIdx(idx)}
                  >
                    {/* Capacity Background Bar */}
                    <rect
                      x={slotX}
                      y={capY}
                      width={slotWidth}
                      height={capHeight}
                      rx="8"
                      fill="#f8fafc"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />

                    {/* Actual Arrival Load Bar */}
                    <rect
                      x={slotX + 4}
                      y={barY}
                      width={slotWidth - 8}
                      height={barHeight}
                      rx="6"
                      fill={isSelected ? 'url(#hourlyActiveGrad)' : 'url(#hourlyNormalGrad)'}
                      className="transition-all duration-300"
                    />

                    {/* Count Text */}
                    <text
                      x={slotX + slotWidth / 2}
                      y={slot.count > 0 ? barY - 6 : 138}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill={isSelected ? '#b45309' : slot.count > 0 ? '#475569' : '#cbd5e1'}
                    >
                      {slot.count} Warga
                    </text>

                    {/* X-Axis Label */}
                    <text
                      x={slotX + slotWidth / 2}
                      y="166"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fill={isSelected ? '#0f172a' : '#64748b'}
                    >
                      {slot.timeRange}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Slot Inspector (4 Cols) */}
        <div className="lg:col-span-4 card-surface rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Detail Waktu Kedatangan
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  activeSlot.density === 'tinggi'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : activeSlot.density === 'sedang'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                Kepadatan {activeSlot.density}
              </span>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              Pukul {activeSlot.timeRange}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeSlot.count === 0
                ? 'Belum ada jadwal armada atau warga terdaftar pada interval ini.'
                : activeSlot.density === 'tinggi'
                ? 'Interval waktu puncak kedatangan armada dan warga.'
                : 'Arus timbangan berjalan normal tanpa potensi antrean.'}
            </p>

            <div className="space-y-2 mt-4 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Estimasi Setoran Masuk:</span>
                <span className="font-bold text-slate-900">{activeSlot.count} Transaksi</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Total Muatan Masuk:</span>
                <span className="font-bold text-amber-700">{activeSlot.totalKg} kg</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Utilisasi Timbangan:</span>
                <span className="font-bold text-slate-900">
                  {Math.min(100, Math.round((activeSlot.count / activeSlot.capacity) * 100))}%
                </span>
              </div>

              {activeSlot.citizens && activeSlot.citizens.length > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <User className="w-3.5 h-3.5 text-amber-700" />
                    <span>Warga / Armada Terdaftar:</span>
                  </div>
                  <p className="line-clamp-2 text-slate-700 font-medium">
                    {activeSlot.citizens.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Klik kolom pada grafik untuk melihat rincian jam operasional lainnya.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

