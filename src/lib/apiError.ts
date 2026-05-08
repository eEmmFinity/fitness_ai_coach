import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { log } from './logger';

export class ApiError extends Error {
  status: number;
  code: string;
  meta?: Record<string, unknown>;
  constructor(status: number, code: string, message: string, meta?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.code = code;
    this.meta = meta;
  }
}

export const errors = {
  badRequest: (msg = 'Bad request', meta?: Record<string, unknown>) =>
    new ApiError(400, 'bad_request', msg, meta),
  unauthorized: (msg = 'Not authenticated') => new ApiError(401, 'unauthorized', msg),
  forbidden: (msg = 'Forbidden') => new ApiError(403, 'forbidden', msg),
  notFound: (msg = 'Not found') => new ApiError(404, 'not_found', msg),
  conflict: (msg = 'Conflict') => new ApiError(409, 'conflict', msg),
  rateLimited: (msg = 'Too many requests') => new ApiError(429, 'rate_limited', msg),
  internal: (msg = 'Internal server error') => new ApiError(500, 'internal', msg),
};

const isProd = process.env.NODE_ENV === 'production';

export function toResponse(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return NextResponse.json(
      { error: err.message, code: err.code, ...(err.meta ?? {}) },
      { status: err.status }
    );
  }
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: err.errors[0]?.message ?? 'Invalid input', code: 'validation_error' },
      { status: 400 }
    );
  }

  log.error('Unhandled API error', err);
  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'internal',
      // dev-only debug detail; never leak in prod
      ...(isProd
        ? {}
        : { detail: err instanceof Error ? err.message : String(err) }),
    },
    { status: 500 }
  );
}

/**
 * Wrap a Next.js route handler so thrown ApiError/ZodError become clean JSON
 * and unknown errors return 500 without leaking stack traces.
 */
export function handle<TArgs extends unknown[]>(
  handler: (...args: TArgs) => Promise<NextResponse> | NextResponse
) {
  return async (...args: TArgs): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (err) {
      return toResponse(err);
    }
  };
}
