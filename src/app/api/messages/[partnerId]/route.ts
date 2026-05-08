import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import { withAuth } from '@/lib/withAuth';
import { resolveThread } from '@/lib/messagingAccess';

const sendSchema = z.object({
  body: z.string().min(1).max(4000),
});

export const GET = withAuth(async (request, decoded, context) => {
  await connectDB();
  const partnerId = context?.params.partnerId;
  if (!partnerId) {
    return NextResponse.json({ error: 'Missing partnerId' }, { status: 400 });
  }

  const thread = await resolveThread(decoded.userId, decoded.role, partnerId);
  if (!thread) {
    return NextResponse.json({ error: 'No active conversation' }, { status: 403 });
  }

  const url = new URL(request.url);
  const since = url.searchParams.get('since'); // ISO timestamp for incremental polling

  const filter: Record<string, unknown> = {
    coachId: thread.coachId,
    clientId: thread.clientId,
  };
  if (since) {
    const t = new Date(since);
    if (!Number.isNaN(t.getTime())) filter.createdAt = { $gt: t };
  }

  const messages = await Message.find(filter)
    .sort({ createdAt: 1 })
    .limit(200)
    .lean();

  // Mark messages addressed to me as read
  await Message.updateMany(
    {
      coachId: thread.coachId,
      clientId: thread.clientId,
      toId: new mongoose.Types.ObjectId(decoded.userId),
      readAt: null,
    },
    { $set: { readAt: new Date() } }
  );

  return NextResponse.json({ messages });
});

export const POST = withAuth(async (request, decoded, context) => {
  await connectDB();
  const partnerId = context?.params.partnerId;
  if (!partnerId) {
    return NextResponse.json({ error: 'Missing partnerId' }, { status: 400 });
  }

  const thread = await resolveThread(decoded.userId, decoded.role, partnerId);
  if (!thread) {
    return NextResponse.json({ error: 'No active conversation' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const fromId = new mongoose.Types.ObjectId(decoded.userId);
  const toId =
    String(thread.coachId) === decoded.userId ? thread.clientId : thread.coachId;

  const msg = await Message.create({
    coachId: thread.coachId,
    clientId: thread.clientId,
    fromId,
    toId,
    body: parsed.data.body.trim(),
  });

  return NextResponse.json({ message: msg }, { status: 201 });
});
