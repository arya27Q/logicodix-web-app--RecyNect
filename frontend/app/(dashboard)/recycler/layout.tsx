'use client';

import React, { useState } from 'react';
import { RecyclerSidebar } from '@/components/recycler/RecyclerSidebar';
import { RecyclerHeader } from '@/components/recycler/RecyclerHeader';
import { useRecyclerIncoming } from '@/hooks/recycler/useRecyclerIncoming';

export default function RecyclerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pendingCount } = useRecyclerIncoming();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <RecyclerSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        pendingDeliveriesCount={pendingCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <RecyclerHeader onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
