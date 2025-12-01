import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { generateWorkoutRoutine, getBMICategory } from '@/lib/routineGenerator';

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

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate required user data
    if (!user.goal || !user.experienceLevel || !user.age || !user.gender) {
      return NextResponse.json(
        {
          error: 'Missing required profile data. Please complete your profile first.',
        },
        { status: 400 }
      );
    }

    // Get BMI category
    const bmiCategory = user.bmi ? getBMICategory(user.bmi) : 'Normal weight';

    // Generate routine
    const routine = generateWorkoutRoutine(
      user.goal,
      user.experienceLevel,
      user.gender,
      user.age,
      bmiCategory
    );

    // Transform routine to match frontend expected format
    const workoutPlan = {
      weeklySchedule: routine.weeklyPlan.map(day => ({
        day: day.day,
        focus: day.focus,
        duration: day.duration,
        exercises: day.exercises.map(exercise => ({
          name: exercise.name,
          sets: parseInt(exercise.sets) || 1,
          reps: exercise.reps,
          rest: exercise.rest,
          notes: exercise.notes,
        })),
      })),
      generalNotes: routine.generalNotes.join('\n\n'),
      nutritionTips: routine.nutrition.join('\n\n'),
    };

    return NextResponse.json(
      {
        message: 'Routine generated successfully',
        workoutPlan,
        userProfile: {
          goal: user.goal,
          experienceLevel: user.experienceLevel,
          bmiCategory,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Generate routine error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
