// Shared helpers used by every messaging endpoint.

import mongoose from 'mongoose';
import CoachClient from '@/models/CoachClient';

/**
 * Resolve (coachId, clientId) given the current user and the conversation partner.
 * Returns null if there is no active link — caller should 403.
 */
export async function resolveThread(meId: string, meRole: string, partnerId: string) {
  if (!mongoose.isValidObjectId(partnerId)) return null;

  const isCoachSide = meRole === 'coach' || meRole === 'admin';
  const coachId = isCoachSide ? meId : partnerId;
  const clientId = isCoachSide ? partnerId : meId;

  const link = await CoachClient.findOne({
    coachId,
    clientId,
    status: 'active',
  })
    .select('_id')
    .lean();

  if (!link) return null;
  return {
    coachId: new mongoose.Types.ObjectId(coachId),
    clientId: new mongoose.Types.ObjectId(clientId),
  };
}
