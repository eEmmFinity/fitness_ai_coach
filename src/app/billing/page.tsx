'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BillingState {
  tier: 'free' | 'pro';
  subscription: {
    tier: 'free' | 'pro';
    status: string;
    currentPeriodEnd?: string | null;
    stripeCustomerId?: string | null;
  } | null;
}

const PRO_FEATURES = [
  'AI Coach unlimited chat',
  'AI-generated workout plans',
  'Unlimited custom exercises',
  'Unlimited saved workout plans',
  'Priority support',
];

export default function BillingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const flashStatus = params.get('status');

  const [state, setState] = useState<BillingState | null>(null);
  const [busy, setBusy] = useState<'checkout' | 'portal' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?from=/billing');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/billing/me')
      .then((r) => r.json())
      .then(setState);
  }, [user]);

  async function startCheckout() {
    setBusy('checkout');
    setError(null);
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' });
      const j = await res.json();
      if (!res.ok || !j.url) throw new Error(j.error || `Failed (${res.status})`);
      window.location.href = j.url;
    } catch (e: any) {
      setError(e.message);
      setBusy(null);
    }
  }

  async function openPortal() {
    setBusy('portal');
    setError(null);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const j = await res.json();
      if (!res.ok || !j.url) throw new Error(j.error || `Failed (${res.status})`);
      window.location.href = j.url;
    } catch (e: any) {
      setError(e.message);
      setBusy(null);
    }
  }

  if (authLoading || !user) return null;

  const isPro = state?.tier === 'pro';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-2">Billing</h1>
      <p className="text-muted-foreground mb-6">
        Manage your subscription and unlock Pro features.
      </p>

      {flashStatus === 'success' && (
        <Card className="mb-6 border-green-500/40 bg-green-500/5">
          <CardContent className="pt-6">
            <p className="text-green-700 dark:text-green-400">
              Subscription confirmed. It can take a few seconds for Stripe to notify us.
            </p>
          </CardContent>
        </Card>
      )}
      {flashStatus === 'cancel' && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Checkout cancelled — you weren't charged.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current plan</CardTitle>
            <CardDescription>
              {state == null
                ? 'Loading…'
                : isPro
                ? 'You’re on Pro.'
                : 'You’re on the Free plan.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold capitalize">
                {state?.tier ?? '–'}
              </span>
              {state?.subscription?.currentPeriodEnd && (
                <span className="text-sm text-muted-foreground">
                  renews {new Date(state.subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              )}
            </div>
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            {isPro ? (
              <Button
                variant="outline"
                onClick={openPortal}
                disabled={busy === 'portal'}
              >
                {busy === 'portal' ? 'Opening…' : 'Manage subscription'}
              </Button>
            ) : (
              <Button onClick={startCheckout} disabled={busy === 'checkout'} className="gap-2">
                <Sparkles className="h-4 w-4" />
                {busy === 'checkout' ? 'Redirecting…' : 'Upgrade to Pro'}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pro includes</CardTitle>
            <CardDescription>Everything you need to actually train.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
