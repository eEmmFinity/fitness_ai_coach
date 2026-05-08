import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import connectDB from '@/lib/db';
import CoachClient from '@/models/CoachClient';
import CoachNote from '@/models/CoachNote';
import { withRole } from '@/lib/withAuth';

const noteSchema = z.object({
  body: z.string().min(1).max(4000),
  sessionId: z
    .string()
    .refine((v) => mongoose.isValidObjectId(v), 'Invalid sessionId')
    .optional(),
});

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

  const notes = await CoachNote.find({ clientId: id })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  return NextResponse.json({ items: notes });
});

export const POST = withRole(['coach', 'admin'], async (request, decoded, context) => {
  await connectDB();
  const id = context?.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const ok = await ensureLinked(decoded.userId, id, decoded.role === 'admin');
  if (!ok) return NextResponse.json({ error: 'Not your client' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const note = await CoachNote.create({
    coachId: decoded.userId,
    clientId: id,
    sessionId: parsed.data.sessionId ?? null,
    body: parsed.data.body,
  });

  return NextResponse.json({ note }, { status: 201 });
});
