import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (_request, decoded) => {
  await connectDB();
  const count = await Message.countDocuments({
    toId: new mongoose.Types.ObjectId(decoded.userId),
    readAt: null,
  });
  return NextResponse.json({ count });
});
