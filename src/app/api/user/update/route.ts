import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { calculateBMI, calculateBMR, calculateMaintenanceCalories } from '@/lib/calculations';

export async function PUT(request: NextRequest) {
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
    const { age, gender, height, weight, goal, lifestyle, experienceLevel } = body;

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update fields
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (goal) user.goal = goal;
    if (lifestyle) user.lifestyle = lifestyle;
    if (experienceLevel) user.experienceLevel = experienceLevel;

    // Calculate BMI if height and weight are available
    if (user.height && user.weight) {
      const bmiResult = calculateBMI(user.weight, user.height);
      user.bmi = bmiResult.bmi;

      // Calculate BMR and maintenance calories if all required data is available
      if (user.age && user.gender) {
        const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
        user.bmr = bmr;

        if (user.lifestyle) {
          const maintenance = calculateMaintenanceCalories(bmr, user.lifestyle);
          user.maintenanceCalories = maintenance;
        }
      }
    }

    await user.save();

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          age: user.age,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
          goal: user.goal,
          lifestyle: user.lifestyle,
          experienceLevel: user.experienceLevel,
          bmi: user.bmi,
          bmr: user.bmr,
          maintenanceCalories: user.maintenanceCalories,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
