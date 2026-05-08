// Minimal Zod -> JSON Schema -> OpenAPI 3.1 generator.
// Hand-curated route list. Add entries as you stabilise endpoints.
// Replace with zod-to-openapi if the spec grows complex.

import { ZodSchema, ZodTypeAny, z } from 'zod';
import {
  loginSchema,
  registerSchema,
  workoutSessionSchema,
} from './validation';

type JsonSchema = Record<string, unknown>;

function zodToJson(schema: ZodTypeAny): JsonSchema {
  // Unwrap optionals, defaults, nullables
  const def: any = (schema as any)._def;
  switch (def?.typeName) {
    case 'ZodObject': {
      const shape = (schema as any).shape as Record<string, ZodTypeAny>;
      const properties: Record<string, JsonSchema> = {};
      const required: string[] = [];
      for (const [k, v] of Object.entries(shape)) {
        properties[k] = zodToJson(v);
        if (!(v as any).isOptional?.()) required.push(k);
      }
      return { type: 'object', properties, ...(required.length ? { required } : {}) };
    }
    case 'ZodString': {
      const out: JsonSchema = { type: 'string' };
      const checks = def.checks ?? [];
      for (const c of checks) {
        if (c.kind === 'email') out.format = 'email';
        if (c.kind === 'min') out.minLength = c.value;
        if (c.kind === 'max') out.maxLength = c.value;
      }
      return out;
    }
    case 'ZodNumber': {
      const out: JsonSchema = { type: 'number' };
      const checks = def.checks ?? [];
      for (const c of checks) {
        if (c.kind === 'int') out.type = 'integer';
        if (c.kind === 'min') out.minimum = c.value;
        if (c.kind === 'max') out.maximum = c.value;
      }
      return out;
    }
    case 'ZodBoolean':
      return { type: 'boolean' };
    case 'ZodEnum':
      return { type: 'string', enum: def.values };
    case 'ZodOptional':
    case 'ZodDefault':
    case 'ZodNullable':
      return zodToJson(def.innerType);
    case 'ZodArray':
      return { type: 'array', items: zodToJson(def.type) };
    default:
      return {};
  }
}

interface OpenApiOperation {
  summary: string;
  tags?: string[];
  requestBody?: ZodSchema;
  auth?: boolean;
  responses?: Record<string, { description: string }>;
}

interface RouteSpec {
  path: string;
  method: 'get' | 'post' | 'patch' | 'delete';
  op: OpenApiOperation;
}

const errorRef = { $ref: '#/components/schemas/Error' };

