'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { Users, Inbox, LayoutDashboard, UserCircle, MessageSquare } from 'lucide-react';

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/login?from=/coach');
    else if (user.role !== 'coach' && user.role !== 'admin') router.replace('/dashboard');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || (user.role !== 'coach' && user.role !== 'admin')) return;
    fetch('/api/coach/requests?status=pending')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setPending(d?.items?.length ?? 0))
      .catch(() => setPending(null));
  }, [user]);

  if (loading || !user || (user.role !== 'coach' && user.role !== 'admin')) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-border border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <AppShell
      title="Coach"
      subtitle="Train and review your clients"
      Icon={Users}
      tone="accent"
      nav={[
        { name: 'Overview', href: '/coach', icon: LayoutDashboard },
        { name: 'Clients', href: '/coach/clients', icon: Users },
        { name: 'Messages', href: '/coach/messages', icon: MessageSquare },
        {
          name: 'Requests',
          href: '/coach/requests',
          icon: Inbox,
          badge: pending ?? undefined,
        },
        { name: 'Profile', href: '/coach/profile', icon: UserCircle },
      ]}
    >
      {children}
    </AppShell>
  );
}
