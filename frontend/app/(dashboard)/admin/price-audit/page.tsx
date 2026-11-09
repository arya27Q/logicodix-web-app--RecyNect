'use client';

import React from 'react';
import { PriceAuditTable } from '@/components/admin/PriceAuditTable';

export default function AdminPriceAuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
          Audit Kewajaran & Pembaruan Harga
        </h1>
        <p className="text-sm text-slate-500">
          Pemantauan deviasi harga material antar pengelola dan deteksi anomali harga di luar batas wajar.
        </p>
      </div>

      <PriceAuditTable />
    </div>
  );
}
