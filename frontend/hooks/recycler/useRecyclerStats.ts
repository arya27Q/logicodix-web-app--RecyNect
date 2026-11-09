'use client';

import { useState } from 'react';

export interface RecyclerKPIs {
  intakeThisMonthKg: number;
  totalPayoutRp: number;
  warehouseCapacityPercent: number;
  activeCitizensServed: number;
  pendingDeliveriesCount: number;
  satisfactionRating: number;
}

export function useRecyclerStats() {
  const [stats] = useState<RecyclerKPIs>({
    intakeThisMonthKg: 18450,
    totalPayoutRp: 64200000,
    warehouseCapacityPercent: 72,
    activeCitizensServed: 142,
    pendingDeliveriesCount: 4,
    satisfactionRating: 4.9,
  });

  return {
    stats,
  };
}
