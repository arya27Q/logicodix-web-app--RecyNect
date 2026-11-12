'use client';

import React from 'react';
import type { AdminRecyclerRecord } from '@/hooks/admin/useAdminVerifications';
import {
  MapPin,
  Calendar,
  Check,
  X,
  ShieldAlert,
  Phone,
  Clock,
  Boxes,
  Power,
  Tag,
} from 'lucide-react';

interface VerificationCardProps {
  item: AdminRecyclerRecord;
  isProcessing?: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleActive?: (id: string) => void;
  onToggleDemo?: (id: string) => void;
}

const TYPE_LABELS: Record<string, { label: string; badge: string }> = {
  bank_sampah: {
    label: 'Bank Sampah',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  pengepul: {
    label: 'Pengepul',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  tps3r: {
    label: 'TPS3R',
    badge: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  recycler_industry: {
    label: 'Industri Daur Ulang',
    badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
};

export const VerificationCard: React.FC<VerificationCardProps> = ({
  item,
  isProcessing = false,
  onApprove,
  onReject,
  onToggleActive,
  onToggleDemo,
}) => {
  const badgeInfo = TYPE_LABELS[item.managementType] || {
    label: item.managementType,
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const formattedDate = item.createdAt ? item.createdAt.split('T')[0] : '-';

  return (
    <div className="card-surface rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${badgeInfo.badge}`}
            >
              {badgeInfo.label}
            </span>
            {item.isDemo && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                DATA DEMO
              </span>
            )}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                item.isActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {item.isActive ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 mt-1.5">{item.name}</h3>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Penanggung Jawab: <span className="text-slate-800 font-semibold">{item.ownerName}</span>
            {item.ownerEmail ? ` (${item.ownerEmail})` : ''}
          </p>
        </div>

        <div className="shrink-0">
          {item.verificationStatus === 'pending' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
              Menunggu Review
            </span>
          )}
          {item.verificationStatus === 'verified' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
              Terverifikasi
            </span>
          )}
          {item.verificationStatus === 'rejected' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
              <X className="w-3.5 h-3.5 text-rose-700" aria-hidden="true" />
              Ditolak
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{item.address}</span>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          <Calendar className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
          <span>Terdaftar: {formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
          <span>Kontak: {item.contact}</span>
        </div>
        <div className="flex items-center gap-4 sm:justify-end">
          <span className="inline-flex items-center gap-1.5">
            <Boxes className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>{item.materialsCount} Material</span>
          </span>
          {item.operatingHours && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span>{item.operatingHours}</span>
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {onToggleActive && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onToggleActive(item.id)}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition disabled:opacity-50"
            >
              <Power className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{item.isActive ? 'Nonaktifkan Mitra' : 'Aktifkan Mitra'}</span>
            </button>
          )}
          {onToggleDemo && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onToggleDemo(item.id)}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition disabled:opacity-50"
            >
              <Tag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{item.isDemo ? 'Hapus Label Demo' : 'Tandai sebagai Demo'}</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {item.verificationStatus !== 'rejected' && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onReject(item.id)}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{item.verificationStatus === 'pending' ? 'Tolak Berkas' : 'Batalkan Verifikasi'}</span>
            </button>
          )}
          {item.verificationStatus !== 'verified' && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onApprove(item.id)}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs transition disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isProcessing ? 'Memproses...' : 'Setujui Kemitraan'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
