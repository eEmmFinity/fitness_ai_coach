import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/lib/withAuth';
import { getStripe, isBillingConfigured } from '@/lib/stripe';
import { appUrl } from '@/lib/email';

export const POST = withAuth(async (_request, decoded) => {
  if (!isBillingConfigured()) {
    return NextResponse.json(
      { error: 'Billing not configured (set STRIPE_SECRET_KEY and STRIPE_PRICE_PRO)' },
      { status: 503 }
    );
  }

  await connectDB();
  const user = await User.findById(decoded.userId);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const stripe = getStripe();

  let customerId = user.subscription?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user._id.toString() },
    });
    customerId = customer.id;
    user.subscription = {
      ...(user.subscription ?? { tier: 'free', status: 'none' }),
      stripeCustomerId: customerId,
    };
    await user.save();
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_PRICE_PRO!, quantity: 1 }],
    success_url: appUrl('/billing?status=success'),
    cancel_url: appUrl('/billing?status=cancel'),
    allow_promotion_codes: true,
    client_reference_id: user._id.toString(),
  });

  return NextResponse.json({ url: session.url });
});
