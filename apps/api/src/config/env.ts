/**
 * Cloudflare Worker environment bindings.
 * All secrets are set via: wrangler secret put <KEY>
 * Non-secret vars are defined in wrangler.toml [vars]
 */
export interface Env {
  // ── Secrets ───────────────────────────────────────────────────────────────
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  GEMINI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;

  // ── Vars (wrangler.toml) ──────────────────────────────────────────────────
  APP_TIMEZONE: string;
  APP_CURRENCY: string;
}
