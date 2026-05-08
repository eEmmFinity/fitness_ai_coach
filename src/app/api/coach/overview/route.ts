import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import CoachClient from '@/models/CoachClient';
import WorkoutSession from '@/models/WorkoutSession';
import { withRole } from '@/lib/withAuth';

const DAY_MS = 24 * 60 * 60_000;

interface ClientLite {
  _id: string;
  name: string;
  email: string;
}

interface SessionLite {
  _id: string;
  userId: string;
  exerciseType: string;
  repCount: number;
  formScore: number;
  duration: number;
  createdAt: string;
}

export const GET = withRole(['coach', 'admin'], async (_request, decoded) => {
  await connectDB();
  const coachId = new mongoose.Types.ObjectId(decoded.userId);
  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const weekAgo = new Date(now.getTime() - 7 * DAY_MS);

  // Active client links → resolve to user docs
  const activeLinks = await CoachClient.find({
    coachId,
    status: 'active',
  })
    .select('clientId startedAt')
    .populate('clientId', 'name email')
    .lean<{ clientId: ClientLite; startedAt: Date }[]>();

  const clientIds = activeLinks
    .map((l) => l.clientId?._id)
    .filter(Boolean) as unknown as mongoose.Types.ObjectId[];

  const clientMap = new Map<string, ClientLite>(
    activeLinks
      .filter((l) => !!l.clientId)
      .map((l) => [String(l.clientId._id), l.clientId])
  );

  const [
    pendingRequests,
    recentSessionsRaw,
    sessionsThisWeek,
    coach,
  ] = await Promise.all([
    CoachClient.countDocuments({ coachId, status: 'pending' }),
    clientIds.length
      ? WorkoutSession.find({ userId: { $in: clientIds } })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean<SessionLite[]>()
      : Promise.resolve([] as SessionLite[]),
    clientIds.length
      ? WorkoutSession.countDocuments({
          userId: { $in: clientIds },
          createdAt: { $gte: weekAgo },
        })
      : Promise.resolve(0),
    User.findById(coachId)
      .select('name coachProfile')
      .lean<{ name: string; coachProfile?: { bio?: string; approvedAt?: Date | null } | null } | null>(),
  ]);

  // Today's clients = unique clientIds with a session today
  const todaysClientIds = clientIds.length
    ? await WorkoutSession.distinct('userId', {
        userId: { $in: clientIds },
        createdAt: { $gte: startOfDay },
      })
    : [];
  const todaysClients = todaysClientIds
    .map((id: any) => clientMap.get(String(id)))
    .filter(Boolean) as ClientLite[];

  // Inactive: linked clients with no session in 7+ days
  const recentlyActive: Set<string> = new Set();
  if (clientIds.length) {
    const recents = await WorkoutSession.distinct('userId', {
      userId: { $in: clientIds },
      createdAt: { $gte: weekAgo },
    });
    for (const id of recents) recentlyActive.add(String(id));
  }
  const inactiveClients = activeLinks
    .filter((l) => l.clientId && !recentlyActive.has(String(l.clientId._id)))
    .map((l) => ({
      _id: String(l.clientId._id),
      name: l.clientId.name,
      email: l.clientId.email,
      startedAt: l.startedAt,
    }))
    .slice(0, 8);

  // Decorate recent sessions with the client's name
  const recentSessions = recentSessionsRaw.map((s) => {
    const c = clientMap.get(String(s.userId));
    return {
      _id: String(s._id),
      clientId: String(s.userId),
      clientName: c?.name ?? 'Client',
      exerciseType: s.exerciseType,
      repCount: s.repCount,
      formScore: s.formScore,
      duration: s.duration,
      createdAt: s.createdAt,
    };
  });

  const bio = coach?.coachProfile?.bio?.trim() ?? '';
  const bioCompleteness = Math.min(100, Math.round((bio.length / 200) * 100));

  return NextResponse.json({
    coachName: coach?.name ?? '',
    activeClients: activeLinks.length,
    pendingRequests,
    sessionsThisWeek,
    todaysClients,
    inactiveClients,
    recentSessions,
    bio: { length: bio.length, completeness: bioCompleteness, hasBio: bio.length > 0 },
  });
});
