import { NextRequest, NextResponse } from 'next/server';
import { calculateBMI } from '@/lib/calculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weight, height } = body;

    // Validation
    if (!weight || !height) {
      return NextResponse.json(
        { error: 'Weight and height are required' },
        { status: 400 }
      );
    }

    if (weight < 20 || weight > 500) {
      return NextResponse.json(
        { error: 'Weight must be between 20-500 kg' },
        { status: 400 }
      );
    }

    if (height < 50 || height > 300) {
      return NextResponse.json(
        { error: 'Height must be between 50-300 cm' },
        { status: 400 }
      );
    }

    // Calculate BMI
    const result = calculateBMI(weight, height);

    return NextResponse.json(
      {
        message: 'BMI calculated successfully',
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('BMI calculation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
