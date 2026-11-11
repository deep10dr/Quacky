// ─────────────────────────────────────────────────────────────────────────────
// Generic API Response Wrapper
// ─────────────────────────────────────────────────────────────────────────────

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// User
// ─────────────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  timezone: string;
  currency: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  morning_briefing_time?: string;   // HH:MM
  sleep_reminder_time?: string;     // HH:MM
  water_reminder_interval?: number; // minutes
  meal_reminder_times?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  notifications_enabled: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Conversation & Messages
// ─────────────────────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  user_id: string;
  started_at: string;
  last_message_at: string;
  metadata: Record<string, unknown>;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  telegram_message_id?: number;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Activity
// ─────────────────────────────────────────────────────────────────────────────

export type ActivityCategory = 'personal' | 'work' | 'health' | 'fitness' | 'social' | 'errand' | 'other';
export type ActivityStatus = 'pending' | 'completed' | 'skipped' | 'cancelled';

export interface Activity {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: ActivityCategory;
  status: ActivityStatus;
  scheduled_at?: string;
  completed_at?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Food Log
// ─────────────────────────────────────────────────────────────────────────────

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  name: string;
  quantity?: string;
  unit?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

export interface FoodLog {
  id: string;
  user_id: string;
  meal_type: MealType;
  food_items: FoodItem[];
  logged_at: string;
  notes?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Water Log
// ─────────────────────────────────────────────────────────────────────────────

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sleep Log
// ─────────────────────────────────────────────────────────────────────────────

export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';

export interface SleepLog {
  id: string;
  user_id: string;
  sleep_start: string;
  sleep_end?: string;
  duration_minutes?: number;
  quality?: SleepQuality;
  notes?: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Workout Log
// ─────────────────────────────────────────────────────────────────────────────

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight_kg?: number;
  duration_minutes?: number;
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_type: string;
  exercises: Exercise[];
  duration_minutes?: number;
  logged_at: string;
  notes?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Expense
// ─────────────────────────────────────────────────────────────────────────────

export type ExpenseCategory =
  | 'food' | 'transport' | 'entertainment' | 'health'
  | 'shopping' | 'utilities' | 'education' | 'rent' | 'personal' | 'other';

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'netbanking' | 'other';

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description?: string;
  payment_method?: PaymentMethod;
  spent_at: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Event
// ─────────────────────────────────────────────────────────────────────────────

export type EventType = 'appointment' | 'task' | 'birthday' | 'meeting' | 'personal' | 'other';

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  end_date?: string;
  days_of_week?: number[]; // 0=Sunday … 6=Saturday
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  event_type: EventType;
  starts_at: string;
  ends_at?: string;
  all_day: boolean;
  location?: string;
  recurrence?: RecurrenceRule;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reminder
// ─────────────────────────────────────────────────────────────────────────────

export type ReminderType =
  | 'morning_briefing' | 'breakfast' | 'lunch' | 'dinner'
  | 'water' | 'sleep' | 'evening_checkin' | 'event' | 'custom';

export type ReminderStatus = 'pending' | 'sent' | 'failed' | 'cancelled';

export interface Reminder {
  id: string;
  user_id: string;
  event_id?: string;
  title: string;
  message?: string;
  reminder_type: ReminderType;
  scheduled_at: string;
  recurrence?: RecurrenceRule;
  status: ReminderStatus;
  sent_at?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Memory Fact
// ─────────────────────────────────────────────────────────────────────────────

export type MemoryCategory = 'preference' | 'routine' | 'personal_info' | 'health' | 'goal' | 'other';

export interface MemoryFact {
  id: string;
  user_id: string;
  category: MemoryCategory;
  key: string;
  value: string;
  confidence: number; // 0.0–1.0
  source: 'conversation' | 'explicit' | 'inferred';
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Daily Summary
// ─────────────────────────────────────────────────────────────────────────────

export interface DailySummary {
  id: string;
  user_id: string;
  summary_date: string; // YYYY-MM-DD
  activities_summary: { total: number; completed: number; pending: number; skipped: number };
  food_summary: { meals_logged: MealType[]; meals_missed: MealType[]; total_calories?: number };
  water_summary: { total_ml: number; logs_count: number };
  sleep_summary: { duration_minutes?: number; quality?: SleepQuality; sleep_start?: string; sleep_end?: string };
  expense_summary: { total: number; currency: string; by_category: Partial<Record<ExpenseCategory, number>>; transactions_count: number };
  workout_summary: { worked_out: boolean; duration_minutes?: number; exercises_count?: number };
  ai_narrative?: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Processed Updates (idempotency guard)
// ─────────────────────────────────────────────────────────────────────────────

export interface ProcessedUpdate {
  id: string;
  update_id: number;
  processed_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Telegram Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  reply_to_message?: TelegramMessage;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Gemini AI Types
// ─────────────────────────────────────────────────────────────────────────────

export type GeminiIntent =
  | 'log_food' | 'log_water' | 'log_sleep' | 'log_workout'
  | 'log_expense' | 'log_activity'
  | 'create_event' | 'create_reminder' | 'update_reminder'
  | 'query_data' | 'get_summary'
  | 'general_chat' | 'unknown';

export interface GeminiFunctionCall {
  name: GeminiIntent;
  arguments: Record<string, unknown>;
}

export interface GeminiResponse {
  function_call?: GeminiFunctionCall;
  text?: string;
}
