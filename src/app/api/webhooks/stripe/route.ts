import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getStripe, isBillingConfigured } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Tier = 'free' | 'pro';
type SubStatus = 'active' | 'past_due' | 'canceled' | 'incomplete' | 'none';

function mapStatus(s: Stripe.Subscription.Status): SubStatus {
  switch (s) {
    case 'active':
    case 'trialing':
      return 'active';
    case 'past_due':
      return 'past_due';
    case 'canceled':
    case 'unpaid':
      return 'canceled';
    case 'incomplete':
    case 'incomplete_expired':
    case 'paused':
    default:
      return 'incomplete';
  }
}

async function syncFromSubscription(sub: Stripe.Subscription) {
  await connectDB();

  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  const status = mapStatus(sub.status);
  const tier: Tier = status === 'active' || status === 'past_due' ? 'pro' : 'free';

  // current_period_end lives on the subscription item in newer Stripe API versions
  const periodEnd =
    sub.items?.data[0]?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end ??
    null;

  await User.updateOne(
    { 'subscription.stripeCustomerId': customerId },
    {
      $set: {
        'subscription.tier': tier,
        'subscription.status': status,
        'subscription.stripeSubscriptionId': sub.id,
        'subscription.currentPeriodEnd': periodEnd ? new Date(periodEnd * 1000) : null,
      },
    }
  );
}

export async function POST(request: NextRequest) {
  if (!isBillingConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const sig = request.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const stripe = getStripe();
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json({ error: `Bad signature: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        await syncFromSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription.id
          );
          await syncFromSubscription(sub);
        }
        break;
      }
      default:
        // ignore other events
        break;
    }
  } catch (err) {
    console.error('Stripe webhook handler error:', err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
