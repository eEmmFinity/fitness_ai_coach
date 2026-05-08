import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/User';
import AuditLog, { AuditAction } from '@/models/AuditLog';
import { withRole } from '@/lib/withAuth';

const patchSchema = z
  .object({
    role: z.enum(['user', 'coach', 'admin']).optional(),
    suspended: z.boolean().optional(),
  })
  .refine((d) => d.role !== undefined || d.suspended !== undefined, {
    message: 'No changes provided',
  });

export const GET = withRole(['admin'], async (_request, _decoded, context) => {
  await connectDB();
  const id = context?.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const user = await User.findById(id).select('-password').lean();
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ user });
});

export const PATCH = withRole(['admin'], async (request, decoded, context) => {
  await connectDB();
  const id = context?.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  if (id === decoded.userId) {
    return NextResponse.json(
      { error: 'Admins cannot modify their own role or suspension' },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const target = await User.findById(id);
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updates: Record<string, unknown> = {};
  const auditEvents: { action: AuditAction; meta: Record<string, unknown> }[] = [];

  if (parsed.data.role && parsed.data.role !== target.role) {
    auditEvents.push({
      action: 'user.role_changed',
      meta: { from: target.role, to: parsed.data.role },
    });
    updates.role = parsed.data.role;
  }

  if (parsed.data.suspended !== undefined) {
    const isSuspended = !!target.suspendedAt;
    if (parsed.data.suspended && !isSuspended) {
      updates.suspendedAt = new Date();
      auditEvents.push({ action: 'user.suspended', meta: {} });
    } else if (!parsed.data.suspended && isSuspended) {
      updates.suspendedAt = null;
      auditEvents.push({ action: 'user.unsuspended', meta: {} });
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ user: target.toObject({ versionKey: false }) });
  }

  const updated = await User.findByIdAndUpdate(id, { $set: updates }, { new: true })
    .select('-password')
    .lean();

  await AuditLog.insertMany(
    auditEvents.map((e) => ({
      actorId: decoded.userId,
      action: e.action,
      targetType: 'user',
      targetId: id,
      meta: e.meta,
    }))
  );

  return NextResponse.json({ user: updated });
});