const ROUTES: RouteSpec[] = [
  {
    path: '/api/auth/register',
    method: 'post',
    op: {
      summary: 'Register a new user',
      tags: ['auth'],
      requestBody: registerSchema,
      responses: { '201': { description: 'Created' }, '400': { description: 'Validation' }, '409': { description: 'Email already exists' } },
    },
  },
  {
    path: '/api/auth/login',
    method: 'post',
    op: {
      summary: 'Log in',
      tags: ['auth'],
      requestBody: loginSchema,
      responses: { '200': { description: 'Logged in' }, '401': { description: 'Invalid credentials' }, '403': { description: 'Suspended' } },
    },
  },
  {
    path: '/api/auth/me',
    method: 'get',
    op: { summary: 'Current user', tags: ['auth'], auth: true, responses: { '200': { description: 'OK' } } },
  },
  {
    path: '/api/auth/verify-email',
    method: 'post',
    op: {
      summary: 'Verify email with token',
      tags: ['auth'],
      requestBody: z.object({ token: z.string() }),
      responses: { '200': { description: 'OK' }, '400': { description: 'Invalid token' } },
    },
  },
  {
    path: '/api/auth/forgot-password',
    method: 'post',
    op: {
      summary: 'Request a password reset',
      tags: ['auth'],
      requestBody: z.object({ email: z.string().email() }),
      responses: { '200': { description: 'Always 200 (no enumeration)' } },
    },
  },
  {
    path: '/api/auth/reset-password',
    method: 'post',
    op: {
      summary: 'Reset password with token',
      tags: ['auth'],
      requestBody: z.object({ token: z.string(), password: z.string().min(6) }),
      responses: { '200': { description: 'OK' }, '400': { description: 'Invalid token' } },
    },
  },
  {
    path: '/api/workout-sessions',
    method: 'post',
    op: {
      summary: 'Save a CV workout session',
      tags: ['workout'],
      auth: true,
      requestBody: workoutSessionSchema,
      responses: { '201': { description: 'Saved' }, '400': { description: 'Validation' } },
    },
  },
  {
    path: '/api/workout-sessions',
    method: 'get',
    op: { summary: 'List recent sessions', tags: ['workout'], auth: true, responses: { '200': { description: 'OK' } } },
  },
  {
    path: '/api/workout-sessions/stats',
    method: 'get',
    op: { summary: '30-day stats aggregate', tags: ['workout'], auth: true, responses: { '200': { description: 'OK' } } },
  },
  {
    path: '/api/ai/chat',
    method: 'post',
    op: {
      summary: 'AI Coach chat (Pro tier)',
      tags: ['ai'],
      auth: true,
      requestBody: z.object({ message: z.string(), conversationHistory: z.array(z.any()).optional() }),
      responses: { '200': { description: 'OK' }, '402': { description: 'Pro tier required' } },
    },
  },
  {
    path: '/api/billing/me',
    method: 'get',
    op: { summary: 'Current subscription', tags: ['billing'], auth: true, responses: { '200': { description: 'OK' } } },
  },
  {
    path: '/api/billing/checkout',
    method: 'post',
    op: { summary: 'Start Stripe checkout', tags: ['billing'], auth: true, responses: { '200': { description: 'OK' }, '503': { description: 'Billing not configured' } } },
  },
  {
    path: '/api/billing/portal',
    method: 'post',
    op: { summary: 'Open Stripe billing portal', tags: ['billing'], auth: true, responses: { '200': { description: 'OK' } } },
  },
  {
    path: '/api/coaches',
    method: 'get',
    op: { summary: 'List coaches', tags: ['coach'], auth: true, responses: { '200': { description: 'OK' } } },
  },
  {
    path: '/api/coach/requests',
    method: 'post',
    op: {
      summary: 'Request linking with a coach',
      tags: ['coach'],
      auth: true,
      requestBody: z.object({ coachId: z.string(), message: z.string().max(500).optional() }),
      responses: { '201': { description: 'Created' }, '409': { description: 'Already linked' } },
    },
  },
  {
    path: '/api/coach/requests',
    method: 'get',
    op: { summary: 'Coach: incoming requests', tags: ['coach'], auth: true, responses: { '200': { description: 'OK' } } },
  },
  {
    path: '/api/coach/clients',
    method: 'get',
    op: { summary: 'Coach: active clients', tags: ['coach'], auth: true, responses: { '200': { description: 'OK' } } },
  },
  {
    path: '/api/admin/users',
    method: 'get',
    op: { summary: 'Admin: list users', tags: ['admin'], auth: true, responses: { '200': { description: 'OK' }, '403': { description: 'Forbidden' } } },
  },
  {
    path: '/api/admin/stats',
    method: 'get',
    op: { summary: 'Admin: platform stats', tags: ['admin'], auth: true, responses: { '200': { description: 'OK' } } },
  },
];

export function buildOpenApi() {
  const paths: Record<string, Record<string, unknown>> = {};

  for (const r of ROUTES) {
    const op: Record<string, unknown> = {
      summary: r.op.summary,
      tags: r.op.tags,
      responses: {
        ...(r.op.responses ?? { '200': { description: 'OK' } }),
        '500': {
          description: 'Internal error',
          content: { 'application/json': { schema: errorRef } },
        },
      },
    };
    if (r.op.auth) op.security = [{ cookieAuth: [] }];
    if (r.op.requestBody) {
      op.requestBody = {
        required: true,
        content: { 'application/json': { schema: zodToJson(r.op.requestBody) } },
      };
    }
    paths[r.path] = { ...(paths[r.path] ?? {}), [r.method]: op };
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'Fitness AI Coach API',
      version: '1.0.0',
      description: 'Auto-generated from Zod schemas + curated route list.',
    },
    components: {
      securitySchemes: {
        cookieAuth: { type: 'apiKey', in: 'cookie', name: 'token' },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
          required: ['error'],
        },
      },
    },
    paths,
  };
}
