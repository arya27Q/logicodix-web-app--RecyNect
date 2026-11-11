'use client';

import React, { useState, useEffect } from 'react';
import { RecyclerSidebar } from '@/components/recycler/RecyclerSidebar';
import { RecyclerHeader } from '@/components/recycler/RecyclerHeader';
import { useRecyclerIncoming } from '@/hooks/recycler/useRecyclerIncoming';
import { apiClient } from '@/lib/api-client';

export function RecyclerDashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pendingCount } = useRecyclerIncoming();
  const [operatingHours, setOperatingHours] = useState('08:00 - 17:00');

  useEffect(() => {
    let isMounted = true;
    apiClient<{ recycler?: { operatingHours?: string } }>('/auth/me')
      .then((data) => {
        if (!isMounted || !data?.recycler?.operatingHours) return;
        setOperatingHours(data.recycler.operatingHours);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <RecyclerSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        pendingDeliveriesCount={pendingCount}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <RecyclerHeader
          onToggleSidebar={() => setIsSidebarOpen(true)}
          operatingHours={operatingHours}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
