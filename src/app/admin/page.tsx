'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Users,
  UserCheck,
  ShieldAlert,
  Dumbbell,
  Activity,
  Inbox,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Stats {
  users: {
    total: number;
    suspended: number;
    byRole: Record<string, number>;
    pendingCoachApps: number;
  };
  plans: { total: number };
  sessions: { total: number; last7d: number };
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then(setStats)
      .catch((e) => setError(String(e)));
  }, []);

  if (error)
    return <p className="text-sm text-danger">Failed to load stats: {error}</p>;
  if (!stats) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Hero strip — three headline metrics in a single gradient surface */}
      <Card variant="hero" className="p-0">
        <div className="relative bg-dot-grid">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_350px_at_100%_0%,hsl(190_85%_60%/0.25),transparent_60%)]" />
          <div className="relative px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <HeroStat
              icon={Users}
              label="Total members"
              value={stats.users.total}
            />
            <HeroStat
              icon={Activity}
              label="Sessions · 7d"
              value={stats.sessions.last7d}
            />
            <HeroStat
              icon={Sparkles}
              label="Coach applications"
              value={stats.users.pendingCoachApps}
              hint={
                stats.users.pendingCoachApps > 0
                  ? 'Pending your review'
                  : 'You’re all caught up'
              }
            />
          </div>
        </div>
      </Card>

      {/* Secondary breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <FlatStat icon={UserCheck} label="Coaches" value={stats.users.byRole.coach ?? 0} />
        <FlatStat icon={Inbox} label="Pending coaches" value={stats.users.byRole.pending_coach ?? 0} />
        <FlatStat icon={ShieldAlert} label="Suspended" value={stats.users.suspended} />
        <FlatStat icon={Dumbbell} label="Workout plans" value={stats.plans.total} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All-time activity</CardTitle>
          <CardDescription>Cumulative numbers across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <FlatStat
              icon={Activity}
              label="Sessions"
              value={stats.sessions.total}
              variant="flat"
            />
            <FlatStat
              icon={Dumbbell}
              label="Workout plans"
              value={stats.plans.total}
              variant="flat"
            />
            <FlatStat
              icon={Users}
              label="Members"
              value={stats.users.total}
              variant="flat"
            />
            <FlatStat
              icon={UserCheck}
              label="Coaches"
              value={stats.users.byRole.coach ?? 0}
              variant="flat"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HeroStat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/70">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-3xl sm:text-4xl font-semibold text-white tabular">
        {value.toLocaleString()}
      </div>
      {hint && (
        <p className="mt-1 text-xs text-white/60">{hint}</p>
      )}
    </div>
  );
}

function FlatStat({
  icon: Icon,
  label,
  value,
  variant,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  variant?: 'flat';
}) {
  return (
    <Card variant={variant === 'flat' ? 'flat' : 'default'} className="p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular">
        {value.toLocaleString()}
      </div>
    </Card>
  );
}
