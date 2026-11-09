'use client';

import { useState } from 'react';

export interface AdminKPIData {
  totalRecyclers: number;
  newRecyclersThisMonth: number;
  pendingVerifications: number;
  totalTransactionsVolumeKg: number;
  priceComplianceRate: number;
  anomalyReportsCount: number;
  activeWasteCategories: number;
}

export function useAdminStats() {
  const [stats] = useState<AdminKPIData>({
    totalRecyclers: 24,
    newRecyclersThisMonth: 5,
    pendingVerifications: 3,
    totalTransactionsVolumeKg: 48250,
    priceComplianceRate: 94.2,
    anomalyReportsCount: 3,
    activeWasteCategories: 6,
  });

  return {
    stats,
  };
}

