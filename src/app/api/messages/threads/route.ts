import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import CoachClient from '@/models/CoachClient';
import Message from '@/models/Message';
import { withAuth } from '@/lib/withAuth';

interface PartnerLite {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
}

export const GET = withAuth(async (_request, decoded) => {
  await connectDB();

  const meId = new mongoose.Types.ObjectId(decoded.userId);
  const isCoachSide = decoded.role === 'coach' || decoded.role === 'admin';

  // All active links the current user is part of
  const links = await CoachClient.find({
    status: 'active',
    ...(isCoachSide ? { coachId: meId } : { clientId: meId }),
  })
    .populate(isCoachSide ? 'clientId' : 'coachId', 'name email')
    .lean<
      Array<{
        _id: unknown;
        coachId: mongoose.Types.ObjectId | PartnerLite;
        clientId: mongoose.Types.ObjectId | PartnerLite;
      }>
    >();

  if (links.length === 0) return NextResponse.json({ items: [] });

  // For each thread, get the latest message + unread count toward me
  const threads = await Promise.all(
    links.map(async (l) => {
      const partner = (isCoachSide ? l.clientId : l.coachId) as PartnerLite;
      if (!partner || !partner._id) return null;

      const coachId = isCoachSide ? meId : (l.coachId as mongoose.Types.ObjectId);
      const clientId = isCoachSide ? (l.clientId as PartnerLite)._id : meId;

      const [latest, unread] = await Promise.all([
        Message.findOne({ coachId, clientId })
          .sort({ createdAt: -1 })
          .select('body fromId createdAt readAt')
          .lean<{
            body: string;
            fromId: mongoose.Types.ObjectId;
            createdAt: Date;
            readAt: Date | null;
          } | null>(),
        Message.countDocuments({
          coachId,
          clientId,
          toId: meId,
          readAt: null,
        }),
      ]);

      return {
        partnerId: String(partner._id),
        partnerName: partner.name,
        partnerEmail: partner.email,
        lastMessage: latest
          ? {
              body: latest.body,
              fromMe: String(latest.fromId) === String(meId),
              createdAt: latest.createdAt,
            }
          : null,
        unread,
      };
    })
  );

  // Filter out nulls, sort by last message time desc (then by partner name as fallback)
  const items = (threads.filter(Boolean) as NonNullable<(typeof threads)[number]>[])
    .sort((a, b) => {
      const ta = a!.lastMessage ? new Date(a!.lastMessage.createdAt).getTime() : 0;
      const tb = b!.lastMessage ? new Date(b!.lastMessage.createdAt).getTime() : 0;
      if (tb !== ta) return tb - ta;
      return (a!.partnerName || '').localeCompare(b!.partnerName || '');
    });

  return NextResponse.json({ items });
});
