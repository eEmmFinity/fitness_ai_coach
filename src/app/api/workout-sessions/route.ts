import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WorkoutSession from '@/models/WorkoutSession';
import { verifyToken } from '@/lib/auth';
import { workoutSessionSchema } from '@/lib/validation';

// POST /api/workout-sessions — save a completed CV workout session
export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = workoutSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  // Don't bother saving zero-duration ghost sessions
  if (parsed.data.duration < 5) {
    return NextResponse.json({ error: 'Session too short to save' }, { status: 400 });
  }

  try {
    await connectDB();

    const session = await WorkoutSession.create({
      userId: decoded.userId,
      ...parsed.data,
    });

    return NextResponse.json({ message: 'Session saved', session }, { status: 201 });
  } catch (error) {
    console.error('Save workout session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/workout-sessions — fetch recent sessions for the logged-in user
export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100);
    const exerciseType = searchParams.get('exerciseType');

    const query: Record<string, unknown> = { userId: decoded.userId };
    if (exerciseType && ['squat', 'pushup', 'plank'].includes(exerciseType)) {
      query.exerciseType = exerciseType;
    }

    const sessions = await WorkoutSession.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ sessions, total: sessions.length }, { status: 200 });
  } catch (error) {
    console.error('Get workout sessions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
