import { Hono } from 'hono';
import type { Env } from '../config/env.js';
import type { TelegramUpdate } from '@quacky/shared';

const webhook = new Hono<{ Bindings: Env }>();

/**
 * POST /webhook/telegram
 *
 * Telegram sends every user message here via webhook.
 * This is a stub — full processing logic added in Phase 2.
 *
 * Security: Telegram passes a secret token in the
 * X-Telegram-Bot-Api-Secret-Token header which we validate
 * against TELEGRAM_WEBHOOK_SECRET.
 */
webhook.post('/telegram', async (c) => {
  // ── Validate webhook secret ─────────────────────────────────────────────
  const secret = c.req.header('X-Telegram-Bot-Api-Secret-Token');
  if (secret !== c.env.TELEGRAM_WEBHOOK_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // ── Parse update ────────────────────────────────────────────────────────
  let update: TelegramUpdate;
  try {
    update = await c.req.json<TelegramUpdate>();
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }

  // ── Acknowledge immediately (Telegram requires a fast 200) ───────────────
  // Full processing (Gemini, Supabase, reply) happens in Phase 2+
  console.log(`[webhook] Received update_id=${update.update_id}`);

  return c.json({ success: true });
});

export { webhook };
