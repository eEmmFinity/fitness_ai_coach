import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import connectDB from '@/lib/db';
import CoachClient from '@/models/CoachClient';
import { withRole } from '@/lib/withAuth';

const patchSchema = z.object({
  action: z.enum(['accept', 'decline']),
});

export const PATCH = withRole(['coach', 'admin'], async (request, decoded, context) => {
  await connectDB();
  const id = context?.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const link = await CoachClient.findById(id);
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (link.coachId.toString() !== decoded.userId && decoded.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (link.status !== 'pending') {
    return NextResponse.json(
      { error: `Cannot ${parsed.data.action} a ${link.status} request` },
      { status: 400 }
    );
  }

  if (parsed.data.action === 'accept') {
    link.status = 'active';
    link.startedAt = new Date();
  } else {
    link.status = 'declined';
  }
  await link.save();

  return NextResponse.json({ link });
});
