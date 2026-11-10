import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { requireRole } from '@/lib/server-auth';
import { RecyclerDashboardShell } from './recycler-dashboard-shell';

async function ProtectedRecycler({ children }: { children: ReactNode }) {
  await requireRole('recycler');
  return <RecyclerDashboardShell>{children}</RecyclerDashboardShell>;
}

export default function RecyclerDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" aria-busy="true" />}>
      <ProtectedRecycler>{children}</ProtectedRecycler>
    </Suspense>
  );
}
