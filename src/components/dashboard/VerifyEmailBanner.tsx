'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail } from 'lucide-react';

export function VerifyEmailBanner({ email }: { email: string }) {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  async function resend() {
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || `Failed (${res.status})`);
      setFeedback({ ok: true, msg: 'Verification email sent.' });
    } catch (e: any) {
      setFeedback({ ok: false, msg: e.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="border-warning/30 bg-warning/5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="w-10 h-10 rounded-md bg-warning/15 flex items-center justify-center flex-shrink-0">
          <Mail className="h-5 w-5 text-warning" />
        </span>
        <div className="flex-1">
          <h3 className="font-semibold">Verify your email</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            We sent a link to <span className="text-foreground font-medium">{email}</span>.
            Click it to confirm.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {feedback && (
            <span className={feedback.ok ? 'text-sm text-success' : 'text-sm text-danger'}>
              {feedback.msg}
            </span>
          )}
          <Button size="sm" variant="outline" onClick={resend} isLoading={busy}>
            Resend
          </Button>
        </div>
      </div>
    </Card>
  );
}
