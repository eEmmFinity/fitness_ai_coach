import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WorkoutPlan from '@/models/WorkoutPlan';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// GET /api/workout-plans/[id] - Get specific workout plan
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const plan = await WorkoutPlan.findOne({
      _id: params.id,
      userId: decoded.userId
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Workout plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { plan },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get workout plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/workout-plans/[id] - Update workout plan
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Find and update plan
    const plan = await WorkoutPlan.findOneAndUpdate(
      {
        _id: params.id,
        userId: decoded.userId
      },
      {
        $set: {
          name: body.name,
          weeklySchedule: body.weeklySchedule,
          generalNotes: body.generalNotes,
          nutritionTips: body.nutritionTips
        }
      },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return NextResponse.json(
        { error: 'Workout plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Workout plan updated successfully',
        plan
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update workout plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/workout-plans/[id] - Delete workout plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Delete plan
    const plan = await WorkoutPlan.findOneAndDelete({
      _id: params.id,
      userId: decoded.userId
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Workout plan not found' },
        { status: 404 }
      );
    }

    // Remove from user's workoutPlans array
    await User.findByIdAndUpdate(
      decoded.userId,
      {
        $pull: { workoutPlans: params.id },
        ...(plan.isActive && { $unset: { activeWorkoutPlanId: 1 } })
      }
    );

    return NextResponse.json(
      { message: 'Workout plan deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete workout plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
