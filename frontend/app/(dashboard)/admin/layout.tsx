import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { requireRole } from '@/lib/server-auth';
import { AdminDashboardShell } from './admin-dashboard-shell';

async function ProtectedAdmin({ children }: { children: ReactNode }) {
  await requireRole('admin');
  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" aria-busy="true" />}>
      <ProtectedAdmin>{children}</ProtectedAdmin>
    </Suspense>
  );
}
