import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload, UserRole } from './auth';

type AuthedHandler = (
  request: NextRequest,
  decoded: TokenPayload,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>;

export function withAuth(handler: AuthedHandler) {
  return async (
    request: NextRequest,
    context?: { params: Record<string, string> }
  ): Promise<NextResponse> => {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return handler(request, decoded, context);
  };
}

export function withRole(roles: UserRole[], handler: AuthedHandler) {
  return withAuth(async (request, decoded, context) => {
    if (!roles.includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return handler(request, decoded, context);
  });
}
