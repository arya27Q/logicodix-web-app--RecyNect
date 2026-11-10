import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { requireRole } from '@/lib/server-auth';

async function ProtectedProfile({ children }: { children: ReactNode }) {
  await requireRole('user');
  return children;
}

export default function UserProfileLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <ProtectedProfile>{children}</ProtectedProfile>
    </Suspense>
  );
}
