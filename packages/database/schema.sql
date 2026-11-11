-- =============================================================================
-- Quacky – Full PostgreSQL Schema
-- Default timezone: Asia/Kolkata
-- Default currency: INR
-- Run this in your Supabase SQL Editor
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- USERS
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id     BIGINT UNIQUE NOT NULL,
  username        TEXT,
  first_name      TEXT,
  last_name       TEXT,
  timezone        TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  currency        TEXT NOT NULL DEFAULT 'INR',
  preferences     JSONB NOT NULL DEFAULT '{
    "notifications_enabled": true,
    "morning_briefing_time": "07:00",
    "sleep_reminder_time": "22:30",
    "water_reminder_interval": 120,
    "meal_reminder_times": {
      "breakfast": "08:00",
      "lunch": "13:00",
      "dinner": "20:00"
    }
  }'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users (telegram_id);

-- =============================================================================
-- CONVERSATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS conversations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata          JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations (user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations (last_message_at DESC);

-- =============================================================================
-- MESSAGES
-- =============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id       UUID NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
  user_id               UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  telegram_message_id   BIGINT,
  role                  TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content               TEXT NOT NULL,
  intent                TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id         ON messages (user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at      ON messages (created_at DESC);

-- =============================================================================
-- ACTIVITIES
-- =============================================================================
CREATE TABLE IF NOT EXISTS activities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL DEFAULT 'personal'
                  CHECK (category IN ('personal','work','health','fitness','social','errand','other')),
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','completed','skipped','cancelled')),
  scheduled_at  TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  metadata      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_user_id      ON activities (user_id);
CREATE INDEX IF NOT EXISTS idx_activities_scheduled_at ON activities (scheduled_at);
CREATE INDEX IF NOT EXISTS idx_activities_status       ON activities (status);

-- =============================================================================
-- FOOD LOGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS food_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  meal_type   TEXT NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  food_items  JSONB NOT NULL DEFAULT '[]'::jsonb,
  logged_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes       TEXT,
  metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_food_logs_user_id   ON food_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_food_logs_logged_at ON food_logs (logged_at DESC);

-- =============================================================================
-- WATER LOGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS water_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  amount_ml   INTEGER NOT NULL CHECK (amount_ml > 0 AND amount_ml <= 5000),
  logged_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_water_logs_user_id   ON water_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_water_logs_logged_at ON water_logs (logged_at DESC);

-- =============================================================================
-- SLEEP LOGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS sleep_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  sleep_start       TIMESTAMPTZ NOT NULL,
  sleep_end         TIMESTAMPTZ,
  duration_minutes  INTEGER CHECK (duration_minutes > 0 AND duration_minutes <= 1440),
  quality           TEXT CHECK (quality IN ('poor','fair','good','excellent')),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_id     ON sleep_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_sleep_start ON sleep_logs (sleep_start DESC);

-- =============================================================================
-- WORKOUT LOGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS workout_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  workout_type      TEXT NOT NULL,
  exercises         JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration_minutes  INTEGER CHECK (duration_minutes > 0 AND duration_minutes <= 600),
  logged_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes             TEXT,
  metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id   ON workout_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_logged_at ON workout_logs (logged_at DESC);

-- =============================================================================
-- EXPENSES
-- =============================================================================
CREATE TABLE IF NOT EXISTS expenses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  amount          NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency        TEXT NOT NULL DEFAULT 'INR',
  category        TEXT NOT NULL DEFAULT 'other'
                    CHECK (category IN ('food','transport','entertainment','health','shopping','utilities','education','rent','personal','other')),
  description     TEXT,
  payment_method  TEXT CHECK (payment_method IN ('cash','upi','card','netbanking','other')),
  spent_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id  ON expenses (user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_spent_at ON expenses (spent_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses (category);

-- =============================================================================
-- EVENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  event_type  TEXT NOT NULL DEFAULT 'personal'
                CHECK (event_type IN ('appointment','task','birthday','meeting','personal','other')),
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ,
  all_day     BOOLEAN NOT NULL DEFAULT FALSE,
  location    TEXT,
  recurrence  JSONB,
  metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_user_id   ON events (user_id);
CREATE INDEX IF NOT EXISTS idx_events_starts_at ON events (starts_at);

-- =============================================================================
-- REMINDERS
-- =============================================================================
CREATE TABLE IF NOT EXISTS reminders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  event_id        UUID REFERENCES events (id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  message         TEXT,
  reminder_type   TEXT NOT NULL DEFAULT 'custom'
                    CHECK (reminder_type IN ('morning_briefing','breakfast','lunch','dinner','water','sleep','evening_checkin','event','custom')),
  scheduled_at    TIMESTAMPTZ NOT NULL,
  recurrence      JSONB,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','sent','failed','cancelled')),
  sent_at         TIMESTAMPTZ,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_user_id      ON reminders (user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_at ON reminders (scheduled_at);
CREATE INDEX IF NOT EXISTS idx_reminders_status       ON reminders (status);
-- Composite index used by the cron scheduler hot path
CREATE INDEX IF NOT EXISTS idx_reminders_pending_schedule
  ON reminders (status, scheduled_at)
  WHERE status = 'pending';

-- =============================================================================
-- MEMORY FACTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS memory_facts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  category    TEXT NOT NULL DEFAULT 'other'
                CHECK (category IN ('preference','routine','personal_info','health','goal','other')),
  key         TEXT NOT NULL,
  value       TEXT NOT NULL,
  confidence  NUMERIC(3,2) NOT NULL DEFAULT 0.80 CHECK (confidence >= 0 AND confidence <= 1),
  source      TEXT NOT NULL DEFAULT 'conversation'
                CHECK (source IN ('conversation','explicit','inferred')),
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, key)
);

CREATE INDEX IF NOT EXISTS idx_memory_facts_user_id  ON memory_facts (user_id);
CREATE INDEX IF NOT EXISTS idx_memory_facts_category ON memory_facts (category);

-- =============================================================================
-- DAILY SUMMARIES
-- =============================================================================
CREATE TABLE IF NOT EXISTS daily_summaries (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  summary_date        DATE NOT NULL,
  activities_summary  JSONB NOT NULL DEFAULT '{}'::jsonb,
  food_summary        JSONB NOT NULL DEFAULT '{}'::jsonb,
  water_summary       JSONB NOT NULL DEFAULT '{}'::jsonb,
  sleep_summary       JSONB NOT NULL DEFAULT '{}'::jsonb,
  expense_summary     JSONB NOT NULL DEFAULT '{}'::jsonb,
  workout_summary     JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_narrative        TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, summary_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_summaries_user_id      ON daily_summaries (user_id);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_summary_date ON daily_summaries (summary_date DESC);

-- =============================================================================
-- PROCESSED UPDATES  (idempotency – prevent duplicate Telegram updates)
-- =============================================================================
CREATE TABLE IF NOT EXISTS processed_updates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id     BIGINT UNIQUE NOT NULL,
  processed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_processed_updates_update_id ON processed_updates (update_id);

-- =============================================================================
-- Auto-update `updated_at` trigger helper
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_memory_facts_updated_at
  BEFORE UPDATE ON memory_facts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
