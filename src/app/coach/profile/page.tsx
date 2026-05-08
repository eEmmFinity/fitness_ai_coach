'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { ExternalLink, ShieldCheck } from 'lucide-react';

const MIN_BIO = 30;
const MAX_BIO = 1000;

export default function CoachProfileEditPage() {
  const { user } = useAuth();
  const [bio, setBio] = useState('');
  const [original, setOriginal] = useState('');
  const [approvedAt, setApprovedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/coach/profile')
      .then((r) => (r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`)))
      .then((d) => {
        const initial = d.coachProfile?.bio ?? '';
        setBio(initial);
        setOriginal(initial);
        setApprovedAt(d.coachProfile?.approvedAt ?? null);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const dirty = bio.trim() !== original.trim();
  const valid = bio.trim().length >= MIN_BIO && bio.trim().length <= MAX_BIO;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || !dirty) return;
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch('/api/coach/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: bio.trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Failed (${res.status})`);
      }
      setOriginal(bio.trim());
      setSaved(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold">Public profile</h2>
            <p className="text-sm text-muted-foreground">
              This is what clients see when browsing coaches.
            </p>
            {approvedAt && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Coaching since {new Date(approvedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {user?.id && (
            <Link
              href={`/coaches/${user.id}`}
              target="_blank"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              View public profile <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>

        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
              rows={8}
              minLength={MIN_BIO}
              maxLength={MAX_BIO}
              required
              disabled={busy}
              placeholder="Certifications, years coaching, specialties (mobility, strength, endurance), training philosophy…"
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setSaved(false);
              }}
            />
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-muted-foreground">
                {bio.trim().length < MIN_BIO
                  ? `${MIN_BIO - bio.trim().length} more characters needed`
                  : 'Looks good'}
              </span>
              <span
                className={
                  bio.length > MAX_BIO * 0.9
                    ? 'text-yellow-600'
                    : 'text-muted-foreground'
                }
              >
                {bio.length}/{MAX_BIO}
              </span>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {saved && <p className="text-sm text-green-600">Saved.</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={!valid || !dirty || busy}>
              {busy ? 'Saving…' : 'Save changes'}
            </Button>
            {dirty && !busy && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setBio(original);
                  setError(null);
                  setSaved(false);
                }}
              >
                Discard
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
