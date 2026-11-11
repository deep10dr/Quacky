import type { Env } from './config/env.js';
import { router } from './routes/index.js';

/**
 * Quacky API – Cloudflare Worker Entry Point
 *
 * Two handlers:
 *  1. fetch   – handles HTTP requests (Telegram webhook, dashboard API)
 *  2. scheduled – handles Cron Triggers (reminder scheduler)
 */
export default {
  /**
   * HTTP handler — routes all incoming requests through Hono.
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return router.fetch(request, env, ctx);
  },

  /**
   * Cron handler — runs every minute (defined in wrangler.toml).
   * Phase 6 will add the full reminder scheduling logic here.
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(handleScheduled(event, env));
  },
};

async function handleScheduled(event: ScheduledEvent, env: Env): Promise<void> {
  console.log(`[scheduler] Cron triggered at ${new Date(event.scheduledTime).toISOString()}`);
  // TODO Phase 6: query pending reminders from Supabase and dispatch via Telegram
}
