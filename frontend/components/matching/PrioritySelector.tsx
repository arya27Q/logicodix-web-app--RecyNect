'use client';

import React from 'react';
import { MatchingPriority } from '@/types';
import { Scale, TrendingUp, MapPin, Milestone, Check } from 'lucide-react';

interface PrioritySelectorProps {
  value: MatchingPriority;
  onChange: (priority: MatchingPriority) => void;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({ value, onChange }) => {
  const options: {
    id: MatchingPriority;
    label: string;
    sublabel: string;
    description: string;
    weights: { label: string; value: string }[];
    icon: React.ReactNode;
  }[] = [
    {
      id: 'balanced',
      label: 'Seimbang (Balanced)',
      sublabel: 'Rekomendasi Utama',
      description: 'Menyeimbangkan antara nilai rupiah yang didapat, jarak rute, dan jumlah titik singgah.',
      weights: [
        { label: 'Nilai', value: '50%' },
        { label: 'Jarak', value: '30%' },
        { label: 'Lokasi', value: '20%' },
      ],
      icon: <Scale className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'highest_value',
      label: 'Nilai Tertinggi (Highest Value)',
      sublabel: 'Cuan Maksimal',
      description: 'Prioritaskan total pendapatan rupiah terbesar, meskipun harus singgah di 2 lokasi berbeda.',
      weights: [
        { label: 'Nilai', value: '70%' },
        { label: 'Jarak', value: '20%' },
        { label: 'Lokasi', value: '10%' },
      ],
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'nearest',
      label: 'Jarak Terdekat (Nearest)',
      sublabel: 'Hemat Waktu & Bensin',
      description: 'Prioritaskan pengelola dengan radius jarak paling dekat dari titik lokasi Anda saat ini.',
      weights: [
        { label: 'Nilai', value: '20%' },
        { label: 'Jarak', value: '60%' },
        { label: 'Lokasi', value: '20%' },
      ],
      icon: <MapPin className="w-5 h-5 text-sky-600" />,
    },
    {
      id: 'fewest_stops',
      label: 'Titik Singgah Sedikit (Fewest Stops)',
      sublabel: 'Paling Praktis',
      description: 'Prioritaskan kepraktisan dengan menyetorkan semua sampah hanya ke 1 tempat singgah.',
      weights: [
        { label: 'Nilai', value: '20%' },
        { label: 'Jarak', value: '20%' },
        { label: 'Lokasi', value: '60%' },
      ],
      icon: <Milestone className="w-5 h-5 text-purple-600" />,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
          Pilih Prioritas Rekomendasi
        </label>
        <span className="text-[11px] text-slate-500">Mempengaruhi pembobotan ranking algoritma</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`cursor-pointer rounded-xl border p-4 transition-all relative ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-500/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    {opt.icon}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                      {opt.label}
                    </p>
                    <span className="text-[11px] font-semibold text-slate-500">{opt.sublabel}</span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">{opt.description}</p>

              <div className="pt-2.5 mt-auto border-t border-slate-200/60 flex items-center justify-between gap-1 text-[11px]">
                <span className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider shrink-0">
                  Bobot:
                </span>
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  {opt.weights.map((w, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200/80"
                    >
                      {w.value} {w.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
