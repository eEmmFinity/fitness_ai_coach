import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { checkRateLimitDb } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Rate limit: 10 attempts per 15 minutes per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rl = await checkRateLimitDb(`login:${ip}`, { windowMs: 15 * 60_000, max: 10 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    await Promise.race([
      connectDB(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database connection timeout')), 10000)
      ),
    ]);

    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.suspendedAt) {
      return NextResponse.json(
        { error: 'Account suspended. Contact support.' },
        { status: 403 }
      );
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          age: user.age,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
          goal: user.goal,
          lifestyle: user.lifestyle,
          experienceLevel: user.experienceLevel,
          bmi: user.bmi,
        },
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);

    if (error.message === 'Database connection timeout') {
      return NextResponse.json(
        { error: 'Database connection timeout. Please ensure MongoDB is running.' },
        { status: 503 }
      );
    }

    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 503 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
