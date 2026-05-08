import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withRole } from '@/lib/withAuth';

export const GET = withRole(['admin'], async (request: NextRequest) => {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const role = searchParams.get('role');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '25', 10) || 25));

  const filter: Record<string, unknown> = {};
  if (q) {
    filter.$or = [
      { email: { $regex: q, $options: 'i' } },
      { name: { $regex: q, $options: 'i' } },
    ];
  }
  if (role && ['user', 'coach', 'admin'].includes(role)) {
    filter.role = role;
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .select('-password -workoutPlan')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
});
