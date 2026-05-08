import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import { generateToken, sendEmail, appUrl } from '@/lib/email';
import { checkRateLimitDb } from '@/lib/rateLimit';

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rl = await checkRateLimitDb(`forgot:${ip}`, { windowMs: 60 * 60_000, max: 5 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    // Don't leak validation details on this endpoint either
    return NextResponse.json({ ok: true });
  }

  await connectDB();
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });

  // Always 200 — don't reveal account existence
  if (!user) return NextResponse.json({ ok: true });

  // Invalidate prior reset tokens
  await VerificationToken.updateMany(
    { userId: user._id, purpose: 'password_reset', usedAt: null },
    { $set: { usedAt: new Date() } }
  );

  const { raw, hash } = generateToken();
  await VerificationToken.create({
    userId: user._id,
    purpose: 'password_reset',
    tokenHash: hash,
    expiresAt: new Date(Date.now() + 60 * 60_000),
  });

  await sendEmail({
    to: user.email,
    subject: 'Reset your password — Fitness AI Coach',
    text: `Reset your password: ${appUrl(`/reset-password?token=${raw}`)}\n\nThis link expires in 1 hour.`,
  });

  return NextResponse.json({ ok: true });
}
