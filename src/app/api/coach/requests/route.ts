import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/User';
import CoachClient from '@/models/CoachClient';
import { withAuth, withRole } from '@/lib/withAuth';

const createSchema = z.object({
  coachId: z.string().refine((v) => mongoose.isValidObjectId(v), 'Invalid coachId'),
  message: z.string().max(500).optional(),
});

// Client requests linking with a coach
export const POST = withAuth(async (request, decoded) => {
  await connectDB();
  const body = await request.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }
  const { coachId, message } = parsed.data;

  if (coachId === decoded.userId) {
    return NextResponse.json({ error: 'Cannot link to yourself' }, { status: 400 });
  }

  const coach = await User.findById(coachId)
    .select('role suspendedAt')
    .lean<{ role: string; suspendedAt: Date | null } | null>();
  if (!coach || coach.role !== 'coach' || coach.suspendedAt) {
    return NextResponse.json({ error: 'Coach not available' }, { status: 404 });
  }

  const existing = await CoachClient.findOne({
    coachId,
    clientId: decoded.userId,
    status: { $in: ['pending', 'active'] },
  });
  if (existing) {
    return NextResponse.json(
      { error: 'You already have a pending or active link with this coach' },
      { status: 409 }
    );
  }

  const link = await CoachClient.create({
    coachId,
    clientId: decoded.userId,
    requestedBy: 'client',
    status: 'pending',
    message,
  });

  return NextResponse.json({ link }, { status: 201 });
});

// Coach lists incoming requests (default: pending)
export const GET = withRole(['coach', 'admin'], async (request, decoded) => {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') ?? 'pending';

  const requests = await CoachClient.find({ coachId: decoded.userId, status })
    .sort({ createdAt: -1 })
    .populate('clientId', 'name email')
    .lean();

  return NextResponse.json({ items: requests });
});
