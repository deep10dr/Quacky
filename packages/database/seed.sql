-- =============================================================================
-- Quacky – Dev Seed Data
-- Run AFTER schema.sql in development only. Never in production.
-- =============================================================================

-- Insert a test user (Telegram ID: 123456789)
INSERT INTO users (telegram_id, username, first_name, timezone, currency)
VALUES (123456789, 'testuser', 'Test', 'Asia/Kolkata', 'INR')
ON CONFLICT (telegram_id) DO NOTHING;

-- Seed a sample food log
INSERT INTO food_logs (user_id, meal_type, food_items, logged_at)
SELECT id, 'breakfast',
  '[{"name":"Dosa","quantity":"2","calories":170}]'::jsonb,
  NOW() - INTERVAL '1 hour'
FROM users WHERE telegram_id = 123456789;

-- Seed a sample expense
INSERT INTO expenses (user_id, amount, currency, category, description, payment_method, spent_at)
SELECT id, 250.00, 'INR', 'transport', 'Auto rickshaw', 'cash', NOW() - INTERVAL '2 hours'
FROM users WHERE telegram_id = 123456789;

-- Seed a sample sleep log
INSERT INTO sleep_logs (user_id, sleep_start, sleep_end, duration_minutes, quality)
SELECT id,
  NOW() - INTERVAL '9 hours',
  NOW() - INTERVAL '1 hour',
  480,
  'good'
FROM users WHERE telegram_id = 123456789;

-- Seed a sample reminder
INSERT INTO reminders (user_id, title, reminder_type, scheduled_at, status)
SELECT id, 'Drink water 💧', 'water', NOW() + INTERVAL '2 hours', 'pending'
FROM users WHERE telegram_id = 123456789;
