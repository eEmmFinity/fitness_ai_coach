import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import { hashToken } from '@/lib/email';

const schema = z.object({ token: z.string().min(1) });

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  await connectDB();

  const tokenHash = hashToken(parsed.data.token);
  const record = await VerificationToken.findOne({
    tokenHash,
    purpose: 'email_verify',
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!record) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  await Promise.all([
    User.updateOne({ _id: record.userId }, { $set: { emailVerified: true } }),
    VerificationToken.updateOne({ _id: record._id }, { $set: { usedAt: new Date() } }),
  ]);

  return NextResponse.json({ ok: true });
}
