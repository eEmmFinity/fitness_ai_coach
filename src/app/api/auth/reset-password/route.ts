import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import { hashPassword } from '@/lib/auth';
import { hashToken } from '@/lib/email';

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(6).max(128),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  await connectDB();

  const record = await VerificationToken.findOne({
    tokenHash: hashToken(parsed.data.token),
    purpose: 'password_reset',
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!record) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const password = await hashPassword(parsed.data.password);

  await Promise.all([
    User.updateOne({ _id: record.userId }, { $set: { password } }),
    VerificationToken.updateOne({ _id: record._id }, { $set: { usedAt: new Date() } }),
    // Defense in depth: invalidate any other outstanding reset tokens for this user
    VerificationToken.updateMany(
      {
        userId: record.userId,
        purpose: 'password_reset',
        usedAt: null,
        _id: { $ne: record._id },
      },
      { $set: { usedAt: new Date() } }
    ),
  ]);

  return NextResponse.json({ ok: true });
}
