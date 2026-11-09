'use client';

import React from 'react';
import { PendingVerification } from '@/hooks/admin/useAdminVerifications';
import { Building2, MapPin, Calendar, Check, X, ShieldAlert, FileText } from 'lucide-react';

interface VerificationCardProps {
  item: PendingVerification;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({
  item,
  onApprove,
  onReject,
}) => {
  const typeLabels: Record<string, { label: string; badge: string }> = {
    pabrik: { label: 'Pabrik / Manufaktur', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    bank_sampah: { label: 'Bank Sampah Induk', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pengepul: { label: 'Pengepul / Lapak Besar', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    lapak: { label: 'Lapak Tradisional', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
  };

  const badgeInfo = typeLabels[item.businessType] || {
    label: item.businessType,
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="card-surface rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${badgeInfo.badge}`}
            >
              {badgeInfo.label}
            </span>
            <span className="text-xs text-slate-400 font-mono font-medium">{item.regNumber}</span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">{item.businessName}</h3>
          <p className="text-xs text-slate-500 font-medium">Pemilik / Penanggung Jawab: {item.ownerName}</p>
        </div>

        <div>
          {item.status === 'pending' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Menunggu Review
            </span>
          )}
          {item.status === 'approved' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Terverifikasi
            </span>
          )}
          {item.status === 'rejected' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
              <X className="w-3.5 h-3.5 text-rose-600" />
              Ditolak
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            {item.address}, {item.city}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Diajukan pada: {item.submissionDate}</span>
        </div>
      </div>

      {item.status === 'pending' && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onReject(item.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Tolak Berkas</span>
          </button>
          <button
            type="button"
            onClick={() => onApprove(item.id)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Setujui Kemitraan</span>
          </button>
        </div>
      )}
    </div>
  );
};

