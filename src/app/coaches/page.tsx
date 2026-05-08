'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { ArrowRight, Search, Sparkles } from 'lucide-react';

interface Coach {
  _id: string;
  name: string;
  email: string;
  experienceLevel?: string;
  coachProfile?: { bio?: string } | null;
}

export default function CoachesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Coach[]>([]);
  const [q, setQ] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; msg: string; ok: boolean } | null>(
    null
  );

  useEffect(() => {
    if (!loading && !user) router.replace('/login?from=/coaches');
  }, [user, loading, router]);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    const res = await fetch(`/api/coaches?${params}`);
    if (res.ok) setItems((await res.json()).items);
  }, [q]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function request(coachId: string) {
    setBusyId(coachId);
    setFeedback(null);
    try {
      const res = await fetch('/api/coach/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coachId }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || `Failed (${res.status})`);
      setFeedback({ id: coachId, msg: 'Request sent', ok: true });
    } catch (e: any) {
      setFeedback({ id: coachId, msg: e.message, ok: false });
    } finally {
      setBusyId(null);
    }
  }

  if (loading || !user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Hero */}
      <Card variant="hero" className="p-0">
        <div className="relative bg-dot-grid">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_350px_at_100%_0%,hsl(165_85%_55%/0.3),transparent_60%)]" />
          <div className="relative px-6 py-8 sm:px-10 sm:py-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full border border-white/15">
              <Sparkles className="h-3 w-3" />
              Find your coach
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Real coaches, real feedback.
            </h1>
            <p className="mt-2 text-white/70 max-w-xl">
              Browse verified coaches, request the one that fits your goals, and start training with someone who'll actually look at your form.
            </p>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search by name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          leftAdornment={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <Card>
          <p className="text-muted-foreground">No coaches available right now.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {items.map((c) => {
            const fb = feedback?.id === c._id ? feedback : null;
            const bio = c.coachProfile?.bio?.trim();
            const snippet = bio
              ? bio.length > 130
                ? `${bio.slice(0, 130).trim()}…`
                : bio
              : null;
            return (
              <Card key={c._id} hover className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Avatar name={c.name} size="lg" />
                  <div className="min-w-0">
                    <Link
                      href={`/coaches/${c._id}`}
                      className="font-semibold text-base hover:underline truncate block"
                    >
                      {c.name}
                    </Link>
                    {c.experienceLevel && (
                      <p className="text-xs text-muted-foreground capitalize">
                        {c.experienceLevel} coach
                      </p>
                    )}
                  </div>
                </div>

                {snippet ? (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                    {snippet}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/70 italic flex-1">
                    No bio yet.
                  </p>
                )}

                <div className="flex items-center gap-3 mt-auto pt-2">
                  <Button
                    size="sm"
                    onClick={() => request(c._id)}
                    isLoading={busyId === c._id}
                  >
                    Request coach
                  </Button>
                  <Link
                    href={`/coaches/${c._id}`}
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    View profile <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {fb && (
                    <span
                      className={
                        fb.ok ? 'text-success text-xs ml-auto' : 'text-danger text-xs ml-auto'
                      }
                    >
                      {fb.msg}
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
