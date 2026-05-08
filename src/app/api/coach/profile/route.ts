import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withRole } from '@/lib/withAuth';

const patchSchema = z.object({
  bio: z.string().min(30, 'Bio must be at least 30 characters').max(1000),
});

export const GET = withRole(['coach', 'admin'], async (_request, decoded) => {
  await connectDB();
  const user = await User.findById(decoded.userId)
    .select('name coachProfile')
    .lean<{ name: string; coachProfile?: { bio?: string; approvedAt?: Date | null } | null } | null>();
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({
    name: user.name,
    coachProfile: user.coachProfile ?? null,
  });
});

export const PATCH = withRole(['coach', 'admin'], async (request, decoded) => {
  await connectDB();
  const body = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const user = await User.findById(decoded.userId);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const existingApprovedAt = user.coachProfile?.approvedAt ?? null;
  user.coachProfile = {
    bio: parsed.data.bio.trim(),
    approvedAt: existingApprovedAt,
  };
  await user.save();

  return NextResponse.json({ coachProfile: user.coachProfile });
});
