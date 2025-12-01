import { NextRequest, NextResponse } from 'next/server';
import { calculateCalorieTargets, calculateMacros } from '@/lib/calculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weight, height, age, gender, lifestyle, goal } = body;

    // Validation
    if (!weight || !height || !age || !gender || !lifestyle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate calorie targets
    const calorieResult = calculateCalorieTargets(
      weight,
      height,
      age,
      gender,
      lifestyle
    );

    // Calculate macros based on goal
    let targetCalories = calorieResult.maintenance;
    if (goal === 'weight_loss') {
      targetCalories = calorieResult.weightLoss;
    } else if (goal === 'weight_gain' || goal === 'muscle_building') {
      targetCalories = calorieResult.weightGain;
    }

    const macros = calculateMacros(targetCalories, goal || 'maintenance');

    return NextResponse.json(
      {
        message: 'Calories calculated successfully',
        calories: calorieResult,
        macros,
        targetCalories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Calorie calculation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
