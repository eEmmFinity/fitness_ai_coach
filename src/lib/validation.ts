import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .max(254, 'Email too long'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .max(128, 'Password too long'),
});

export const registerSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .max(254, 'Email too long'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password too long'),
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name is required')
      .max(100, 'Name too long')
      .trim(),
    // Self-selectable signup roles. 'admin' is never assignable from public signup.
    intendedRole: z.enum(['user', 'coach']).default('user'),
    bio: z.string().max(1000).optional(),
  })
  .refine(
    (data) => data.intendedRole !== 'coach' || (data.bio && data.bio.trim().length >= 30),
    {
      message: 'Coach applicants must include a bio of at least 30 characters.',
      path: ['bio'],
    }
  );

export const workoutSessionSchema = z.object({
  exerciseType: z.enum(['squat', 'pushup', 'plank']),
  repCount: z.number().int().min(0).max(10_000),
  formScore: z.number().min(0).max(100),
  caloriesBurned: z.number().min(0).max(10_000),
  duration: z.number().int().min(0).max(86_400),
  tempo: z.number().min(0).max(1_000),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type WorkoutSessionInput = z.infer<typeof workoutSessionSchema>;
