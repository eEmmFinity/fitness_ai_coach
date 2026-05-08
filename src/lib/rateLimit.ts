// Rate limiter with two backends:
//   - In-memory sync `checkRateLimit` (works in single-process dev)
//   - Mongo-backed async `checkRateLimitDb` (multi-node safe, survives deploys)
//
// Prefer `checkRateLimitDb` for new code. The in-memory version stays for
// non-DB hot paths and as a fallback if Mongo is unreachable.

import connectDB from './db';
import RateLimitBucket from '@/models/RateLimitBucket';
import { log } from './logger';

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Prune stale keys every 10 minutes to prevent unbounded memory growth.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.windowStart > 60_000) store.delete(key);
  }
}, 600_000);

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  identifier: string,
  { windowMs, max }: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now - entry.windowStart >= windowMs) {
    store.set(identifier, { count: 1, windowStart: now });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }

  entry.count++;
  const remaining = Math.max(0, max - entry.count);
  const resetAt = entry.windowStart + windowMs;

  return { allowed: entry.count <= max, remaining, resetAt };
}

/**
 * Persistent fixed-window limiter, backed by a Mongo TTL collection.
 * Atomic on the increment via $inc + $setOnInsert. Survives deploys and
 * works across multiple Node instances. Falls back to in-memory on DB error
 * so a Mongo blip doesn't lock everyone out.
 */
export async function checkRateLimitDb(
  identifier: string,
  { windowMs, max }: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / windowMs) * windowMs);
  const expiresAt = new Date(windowStart.getTime() + windowMs);
  const key = `${identifier}:${windowStart.getTime()}`;

  try {
    await connectDB();
    const doc = await RateLimitBucket.findOneAndUpdate(
      { key },
      {
        $inc: { count: 1 },
        $setOnInsert: { windowStart, expiresAt },
      },
      { upsert: true, new: true }
    ).lean<{ count: number } | null>();

    const count = doc?.count ?? 1;
    return {
      allowed: count <= max,
      remaining: Math.max(0, max - count),
      resetAt: expiresAt.getTime(),
    };
  } catch (err) {
    log.warn('rate-limit DB error, falling back to memory', {
      err: err instanceof Error ? err.message : String(err),
    });
    return checkRateLimit(identifier, { windowMs, max });
  }
}
