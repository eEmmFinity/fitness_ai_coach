import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CoachClient from '@/models/CoachClient';
import { withRole } from '@/lib/withAuth';

export const GET = withRole(['coach', 'admin'], async (_request, decoded) => {
  await connectDB();
  const links = await CoachClient.find({ coachId: decoded.userId, status: 'active' })
    .sort({ startedAt: -1 })
    .populate('clientId', 'name email goal experienceLevel bmi')
    .lean();
  return NextResponse.json({ items: links });
});
