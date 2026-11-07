import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from '../config/env.js';
import { health } from './health.js';
import { webhook } from './webhook.js';

const router = new Hono<{ Bindings: Env }>();

// ── CORS (allow SvelteKit dashboard) ────────────────────────────────────────
router.use('*', cors({
  origin: ['http://localhost:5173', 'https://quacky.pages.dev'],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// ── Routes ───────────────────────────────────────────────────────────────────
router.route('/health', health);
router.route('/webhook', webhook);

// ── 404 fallback ─────────────────────────────────────────────────────────────
router.notFound((c) => c.json({ error: 'Not found' }, 404));

export { router };
