'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface Coach {
  _id: string;
  name: string;
  experienceLevel?: string;
  coachProfile?: { bio?: string; approvedAt?: string | null } | null;
  createdAt: string;
}

export default function CoachProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { user, loading } = useAuth();
  const router = useRouter();

  const [coach, setCoach] = useState<Coach | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace(`/login?from=/coaches/${id}`);
  }, [user, loading, id, router]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/coaches/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`)))
      .then((d) => setCoach(d.coach))
      .catch((e) => setError(String(e)));
  }, [id, user]);

  async function request() {
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/coach/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coachId: id }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || `Failed (${res.status})`);
      setFeedback({ ok: true, msg: 'Request sent.' });
    } catch (e: any) {
      setFeedback({ ok: false, msg: e.message });
    } finally {
      setBusy(false);
    }
  }

  if (loading || !user) return null;
  if (error)
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-danger text-sm">Failed to load: {error}</p>
      </div>
    );
  if (!coach)
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );

  const bio = coach.coachProfile?.bio?.trim();
  const since = new Date(
    coach.coachProfile?.approvedAt ?? coach.createdAt
  ).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">
      <Link
        href="/coaches"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to coaches
      </Link>

      {/* Hero panel */}
      <Card variant="hero" className="p-0">
        <div className="relative bg-dot-grid">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_350px_at_100%_0%,hsl(190_85%_60%/0.3),transparent_60%)]" />
          <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex items-start gap-5">
            <Avatar name={coach.name} size="xl" tone="primary" />
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full border border-white/15">
                <Sparkles className="h-3 w-3" />
                Verified coach
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {coach.name}
              </h1>
              <p className="mt-1 text-white/70 capitalize">
                {coach.experienceLevel ? `${coach.experienceLevel} coach · ` : ''}
                Coaching since {since}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          About
        </h2>
        {bio ? (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{bio}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            This coach hasn't added a bio yet.
          </p>
        )}

        {(user.role === 'user' || user.role === 'pending_coach') && (
          <div className="mt-6 flex items-center gap-3 pt-5 border-t border-border/60">
            <Button onClick={request} isLoading={busy}>
              Request this coach
            </Button>
            {feedback && (
              <span
                className={
                  feedback.ok ? 'text-sm text-success' : 'text-sm text-danger'
                }
              >
                {feedback.msg}
              </span>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
