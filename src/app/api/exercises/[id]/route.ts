import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Exercise from '@/models/Exercise';

// GET /api/exercises/[id] - Get single exercise by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const exercise = await Exercise.findById(params.id);

    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { exercise },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get exercise error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
