import { Hono } from 'hono';
import type { Env } from '../config/env.js';

const health = new Hono<{ Bindings: Env }>();

health.get('/', (c) => {
  return c.json({
    success: true,
    service: 'quacky-api',
    status: 'ok',
    timestamp: new Date().toISOString(),
    timezone: c.env.APP_TIMEZONE,
  });
});

export { health };
