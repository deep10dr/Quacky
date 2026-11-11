// ─────────────────────────────────────────────────────────────────────────────
// App defaults
// ─────────────────────────────────────────────────────────────────────────────

export const APP_TIMEZONE = 'Asia/Kolkata' as const;
export const APP_CURRENCY = 'INR' as const;
export const DEFAULT_DAILY_WATER_GOAL_ML = 2500;

// ─────────────────────────────────────────────────────────────────────────────
// Meal
// ─────────────────────────────────────────────────────────────────────────────

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export const DEFAULT_MEAL_TIMES = {
  breakfast: '08:00',
  lunch: '13:00',
  dinner: '20:00',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Expense
// ─────────────────────────────────────────────────────────────────────────────

export const EXPENSE_CATEGORIES = [
  'food', 'transport', 'entertainment', 'health',
  'shopping', 'utilities', 'education', 'rent', 'personal', 'other',
] as const;

export const EXPENSE_CATEGORY_EMOJI: Record<string, string> = {
  food: '🍽️',
  transport: '🚗',
  entertainment: '🎬',
  health: '🏥',
  shopping: '🛍️',
  utilities: '💡',
  education: '📚',
  rent: '🏠',
  personal: '👤',
  other: '📦',
};

export const PAYMENT_METHODS = ['cash', 'upi', 'card', 'netbanking', 'other'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Activity
// ─────────────────────────────────────────────────────────────────────────────

export const ACTIVITY_CATEGORIES = [
  'personal', 'work', 'health', 'fitness', 'social', 'errand', 'other',
] as const;

export const ACTIVITY_STATUSES = ['pending', 'completed', 'skipped', 'cancelled'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Reminder
// ─────────────────────────────────────────────────────────────────────────────

export const REMINDER_TYPES = [
  'morning_briefing', 'breakfast', 'lunch', 'dinner',
  'water', 'sleep', 'evening_checkin', 'event', 'custom',
] as const;

export const REMINDER_STATUSES = ['pending', 'sent', 'failed', 'cancelled'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Sleep
// ─────────────────────────────────────────────────────────────────────────────

export const SLEEP_QUALITIES = ['poor', 'fair', 'good', 'excellent'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Event
// ─────────────────────────────────────────────────────────────────────────────

export const EVENT_TYPES = [
  'appointment', 'task', 'birthday', 'meeting', 'personal', 'other',
] as const;

export const RECURRENCE_FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Memory
// ─────────────────────────────────────────────────────────────────────────────

export const MEMORY_CATEGORIES = [
  'preference', 'routine', 'personal_info', 'health', 'goal', 'other',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Gemini function names
// ─────────────────────────────────────────────────────────────────────────────

export const GEMINI_FUNCTIONS = [
  'log_food', 'log_water', 'log_sleep', 'log_workout',
  'log_expense', 'log_activity',
  'create_event', 'create_reminder', 'update_reminder',
  'query_data', 'get_summary',
  'general_chat', 'unknown',
] as const;
