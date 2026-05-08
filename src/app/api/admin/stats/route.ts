import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import WorkoutPlan from '@/models/WorkoutPlan';
import WorkoutSession from '@/models/WorkoutSession';
import { withRole } from '@/lib/withAuth';

export const GET = withRole(['admin'], async () => {
  await connectDB();

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    byRole,
    suspended,
    pendingCoachApps,
    totalPlans,
    totalSessions,
    sessions7d,
  ] = await Promise.all([
    User.countDocuments({}),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    User.countDocuments({ suspendedAt: { $ne: null } }),
    User.countDocuments({
      role: 'pending_coach',
      'coachApplication.status': 'pending',
    }),
    WorkoutPlan.countDocuments({}),
    WorkoutSession.countDocuments({}),
    WorkoutSession.countDocuments({ createdAt: { $gte: since } }),
  ]);

  const roleCounts: Record<string, number> = {
    user: 0,
    coach: 0,
    admin: 0,
    pending_coach: 0,
  };
  for (const r of byRole) roleCounts[r._id] = r.count;

  return NextResponse.json({
    users: { total: totalUsers, suspended, byRole: roleCounts, pendingCoachApps },
    plans: { total: totalPlans },
    sessions: { total: totalSessions, last7d: sessions7d },
  });
});
