import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import { hashPassword, generateToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';
import { checkRateLimitDb } from '@/lib/rateLimit';
import { generateToken as genToken, sendEmail, appUrl } from '@/lib/email';

export async function POST(request: NextRequest) {
  // Rate limit: 5 registrations per hour per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rl = await checkRateLimitDb(`register:${ip}`, { windowMs: 60 * 60_000, max: 5 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.' },
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

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, name, intendedRole, bio } = parsed.data;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const isCoachApplication = intendedRole === 'coach';
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: isCoachApplication ? 'pending_coach' : 'user',
      coachApplication: isCoachApplication
        ? {
            status: 'pending',
            bio: bio?.trim(),
            appliedAt: new Date(),
          }
        : null,
    });

    if (isCoachApplication) {
      // Notify admins so they see the application in the queue
      const admins = await User.find({ role: 'admin' }).select('email').lean<{ email: string }[]>();
      await Promise.all(
        admins.map((a) =>
          sendEmail({
            to: a.email,
            subject: `New coach application — ${user.name}`,
            text: `${user.name} (${user.email}) has applied to coach.\n\nReview at ${appUrl('/admin/coach-applications')}`,
          })
        )
      );
    }

    // Issue email-verify token
    const { raw, hash } = genToken();
    await VerificationToken.create({
      userId: user._id,
      purpose: 'email_verify',
      tokenHash: hash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60_000),
    });
    const verifyUrl = appUrl(`/verify-email?token=${raw}`);
    await sendEmail({
      to: user.email,
      subject: 'Verify your email — Fitness AI Coach',
      text: `Welcome ${user.name}! Verify your email by visiting:\n${verifyUrl}\n\nThis link expires in 24 hours.`,
    });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
      },
      { status: 201 }
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
    console.error('Registration error:', error);

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
