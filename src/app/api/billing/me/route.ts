import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { getUserSubscription, effectiveTier } from '@/lib/entitlements';

export const GET = withAuth(async (_request, decoded) => {
  const sub = await getUserSubscription(decoded.userId);
  return NextResponse.json({
    subscription: sub,
    tier: effectiveTier(sub),
  });
});
