import 'dotenv/config';
import { createMiddleware } from 'hono/factory';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001/auth';

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
};

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('authorization');
  console.log(authHeader)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);
  console.log(token)

  try {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/verify-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    console.log(res)

    if (!res.ok) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const data = await res.json() as { valid: boolean; user?: AuthUser };

    if (!data.valid || !data.user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = data.user.id || data.user.sub;
    if (!userId) {
      return c.json({ error: 'Invalid token' }, 401);
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
