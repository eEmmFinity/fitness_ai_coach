'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, XCircle } from 'lucide-react';

interface AppState {
  role: 'user' | 'coach' | 'admin' | 'pending_coach';
  application:
    | {
        status: 'pending' | 'approved' | 'rejected';
        bio?: string;
        appliedAt?: string;
        decidedAt?: string | null;
        rejectionReason?: string | null;
      }
    | null;
}

const MIN_BIO = 30;

export function CoachApplicationBanner({
  initialRole,
  onChange,
}: {
  initialRole: AppState['role'];
  onChange?: () => void;
}) {
  const [state, setState] = useState<AppState | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [bio, setBio] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRole === 'admin' || initialRole === 'coach') return;
    fetch('/api/coach-application')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setState(d))
      .catch(() => undefined);
  }, [initialRole]);

  if (!state) return null;
  if (state.role === 'coach' || state.role === 'admin') return null;

  // Pending — withdraw available
  if (state.role === 'pending_coach') {
    const withdraw = async () => {
      if (!confirm('Withdraw your coach application?')) return;
      setBusy(true);
      try {
        const res = await fetch('/api/coach-application', { method: 'DELETE' });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Failed (${res.status})`);
        }
        onChange?.();
        setState({ role: 'user', application: null });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setBusy(false);
      }
    };

    return (
      <Card className="border-primary/30 bg-primary/5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="w-10 h-10 rounded-md bg-grad-primary flex items-center justify-center shadow-glow flex-shrink-0">
            <Clock className="h-5 w-5 text-primary-foreground" />
          </span>
          <div className="flex-1">
            <h3 className="font-semibold">Coach application under review</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              We'll email you once a decision is made.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {error && <span className="text-sm text-danger">{error}</span>}
            <Button size="sm" variant="outline" onClick={withdraw} isLoading={busy}>
              Withdraw
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Rejected — show reason + reapply
  if (state.application?.status === 'rejected') {
    const submit = async () => {
      if (bio.trim().length < MIN_BIO) {
        setError(`Bio must be at least ${MIN_BIO} characters.`);
        return;
      }
      setBusy(true);
      setError(null);
      try {
        const res = await fetch('/api/coach-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bio: bio.trim() }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Failed (${res.status})`);
        }
        onChange?.();
        setShowForm(false);
        setState({ role: 'pending_coach', application: { status: 'pending' } });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setBusy(false);
      }
    };

    return (
      <Card className="border-danger/30 bg-danger/5">
        <div className="flex items-start gap-4">
          <span className="w-10 h-10 rounded-md bg-danger/15 flex items-center justify-center flex-shrink-0">
            <XCircle className="h-5 w-5 text-danger" />
          </span>
          <div className="flex-1">
            <h3 className="font-semibold">Coach application not approved</h3>
            {state.application.rejectionReason && (
              <p className="text-sm mt-1">
                <span className="text-muted-foreground">Reviewer's note: </span>
                <span className="italic">"{state.application.rejectionReason}"</span>
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              You can revise and submit again whenever you're ready.
            </p>

            {!showForm ? (
              <div className="mt-3">
                <Button size="sm" onClick={() => setShowForm(true)}>
                  Reapply
                </Button>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <textarea
                  className="w-full rounded-md bg-input border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:bg-surface-2 transition leading-relaxed"
                  rows={4}
                  minLength={MIN_BIO}
                  maxLength={1000}
                  placeholder="Address the reviewer's note. Add certifications, specialties…"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={busy}
                />
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={
                      bio.trim().length >= MIN_BIO
                        ? 'text-success tabular'
                        : 'text-muted-foreground tabular'
                    }
                  >
                    {bio.trim().length}/{MIN_BIO} min
                  </span>
                </div>
                {error && <p className="text-sm text-danger">{error}</p>}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" onClick={submit} isLoading={busy}>
                    Submit application
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setBio('');
                      setError(null);
                    }}
                    disabled={busy}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
