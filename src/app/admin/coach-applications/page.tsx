'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Application {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  coachApplication: {
    status: 'pending' | 'approved' | 'rejected';
    bio?: string;
    appliedAt: string;
  };
}

export default function CoachApplicationsPage() {
  const [items, setItems] = useState<Application[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reasonDraft, setReasonDraft] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch('/api/admin/coach-applications');
    if (!res.ok) {
      setError(`Failed (${res.status})`);
      return;
    }
    setItems((await res.json()).items);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(id: string, action: 'approve' | 'reject') {
    setBusyId(id);
    setError(null);
    try {
      const body =
        action === 'reject'
          ? { action, rejectionReason: reasonDraft[id]?.trim() || '' }
          : { action };
      const res = await fetch(`/api/admin/coach-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Failed (${res.status})`);
      }
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  }

  if (!items) return <p className="text-muted-foreground">Loading…</p>;
  if (items.length === 0)
    return (
      <Card>
        <p className="text-muted-foreground">No pending coach applications.</p>
      </Card>
    );

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
      {items.map((a) => {
        const reason = reasonDraft[a._id] ?? '';
        const canReject = reason.trim().length > 0;
        return (
          <Card key={a._id}>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">{a.name}</p>
                <p className="text-sm text-muted-foreground">{a.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Applied {new Date(a.coachApplication.appliedAt).toLocaleString()}
                </p>
              </div>

              {a.coachApplication.bio && (
                <div className="bg-muted/50 rounded-md p-3">
                  <p className="text-xs text-muted-foreground mb-1">Bio</p>
                  <p className="text-sm whitespace-pre-wrap">{a.coachApplication.bio}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">
                    Rejection reason (required to reject)
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g. unable to verify certifications"
                    value={reason}
                    disabled={busyId === a._id}
                    onChange={(e) =>
                      setReasonDraft((s) => ({ ...s, [a._id]: e.target.value }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => decide(a._id, 'approve')}
                    disabled={busyId === a._id}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => decide(a._id, 'reject')}
                    disabled={busyId === a._id || !canReject}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
