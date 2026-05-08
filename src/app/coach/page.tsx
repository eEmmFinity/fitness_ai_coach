'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import {
  Users,
  Inbox,
  Activity,
  ArrowRight,
  Clock,
  AlertCircle,
  Sparkles,
  UserCircle,
  CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Overview {
  coachName: string;
  activeClients: number;
  pendingRequests: number;
  sessionsThisWeek: number;
  todaysClients: { _id: string; name: string; email: string }[];
  inactiveClients: { _id: string; name: string; email: string; startedAt: string }[];
  recentSessions: {
    _id: string;
    clientId: string;
    clientName: string;
    exerciseType: string;
    repCount: number;
    formScore: number;
    duration: number;
    createdAt: string;
  }[];
  bio: { length: number; completeness: number; hasBio: boolean };
}

function relTime(iso: string) {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function CoachOverviewPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/coach/overview')
      .then((r) => (r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`)))
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <p className="text-sm text-danger">Failed to load: {error}</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return 'Up early';
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const firstName = (data.coachName || user?.name || 'Coach').split(' ')[0];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Hero — accent gradient (coach identity) */}
      <Card variant="hero" className="p-0">
        <div className="relative bg-dot-grid">
          <div
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_350px_at_100%_0%,hsl(165_85%_55%/0.3),transparent_60%)]"
          />
          <div className="relative px-6 py-7 sm:px-10 sm:py-9 grid lg:grid-cols-[1fr_auto] gap-6 items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full border border-white/15">
                <Sparkles className="h-3 w-3" />
                {greeting}, coach
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Welcome back, {firstName}
              </h1>
              <p className="mt-2 text-white/70 max-w-xl">
                {data.activeClients === 0
                  ? "You don't have any active clients yet. Share your profile to start receiving requests."
                  : `${data.activeClients} active client${data.activeClients === 1 ? '' : 's'} · ${data.sessionsThisWeek} session${data.sessionsThisWeek === 1 ? '' : 's'} logged this week.`}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/coach/clients">
                  <Button variant="accent" leftIcon={<Users className="h-4 w-4" />}>
                    View clients
                  </Button>
                </Link>
                {data.pendingRequests > 0 && (
                  <Link href="/coach/requests">
                    <Button
                      variant="secondary"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/15"
                      leftIcon={<Inbox className="h-4 w-4" />}
                    >
                      Review {data.pendingRequests} pending
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Inline glass stat row */}
            <div className="grid grid-cols-3 gap-3 lg:min-w-[360px]">
              <HeroStat icon={Users} label="Active" value={data.activeClients} />
              <HeroStat icon={Inbox} label="Pending" value={data.pendingRequests} />
              <HeroStat icon={Activity} label="Sessions · 7d" value={data.sessionsThisWeek} />
            </div>
          </div>
        </div>
      </Card>

      {/* Bio status (only if no bio or thin bio) */}
      {!data.bio.hasBio || data.bio.completeness < 60 ? (
        <Card className="border-warning/30 bg-warning/5">
          <div className="flex items-start gap-4">
            <span className="w-10 h-10 rounded-md bg-warning/15 flex items-center justify-center flex-shrink-0">
              <UserCircle className="h-5 w-5 text-warning" />
            </span>
            <div className="flex-1">
              <h3 className="font-semibold">
                {data.bio.hasBio
                  ? 'Your profile could use more detail'
                  : 'Add a public bio'}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Coaches with detailed profiles receive {data.bio.hasBio ? 'more' : 'far more'} client requests.
                {!data.bio.hasBio && ' Share certifications, training style, and specialties.'}
              </p>
            </div>
            <Link href="/coach/profile">
              <Button size="sm" variant="outline">
                Edit profile
              </Button>
            </Link>
          </div>
        </Card>
      ) : null}

      {/* Two-column body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Today + Recent sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's clients */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Today's clients</CardTitle>
                  <CardDescription>
                    {data.todaysClients.length === 0
                      ? 'No client has logged a session yet today.'
                      : `${data.todaysClients.length} ${data.todaysClients.length === 1 ? 'client has' : 'clients have'} trained today.`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {data.todaysClients.length === 0 ? (
                <EmptyRow
                  icon={Clock}
                  title="Quiet morning"
                  copy="When clients run a Live Workout, they'll show up here."
                />
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.todaysClients.map((c) => (
                    <li key={c._id}>
                      <Link
                        href={`/coach/clients/${c._id}`}
                        className="flex items-center gap-3 p-2.5 rounded-md hover:bg-surface-2 transition group"
                      >
                        <Avatar name={c.name} size="md" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">{c.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {c.email}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Recent sessions feed */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Recent sessions</CardTitle>
                  <CardDescription>Across all your clients.</CardDescription>
                </div>
                {data.recentSessions.length > 0 && (
                  <Link
                    href="/coach/clients"
                    className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {data.recentSessions.length === 0 ? (
                <EmptyRow
                  icon={Activity}
                  title="No sessions yet"
                  copy="Your client activity will appear here as workouts are logged."
                />
              ) : (
                <ul className="divide-y divide-border/60">
                  {data.recentSessions.map((s) => (
                    <li key={s._id} className="py-2.5 first:pt-0 last:pb-0">
                      <Link
                        href={`/coach/clients/${s.clientId}`}
                        className="flex items-center gap-3 group"
                      >
                        <Avatar name={s.clientName} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm">
                            <span className="font-medium">{s.clientName}</span>
                            <span className="text-muted-foreground">
                              {' '}did {s.repCount}{' '}
                              <span className="capitalize">{s.exerciseType}</span>
                              {s.exerciseType === 'plank' ? 's' : ''}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground tabular">
                            {relTime(s.createdAt)} · form {s.formScore}/100
                          </div>
                        </div>
                        <FormBadge score={s.formScore} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Needs attention + Profile health */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                Needs attention
              </CardTitle>
              <CardDescription>
                Clients with no session in 7+ days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.inactiveClients.length === 0 ? (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                  Everyone has trained recently.
                </div>
              ) : (
                <ul className="space-y-2">
                  {data.inactiveClients.map((c) => (
                    <li key={c._id}>
                      <Link
                        href={`/coach/clients/${c._id}`}
                        className="flex items-center gap-3 p-2 -mx-2 rounded-md hover:bg-surface-2 transition group"
                      >
                        <Avatar name={c.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">
                            {c.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Linked since{' '}
                            {new Date(c.startedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile health</CardTitle>
              <CardDescription>How discoverable you are.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Bio completeness</span>
                <span className="text-sm font-semibold tabular">
                  {data.bio.completeness}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full bg-grad-accent transition-all"
                  style={{ width: `${data.bio.completeness}%` }}
                />
              </div>
              <Link
                href="/coach/profile"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-3"
              >
                {data.bio.hasBio ? 'Edit profile' : 'Add bio'}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HeroStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-md bg-white/8 backdrop-blur-sm border border-white/15 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/60">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-0.5 text-xl font-semibold text-white tabular">{value}</div>
    </div>
  );
}

function FormBadge({ score }: { score: number }) {
  const tone =
    score >= 80
      ? 'text-success bg-success/10 border-success/20'
      : score >= 60
      ? 'text-warning bg-warning/10 border-warning/20'
      : 'text-danger bg-danger/10 border-danger/20';
  return (
    <span
      className={`text-xs font-semibold tabular px-1.5 py-0.5 rounded-full border ${tone}`}
    >
      {score}
    </span>
  );
}

function EmptyRow({
  icon: Icon,
  title,
  copy,
}: {
  icon: LucideIcon;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="w-9 h-9 rounded-md bg-surface-2 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </span>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{copy}</div>
      </div>
    </div>
  );
}
