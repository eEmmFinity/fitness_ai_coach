import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import { withAuth } from '@/lib/withAuth';
import { generateToken, sendEmail, appUrl } from '@/lib/email';
import { checkRateLimitDb } from '@/lib/rateLimit';

export const POST = withAuth(async (_request, decoded) => {
  const rl = await checkRateLimitDb(`verify:${decoded.userId}`, {
    windowMs: 15 * 60_000,
    max: 3,
  });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  await connectDB();
  const user = await User.findById(decoded.userId);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (user.emailVerified) {
    return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
  }

  // Invalidate any outstanding verify tokens for this user
  await VerificationToken.updateMany(
    { userId: user._id, purpose: 'email_verify', usedAt: null },
    { $set: { usedAt: new Date() } }
  );

  const { raw, hash } = generateToken();
  await VerificationToken.create({
    userId: user._id,
    purpose: 'email_verify',
    tokenHash: hash,
    expiresAt: new Date(Date.now() + 24 * 60 * 60_000),
  });

  await sendEmail({
    to: user.email,
    subject: 'Verify your email — Fitness AI Coach',
    text: `Verify your email: ${appUrl(`/verify-email?token=${raw}`)}\n\nThis link expires in 24 hours.`,
  });

  return NextResponse.json({ ok: true });
});
