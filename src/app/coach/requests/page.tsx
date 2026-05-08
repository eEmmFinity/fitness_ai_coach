'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Req {
  _id: string;
  message?: string;
  createdAt: string;
  clientId: { _id: string; name: string; email: string };
}

export default function CoachRequestsPage() {
  const [items, setItems] = useState<Req[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await fetch('/api/coach/requests?status=pending');
    setItems((await r.json()).items);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, action: 'accept' | 'decline') {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/coach/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
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
        <p className="text-muted-foreground">No pending requests.</p>
      </Card>
    );

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-500">{error}</p>}
      {items.map((r) => (
        <Card key={r._id}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-semibold">{r.clientId.name}</p>
              <p className="text-sm text-muted-foreground">{r.clientId.email}</p>
              {r.message && (
                <p className="text-sm mt-2 italic">"{r.message}"</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => act(r._id, 'accept')}
                disabled={busyId === r._id}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => act(r._id, 'decline')}
                disabled={busyId === r._id}
              >
                Decline
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
