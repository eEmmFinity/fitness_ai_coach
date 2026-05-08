import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (_request, _decoded, context) => {
  await connectDB();
  const id = context?.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const coach = await User.findOne({ _id: id, role: 'coach', suspendedAt: null })
    .select('name experienceLevel coachProfile createdAt')
    .lean<{
      _id: unknown;
      name: string;
      experienceLevel?: string;
      coachProfile?: { bio?: string; approvedAt?: Date | null } | null;
      createdAt: Date;
    } | null>();

  if (!coach) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ coach });
});
