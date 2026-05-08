import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (request: NextRequest) => {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  const filter: Record<string, unknown> = { role: 'coach', suspendedAt: null };
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ];
  }

  const coaches = await User.find(filter)
    .select('name email experienceLevel coachProfile createdAt')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ items: coaches });
});
