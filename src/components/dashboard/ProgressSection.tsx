'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkline, BarSeries } from '@/components/charts/MiniCharts';
import { Flame, Award, Activity, ArrowRight, TrendingUp } from 'lucide-react';

interface SeriesPoint {
  date: string;
  sessions: number;
  reps: number;
  duration: number;
  avgForm: number;
  calories: number;
}

interface Stats {
  days: number;
  series: SeriesPoint[];
  totals: { sessions: number; reps: number; duration: number; calories: number };
  avgForm: number;
  streak: number;
  byExercise: { _id: string; sessions: number; reps: number }[];
}

function fmtMinutes(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.round(seconds / 60)} min`;
}

export function ProgressSection() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/workout-sessions/stats')
      .then((r) => (r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`)))
      .then(setStats)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) {
    return (
      <Card>
        <p className="text-sm text-danger">Failed to load progress: {error}</p>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <p className="text-sm text-muted-foreground">Loading progress…</p>
      </Card>
    );
  }

  if (stats.totals.sessions === 0) {
    return (
      <Card hover className="border-gradient">
        <div className="flex items-start gap-4">
          <span className="w-10 h-10 rounded-md bg-grad-primary flex items-center justify-center shadow-glow">
            <TrendingUp className="h-5 w-5 text-white" />
          </span>
          <div className="flex-1">
            <h3 className="font-semibold">Start tracking your progress</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Run a Live Workout to unlock streaks, form trends, and rep-by-rep history.
            </p>
            <Link href="/live-workout" className="inline-block mt-4">
              <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                Start live workout
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  const repSeries = stats.series.map((d) => ({ date: d.date, value: d.reps }));
  const formSeries = stats.series
    .filter((d) => d.sessions > 0)
    .map((d) => ({ date: d.date, value: d.avgForm }));

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Headline tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <StatTile
          icon={<Flame className="h-4 w-4" />}
          label="Current streak"
          value={`${stats.streak}d`}
          tone="accent"
        />
        <StatTile
          icon={<Activity className="h-4 w-4" />}
          label="Sessions · 30d"
          value={stats.totals.sessions.toString()}
        />
        <StatTile
          icon={<Award className="h-4 w-4" />}
          label="Avg form"
          value={`${stats.avgForm}/100`}
        />
        <StatTile
          icon={<TrendingUp className="h-4 w-4" />}
          label="Total reps"
          value={stats.totals.reps.toString()}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Reps per day</CardTitle>
                <CardDescription>Last {stats.days} days</CardDescription>
              </div>
              <span className="text-xs text-muted-foreground">
                total <span className="text-foreground tabular font-semibold">{stats.totals.reps}</span>
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">
              <BarSeries data={repSeries} height={110} tone="primary" />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground mt-2 tabular">
              <span>{repSeries[0].date}</span>
              <span>{repSeries[repSeries.length - 1].date}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Form score trend</CardTitle>
                <CardDescription>
                  {formSeries.length > 0
                    ? `${formSeries.length} active day${formSeries.length === 1 ? '' : 's'}`
                    : 'No active days yet'}
                </CardDescription>
              </div>
              <span className="text-xs text-muted-foreground">
                avg{' '}
                <span className="text-foreground tabular font-semibold">
                  {stats.avgForm}
                </span>
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {formSeries.length > 1 ? (
              <Sparkline data={formSeries} height={110} tone="accent" />
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Need more sessions to draw a trend.
              </p>
            )}
            <div className="flex justify-between text-[11px] text-muted-foreground mt-2 tabular">
              <span>Time: {fmtMinutes(stats.totals.duration)}</span>
              <span>~{stats.totals.calories} kcal</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* By exercise */}
      {stats.byExercise.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">By exercise</CardTitle>
            <CardDescription>Volume across the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stats.byExercise.map((e) => {
                const totalReps = stats.byExercise.reduce(
                  (a, b) => a + b.reps,
                  0
                );
                const pct = totalReps === 0 ? 0 : (e.reps / totalReps) * 100;
                return (
                  <div
                    key={e._id}
                    className="rounded-md surface-2 border border-border/60 p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="capitalize font-medium">{e._id}</span>
                      <span className="text-xs text-muted-foreground tabular">
                        {e.sessions} · {e.reps} reps
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                      <div
                        className="h-full bg-grad-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: 'primary' | 'accent';
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span
          className={
            tone === 'accent'
              ? 'text-accent-from'
              : 'text-grad-primary inline-flex'
          }
        >
          {icon}
        </span>
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular">{value}</div>
    </Card>
  );
}
