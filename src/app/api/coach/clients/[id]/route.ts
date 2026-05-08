import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import CoachClient from '@/models/CoachClient';
import WorkoutSession from '@/models/WorkoutSession';
import { withRole } from '@/lib/withAuth';

async function ensureLinked(coachId: string, clientId: string, isAdmin: boolean) {
  if (isAdmin) return true;
  const link = await CoachClient.findOne({
    coachId,
    clientId,
    status: 'active',
  }).lean();
  return !!link;
}

export const GET = withRole(['coach', 'admin'], async (_request, decoded, context) => {
  await connectDB();
  const id = context?.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const ok = await ensureLinked(decoded.userId, id, decoded.role === 'admin');
  if (!ok) return NextResponse.json({ error: 'Not your client' }, { status: 403 });

  const [client, sessions] = await Promise.all([
    User.findById(id).select('-password').lean(),
    WorkoutSession.find({ userId: id }).sort({ createdAt: -1 }).limit(50).lean(),
  ]);

  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ client, sessions });
});

export const DELETE = withRole(['coach', 'admin'], async (_request, decoded, context) => {
  await connectDB();
  const id = context?.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const link = await CoachClient.findOne({
    coachId: decoded.userId,
    clientId: id,
    status: 'active',
  });
  if (!link) return NextResponse.json({ error: 'Not your client' }, { status: 404 });

  link.status = 'ended';
  link.endedAt = new Date();
  await link.save();

  return NextResponse.json({ ok: true });
});
