import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// GET - Retrieve saved workout plan
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.workoutPlan) {
      return NextResponse.json({ workoutPlan: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        workoutPlan: user.workoutPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get workout plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Save workout plan
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { workoutPlan } = body;

    if (!workoutPlan) {
      return NextResponse.json({ error: 'Workout plan data is required' }, { status: 400 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Add createdAt timestamp
    const planWithTimestamp = {
      ...workoutPlan,
      createdAt: new Date(),
    };

    user.workoutPlan = planWithTimestamp;
    await user.save();

    return NextResponse.json(
      {
        message: 'Workout plan saved successfully',
        workoutPlan: user.workoutPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Save workout plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove saved workout plan
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.workoutPlan = undefined;
    await user.save();

    return NextResponse.json(
      {
        message: 'Workout plan deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete workout plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
