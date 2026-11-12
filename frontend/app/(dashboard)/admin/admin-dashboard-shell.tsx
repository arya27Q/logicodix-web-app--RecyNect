'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { apiClient } from '@/lib/api-client';

interface AdminProfileSummary {
  name: string;
  adminRole?: string;
}

interface AdminStatsSummary {
  pendingVerifications: number;
  anomalyReportsCount: number;
  stalePriceCount: number;
}

const ROLE_LABELS: Record<string, string> = {
  superadmin: 'Super Administrator',
  moderator: 'Moderator Mitra',
  auditor: 'Auditor Harga',
  admin: 'Administrator',
};

export function AdminDashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('Administrator');
  const [adminRoleLabel, setAdminRoleLabel] = useState('Admin Console');
  const [pendingCount, setPendingCount] = useState(0);
  const [priceAlertCount, setPriceAlertCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const syncShellData = () => {
      Promise.all([
        apiClient<AdminProfileSummary>('/admin/profile').catch(() => null),
        apiClient<AdminStatsSummary>('/admin/stats').catch(() => null),
      ]).then(([profileRes, statsRes]) => {
        if (!isMounted) return;
        if (profileRes?.name) {
          setAdminName(profileRes.name);
          const roleKey = (profileRes.adminRole || 'admin').toLowerCase();
          setAdminRoleLabel(ROLE_LABELS[roleKey] || 'Administrator');
        }
        if (statsRes) {
          setPendingCount(Number(statsRes.pendingVerifications || 0));
          setPriceAlertCount(
            Number(statsRes.anomalyReportsCount || 0) + Number(statsRes.stalePriceCount || 0),
          );
        }
      });
    };

    syncShellData();

    if (typeof window !== 'undefined') {
      window.addEventListener('admin-data-changed', syncShellData);
    }
    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('admin-data-changed', syncShellData);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        pendingVerificationsCount={pendingCount}
        adminName={adminName}
        adminRoleLabel={adminRoleLabel}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen(true)}
          pendingVerificationsCount={pendingCount}
          priceAlertCount={priceAlertCount}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
