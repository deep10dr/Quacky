import { z } from 'zod';
import {
  MEAL_TYPES, EXPENSE_CATEGORIES, PAYMENT_METHODS, ACTIVITY_CATEGORIES,
  ACTIVITY_STATUSES, REMINDER_TYPES, SLEEP_QUALITIES, EVENT_TYPES,
  RECURRENCE_FREQUENCIES, MEMORY_CATEGORIES, GEMINI_FUNCTIONS,
} from '../constants/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────────────

export const UUIDSchema = z.string().uuid();
export const ISODateSchema = z.string().datetime({ offset: true });

// ─────────────────────────────────────────────────────────────────────────────
// Food Log
// ─────────────────────────────────────────────────────────────────────────────

export const FoodItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  calories: z.number().nonnegative().optional(),
  protein_g: z.number().nonnegative().optional(),
  carbs_g: z.number().nonnegative().optional(),
  fat_g: z.number().nonnegative().optional(),
});

export const LogFoodSchema = z.object({
  meal_type: z.enum(MEAL_TYPES),
  food_items: z.array(FoodItemSchema).min(1),
  logged_at: ISODateSchema.optional(),
  notes: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Water Log
// ─────────────────────────────────────────────────────────────────────────────

export const LogWaterSchema = z.object({
  amount_ml: z.number().positive().max(5000),
  logged_at: ISODateSchema.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Sleep Log
// ─────────────────────────────────────────────────────────────────────────────

export const LogSleepSchema = z.object({
  sleep_start: ISODateSchema,
  sleep_end: ISODateSchema.optional(),
  duration_minutes: z.number().positive().max(1440).optional(),
  quality: z.enum(SLEEP_QUALITIES).optional(),
  notes: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Workout Log
// ─────────────────────────────────────────────────────────────────────────────

export const ExerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.number().positive().optional(),
  reps: z.number().positive().optional(),
  weight_kg: z.number().nonnegative().optional(),
  duration_minutes: z.number().positive().optional(),
  notes: z.string().optional(),
});

export const LogWorkoutSchema = z.object({
  workout_type: z.string().min(1),
  exercises: z.array(ExerciseSchema).default([]),
  duration_minutes: z.number().positive().max(600).optional(),
  logged_at: ISODateSchema.optional(),
  notes: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Expense
// ─────────────────────────────────────────────────────────────────────────────

export const LogExpenseSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('INR'),
  category: z.enum(EXPENSE_CATEGORIES),
  description: z.string().optional(),
  payment_method: z.enum(PAYMENT_METHODS).optional(),
  spent_at: ISODateSchema.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Activity
// ─────────────────────────────────────────────────────────────────────────────

export const LogActivitySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(ACTIVITY_CATEGORIES).default('personal'),
  status: z.enum(ACTIVITY_STATUSES).default('completed'),
  scheduled_at: ISODateSchema.optional(),
  completed_at: ISODateSchema.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Recurrence
// ─────────────────────────────────────────────────────────────────────────────

export const RecurrenceSchema = z.object({
  frequency: z.enum(RECURRENCE_FREQUENCIES),
  interval: z.number().positive().default(1),
  end_date: z.string().optional(),
  days_of_week: z.array(z.number().min(0).max(6)).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Event
// ─────────────────────────────────────────────────────────────────────────────

export const CreateEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  event_type: z.enum(EVENT_TYPES).default('personal'),
  starts_at: ISODateSchema,
  ends_at: ISODateSchema.optional(),
  all_day: z.boolean().default(false),
  location: z.string().optional(),
  recurrence: RecurrenceSchema.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Reminder
// ─────────────────────────────────────────────────────────────────────────────

export const CreateReminderSchema = z.object({
  title: z.string().min(1),
  message: z.string().optional(),
  reminder_type: z.enum(REMINDER_TYPES).default('custom'),
  scheduled_at: ISODateSchema,
  recurrence: RecurrenceSchema.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Memory Fact
// ─────────────────────────────────────────────────────────────────────────────

export const MemoryFactSchema = z.object({
  category: z.enum(MEMORY_CATEGORIES),
  key: z.string().min(1),
  value: z.string().min(1),
  confidence: z.number().min(0).max(1).default(0.8),
  source: z.enum(['conversation', 'explicit', 'inferred']).default('conversation'),
  expires_at: ISODateSchema.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Gemini Function Call (validation layer)
// ─────────────────────────────────────────────────────────────────────────────

export const GeminiFunctionCallSchema = z.object({
  name: z.enum(GEMINI_FUNCTIONS),
  arguments: z.record(z.unknown()),
});

// ─────────────────────────────────────────────────────────────────────────────
// Exported inferred types
// ─────────────────────────────────────────────────────────────────────────────

export type LogFoodInput     = z.infer<typeof LogFoodSchema>;
export type LogWaterInput    = z.infer<typeof LogWaterSchema>;
export type LogSleepInput    = z.infer<typeof LogSleepSchema>;
export type LogWorkoutInput  = z.infer<typeof LogWorkoutSchema>;
export type LogExpenseInput  = z.infer<typeof LogExpenseSchema>;
export type LogActivityInput = z.infer<typeof LogActivitySchema>;
export type CreateEventInput    = z.infer<typeof CreateEventSchema>;
export type CreateReminderInput = z.infer<typeof CreateReminderSchema>;
export type MemoryFactInput     = z.infer<typeof MemoryFactSchema>;
