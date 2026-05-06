import 'dotenv/config';
import { createMiddleware } from 'hono/factory';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001/auth';
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3001/auth';
const UI_URL = process.env.VITE_UI_URL ?? 'http://localhost:5173';

function getLoginRedirect(): string {
  const callbackUrl = encodeURIComponent(`${UI_URL}/callback/auth`);
  return `${BETTER_AUTH_URL}/login?callbackUrl=${callbackUrl}`;
}

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
};

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized', redirect: getLoginRedirect() }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/verify-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      return c.json({ error: 'Unauthorized', redirect: getLoginRedirect() }, 401);
    }

    const data = await res.json() as { valid: boolean; user?: AuthUser };

    if (!data.valid || !data.user) {
      return c.json({ error: 'Unauthorized', redirect: getLoginRedirect() }, 401);
    }

    const userId = data.user.id || data.user.sub;
    if (!userId) {
      return c.json({ error: 'Invalid token', redirect: getLoginRedirect() }, 401);
    }

    c.set('userId', userId as string);
    c.set('user', data.user);
    await next();
  } catch {
    return c.json({ error: 'Auth service unavailable' }, 503);
  }
});

// Type augmentation for Hono context
declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
    user: AuthUser;
  }
}
