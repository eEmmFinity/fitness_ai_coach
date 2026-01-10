import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WorkoutPlan from '@/models/WorkoutPlan';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// POST /api/workout-plans/[id]/activate - Set plan as active
export async function POST(
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

    // Verify plan belongs to user
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

    // Set this plan as active (pre-save middleware will deactivate others)
    plan.isActive = true;
    await plan.save();

    // Update user's activeWorkoutPlanId
    await User.findByIdAndUpdate(
      decoded.userId,
      { activeWorkoutPlanId: plan._id }
    );

    return NextResponse.json(
      {
        message: 'Workout plan activated successfully',
        plan
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Activate workout plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
