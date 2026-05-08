'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { LayoutDashboard, Users, Shield, Inbox } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/login?from=/admin');
    else if (user.role !== 'admin') router.replace('/dashboard');
  }, [user, loading, router]);

  // Fetch the pending coach-application count for the sidebar badge
  useEffect(() => {
    if (user?.role !== 'admin') return;
    fetch('/api/admin/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setPendingCount(d?.users?.pendingCoachApps ?? 0))
      .catch(() => setPendingCount(null));
  }, [user]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-border border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <AppShell
      title="Admin"
      subtitle="Platform operations"
      Icon={Shield}
      tone="primary"
      nav={[
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        {
          name: 'Coach applications',
          href: '/admin/coach-applications',
          icon: Inbox,
          badge: pendingCount ?? undefined,
        },
      ]}
    >
      {children}
    </AppShell>
  );
}
