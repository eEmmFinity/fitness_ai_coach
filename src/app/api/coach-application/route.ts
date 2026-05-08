import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/lib/withAuth';
import { sendEmail, appUrl } from '@/lib/email';

const submitSchema = z.object({
  bio: z.string().min(30).max(1000),
});

// GET: applicant reads their current application state
export const GET = withAuth(async (_request, decoded) => {
  await connectDB();
  const user = await User.findById(decoded.userId)
    .select('role coachApplication')
    .lean<{ role: string; coachApplication?: any } | null>();
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ role: user.role, application: user.coachApplication ?? null });
});

// POST: submit a fresh application (after rejection, or first time as a regular user)
export const POST = withAuth(async (request, decoded) => {
  await connectDB();
  const user = await User.findById(decoded.userId);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (user.role === 'coach' || user.role === 'admin') {
    return NextResponse.json(
      { error: 'You already have coach access' },
      { status: 400 }
    );
  }
  if (user.role === 'pending_coach') {
    return NextResponse.json(
      { error: 'You already have a pending application' },
      { status: 409 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  user.role = 'pending_coach';
  user.coachApplication = {
    status: 'pending',
    bio: parsed.data.bio.trim(),
    appliedAt: new Date(),
    decidedAt: null,
    decidedBy: null,
    rejectionReason: null,
  };
  await user.save();

  const admins = await User.find({ role: 'admin' })
    .select('email')
    .lean<{ email: string }[]>();
  await Promise.all(
    admins.map((a) =>
      sendEmail({
        to: a.email,
        subject: `Coach reapplication — ${user.name}`,
        text: `${user.name} (${user.email}) submitted a new coach application.\n\nReview at ${appUrl(
          '/admin/coach-applications'
        )}`,
      })
    )
  );

  return NextResponse.json({ application: user.coachApplication }, { status: 201 });
});

// DELETE: withdraw a pending application
export const DELETE = withAuth(async (_request, decoded) => {
  await connectDB();
  const user = await User.findById(decoded.userId);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (user.role !== 'pending_coach') {
    return NextResponse.json(
      { error: 'No pending application to withdraw' },
      { status: 400 }
    );
  }

  user.role = 'user';
  user.coachApplication = null;
  await user.save();

  return NextResponse.json({ ok: true });
});
