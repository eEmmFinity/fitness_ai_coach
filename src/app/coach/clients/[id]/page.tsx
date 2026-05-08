'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Sparkline } from '@/components/charts/MiniCharts';
import { ArrowLeft, Activity, Award, Flame, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Session {
  _id: string;
  exerciseType: string;
  repCount: number;
  formScore: number;
  duration: number;
  createdAt: string;
}

interface Client {
  _id: string;
  name: string;
  email: string;
  goal?: string;
  experienceLevel?: string;
  bmi?: number;
}

interface Note {
  _id: string;
  body: string;
  createdAt: string;
}

function relTime(iso: string) {
  const t = new Date(iso).getTime();
  const m = Math.floor((Date.now() - t) / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [client, setClient] = useState<Client | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    const [c, n] = await Promise.all([
      fetch(`/api/coach/clients/${id}`).then((r) => r.json()),
      fetch(`/api/coach/clients/${id}/notes`).then((r) => r.json()),
    ]);
    setClient(c.client);
    setSessions(c.sessions ?? []);
    setNotes(n.items ?? []);
  }, [id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Form-score sparkline — chronological, last 30 sessions
  const formSeries = useMemo(
    () =>
      sessions
        .slice(0, 30)
        .reverse()
        .map((s) => ({ date: s._id, value: s.formScore })),
    [sessions]
  );

  const headlineStats = useMemo(() => {
    if (sessions.length === 0)
      return { sessions: 0, totalReps: 0, avgForm: 0, lastSeen: null as string | null };
    const totalReps = sessions.reduce((a, s) => a + s.repCount, 0);
    const avgForm = Math.round(
      sessions.reduce((a, s) => a + s.formScore, 0) / sessions.length
    );
    return {
      sessions: sessions.length,
      totalReps,
      avgForm,
      lastSeen: sessions[0]?.createdAt ?? null,
    };
  }, [sessions]);

  async function addNote() {
    if (!draft.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/coach/clients/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: draft.trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Failed (${res.status})`);
      }
      setDraft('');
      await loadAll();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!client) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6 animate-slide-up">
      <Link
        href="/coach/clients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to clients
      </Link>

      {/* Client header */}
      <Card variant="hero" className="p-0">
        <div className="relative bg-dot-grid">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_350px_at_100%_0%,hsl(165_85%_55%/0.3),transparent_60%)]" />
          <div className="relative px-6 py-6 sm:px-10 sm:py-8 flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar name={client.name} size="xl" tone="accent" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {client.name}
              </h1>
              <p className="text-sm text-white/70 truncate">{client.email}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {client.goal && (
                  <Pill>Goal · <span className="capitalize">{client.goal.replace('_', ' ')}</span></Pill>
                )}
                {client.experienceLevel && (
                  <Pill>Level · <span className="capitalize">{client.experienceLevel}</span></Pill>
                )}
                {client.bmi !== undefined && (
                  <Pill>BMI · <span className="tabular">{client.bmi.toFixed(1)}</span></Pill>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Headline tiles + trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatTile
          icon={Activity}
          label="Sessions"
          value={headlineStats.sessions}
          hint={
            headlineStats.lastSeen
              ? `last ${relTime(headlineStats.lastSeen)}`
              : 'none yet'
          }
        />
        <StatTile
          icon={Award}
          label="Avg form"
          value={`${headlineStats.avgForm}/100`}
        />
        <StatTile
          icon={Flame}
          label="Total reps"
          value={headlineStats.totalReps}
        />
      </div>

      {/* Trend chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Form score trend</CardTitle>
          <CardDescription>
            {formSeries.length > 1
              ? `Last ${formSeries.length} sessions, oldest → newest.`
              : 'Need at least two sessions to draw a trend.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formSeries.length > 1 ? (
            <div className="text-accent-from">
              <Sparkline data={formSeries} height={120} tone="accent" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Trend will appear after the second session.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sessions table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent sessions</CardTitle>
          <CardDescription>Newest first.</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sessions logged yet.
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {sessions.slice(0, 12).map((s) => (
                <li
                  key={s._id}
                  className="py-2.5 first:pt-0 last:pb-0 grid grid-cols-[1fr_auto_auto] gap-3 items-center text-sm"
                >
                  <span className="capitalize font-medium">{s.exerciseType}</span>
                  <span className="text-muted-foreground tabular text-xs">
                    {s.repCount} reps · {Math.round(s.duration)}s
                  </span>
                  <FormBadge score={s.formScore} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Coach notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coach notes</CardTitle>
          <CardDescription>
            Private to you. The client doesn't see these.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <textarea
              className="w-full rounded-md bg-input border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:bg-surface-2 transition leading-relaxed"
              rows={3}
              placeholder="Write a note about this client…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={busy}
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button
              size="sm"
              onClick={addNote}
              isLoading={busy}
              disabled={!draft.trim()}
              leftIcon={<Send className="h-4 w-4" />}
            >
              Add note
            </Button>
          </div>

          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes yet.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((n) => (
                <li
                  key={n._id}
                  className="rounded-md surface-2 border border-border/60 p-3"
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {n.body}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 tabular">
                    {relTime(n.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-white/10 backdrop-blur border border-white/15 rounded-full px-2.5 py-0.5 text-white/80">
      {children}
    </span>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
    </Card>
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
