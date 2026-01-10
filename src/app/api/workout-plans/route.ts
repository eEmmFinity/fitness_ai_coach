import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WorkoutPlan from '@/models/WorkoutPlan';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// GET /api/workout-plans - Get all user's workout plans
export async function GET(request: NextRequest) {
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

    // Get all plans for this user
    const plans = await WorkoutPlan.find({ userId: decoded.userId })
      .sort({ isActive: -1, createdAt: -1 }) // Active plans first, then by creation date
      .lean();

    // Get active plan ID
    const activePlan = plans.find(plan => plan.isActive);

    return NextResponse.json(
      {
        plans,
        activePlanId: activePlan?._id || null,
        total: plans.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get workout plans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/workout-plans - Create new custom workout plan
export async function POST(request: NextRequest) {
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

    // Validate required fields
    const { name, weeklySchedule } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Plan name is required' },
        { status: 400 }
      );
    }

    if (!weeklySchedule || !Array.isArray(weeklySchedule) || weeklySchedule.length === 0) {
      return NextResponse.json(
        { error: 'Weekly schedule is required and must have at least one day' },
        { status: 400 }
      );
    }

    // Create new workout plan
    const plan = new WorkoutPlan({
      userId: decoded.userId,
      name,
      type: 'custom',
      isActive: body.isActive || false,
      weeklySchedule,
      generalNotes: body.generalNotes || '',
      nutritionTips: body.nutritionTips || ''
    });

    await plan.save();

    // Add plan to user's workoutPlans array
    await User.findByIdAndUpdate(
      decoded.userId,
      {
        $addToSet: { workoutPlans: plan._id },
        ...(body.isActive && { activeWorkoutPlanId: plan._id })
      }
    );

    return NextResponse.json(
      {
        message: 'Workout plan created successfully',
        plan
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create workout plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
