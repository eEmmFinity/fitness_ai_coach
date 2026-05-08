// Single source of truth for tier → feature access.
// Add new flags here; do not scatter `if (tier === 'pro')` checks across routes.

export type Tier = 'free' | 'pro';

export interface TierLimits {
  aiChat: boolean;
  aiPlanGenerator: boolean;
  customExercisesMax: number;
  workoutPlansMax: number;
}

export const TIERS: Record<Tier, TierLimits> = {
  free: {
    aiChat: false,
    aiPlanGenerator: false,
    customExercisesMax: 5,
    workoutPlansMax: 1,
  },
  pro: {
    aiChat: true,
    aiPlanGenerator: true,
    customExercisesMax: Infinity,
    workoutPlansMax: Infinity,
  },
};

export interface UserSubscription {
  tier: Tier;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'none';
  currentPeriodEnd?: Date | null;
}

export function effectiveTier(_sub: UserSubscription | undefined | null): Tier {
  // TEMP: free-for-all — every authenticated user gets Pro.
  // Restore the original logic to re-enable paid gating.
  return 'pro';
}

export function can(
  sub: UserSubscription | undefined | null,
  feature: keyof TierLimits
): boolean | number {
  return TIERS[effectiveTier(sub)][feature];
}

import connectDB from './db';
import User from '@/models/User';

/**
 * Read sub from DB — JWT doesn't carry tier so upgrades don't require re-login.
 * Returns null when user not found.
 */
export async function getUserSubscription(
  userId: string
): Promise<UserSubscription | null> {
  await connectDB();
  const user = await User.findById(userId)
    .select('subscription role')
    .lean<{ subscription?: UserSubscription; role: string } | null>();
  if (!user) return null;
  // Coaches and admins always get pro features
  if (user.role === 'coach' || user.role === 'admin') {
    return { tier: 'pro', status: 'active', currentPeriodEnd: null };
  }
  return user.subscription ?? { tier: 'free', status: 'none' };
}
