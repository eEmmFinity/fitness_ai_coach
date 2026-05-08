import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/lib/withAuth';
import { getStripe, isBillingConfigured } from '@/lib/stripe';
import { appUrl } from '@/lib/email';

export const POST = withAuth(async (_request, decoded) => {
  if (!isBillingConfigured()) {
    return NextResponse.json({ error: 'Billing not configured' }, { status: 503 });
  }

  await connectDB();
  const user = await User.findById(decoded.userId);
  const customerId = user?.subscription?.stripeCustomerId;
  if (!user || !customerId) {
    return NextResponse.json(
      { error: 'No Stripe customer for this user yet' },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: appUrl('/billing'),
  });

  return NextResponse.json({ url: portal.url });
});
