import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import { withRole } from '@/lib/withAuth';
import { sendEmail, appUrl } from '@/lib/email';

const patchSchema = z
  .object({
    action: z.enum(['approve', 'reject']),
    rejectionReason: z.string().max(500).optional(),
  })
  .refine(
    (d) => d.action !== 'reject' || (d.rejectionReason && d.rejectionReason.trim().length > 0),
    { message: 'rejectionReason is required when rejecting', path: ['rejectionReason'] }
  );

export const PATCH = withRole(['admin'], async (request, decoded, context) => {
  await connectDB();
  const id = context?.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const applicant = await User.findById(id);
  if (!applicant) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (applicant.role !== 'pending_coach' || applicant.coachApplication?.status !== 'pending') {
    return NextResponse.json(
      { error: 'No pending application for this user' },
      { status: 400 }
    );
  }

  const now = new Date();
  if (parsed.data.action === 'approve') {
    applicant.role = 'coach';
    const appBio =
      applicant.coachApplication.bio ??
      (applicant.coachApplication as any).get?.('bio');
    applicant.coachApplication = {
      ...applicant.coachApplication.toObject?.() ?? applicant.coachApplication,
      status: 'approved',
      decidedAt: now,
      decidedBy: new mongoose.Types.ObjectId(decoded.userId),
    };
    applicant.coachProfile = {
      bio: appBio,
      approvedAt: now,
    };
  } else {
    applicant.role = 'user';
    applicant.coachApplication = {
      ...applicant.coachApplication.toObject?.() ?? applicant.coachApplication,
      status: 'rejected',
      decidedAt: now,
      decidedBy: new mongoose.Types.ObjectId(decoded.userId),
      rejectionReason: parsed.data.rejectionReason!.trim(),
    };
  }
  await applicant.save();

  await AuditLog.create({
    actorId: decoded.userId,
    action: parsed.data.action === 'approve' ? 'user.role_changed' : 'user.role_changed',
    targetType: 'user',
    targetId: applicant._id,
    meta: {
      coachApplication: parsed.data.action,
      reason: parsed.data.rejectionReason,
    },
  });

  // Notify the applicant
  await sendEmail({
    to: applicant.email,
    subject:
      parsed.data.action === 'approve'
        ? 'Your coach application was approved'
        : 'Your coach application was not approved',
    text:
      parsed.data.action === 'approve'
        ? `Welcome aboard, ${applicant.name}. You can now access your coach dashboard at ${appUrl('/coach')}.`
        : `Hi ${applicant.name},\n\nYour coach application was reviewed and not approved at this time.\n\nReason: ${parsed.data.rejectionReason}\n\nYou can keep using the platform as a regular user, or apply again later.`,
  });

  return NextResponse.json({
    user: { id: applicant._id, role: applicant.role },
  });
});
