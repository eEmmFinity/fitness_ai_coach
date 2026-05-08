'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState<'idle' | 'pending' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setMessage('Missing token.');
      return;
    }
    setState('pending');
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (r.ok) {
          setState('ok');
        } else {
          setState('error');
          setMessage(j.error || `Failed (${r.status})`);
        }
      })
      .catch((e) => {
        setState('error');
        setMessage(String(e));
      });
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email verification</CardTitle>
          <CardDescription>
            {state === 'pending' && 'Verifying your email…'}
            {state === 'ok' && 'Your email is verified.'}
            {state === 'error' && 'Verification failed.'}
            {state === 'idle' && 'Preparing…'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state === 'error' && message && (
            <p className="text-sm text-red-500 mb-4">{message}</p>
          )}
          <Link href="/dashboard">
            <Button className="w-full" disabled={state === 'pending'}>
              Continue to dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
