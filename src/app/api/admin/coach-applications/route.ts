import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withRole } from '@/lib/withAuth';

export const GET = withRole(['admin'], async () => {
  await connectDB();
  const applicants = await User.find({
    role: 'pending_coach',
    'coachApplication.status': 'pending',
  })
    .select('name email coachApplication createdAt')
    .sort({ 'coachApplication.appliedAt': 1 })
    .lean();

  return NextResponse.json({ items: applicants });
});
