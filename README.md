# Quacky 🦆
> Your life, one conversation at a time.

Quacky is a personal AI assistant that helps you manage daily routines, track activities, remember important things, and stay organized — all through simple Telegram conversations.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Architecture Overview](#architecture-overview)
- [Two Ways to Add Data](#two-ways-to-add-data)
- [How Gemini Picks a Function](#how-gemini-picks-a-function)
- [Message Flow](#message-flow)
- [Reminder Flow](#reminder-flow)
- [Dashboard Flow](#dashboard-flow)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Setup Guide](#setup-guide)

---

## How It Works

You talk to Quacky on **Telegram** like a friend. Quacky reads your message, understands what you mean, saves the information, and replies naturally.

```
You → "I had two dosas for breakfast"
Quacky → "Noted! Logged 2 dosas for breakfast 🍽️ That's roughly 170 calories."

You → "I spent 250 rupees on an auto"
Quacky → "Got it! ₹250 added under Transport 🚗"

You → "Remind me to drink water every 2 hours"
Quacky → "Done! I'll nudge you every 2 hours 💧"
```

No forms. No apps to open. Just talk.

---

## Architecture Overview

Quacky has three main parts that work together:

```
┌─────────────────────────────────────────────────────────────────┐
│                        YOUR PHONE                               │
│                    Telegram App                                 │
│              (send messages / get replies)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │  HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CLOUDFLARE WORKER                              │
│                   apps/api (Hono)                               │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │  Telegram   │  │    Gemini    │  │      Supabase       │   │
│  │  Webhook    │→ │  AI Engine   │→ │   (PostgreSQL DB)   │   │
│  │  Handler    │  │  (Intent +   │  │  Save & Query Data  │   │
│  └─────────────┘  │   Extract)   │  └─────────────────────┘   │
│                   └──────────────┘                              │
│                                                                 │
│  ┌────────────────────────────────────────────┐               │
│  │  Cron Scheduler (runs every minute)        │               │
│  │  Checks reminders → sends Telegram alerts  │               │
│  └────────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SVELTEKIT DASHBOARD                           │
│                   apps/web (browser)                            │
│      View charts, history, summaries — read-only UI            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Two Ways to Add Data

Quacky has **two entry points** for creating or managing data. Both go through the same Worker and database — but they serve different purposes.

```
┌─────────────────────────────┐       ┌──────────────────────────────┐
│      TELEGRAM BOT 🤖        │       │    SVELTEKIT DASHBOARD 🖥️    │
│                             │       │                              │
│  Quick, conversational      │       │  Detailed, structured forms  │
│  Natural language input     │       │  Rich UI with pickers        │
│  On the go                  │       │  View charts & reports       │
│                             │       │  Bulk edits                  │
│  "Add meeting tomorrow 3pm" │       │  Full calendar view          │
│  "Spent 200 on food"        │       │  Monthly expense breakdown   │
│  "I slept at 11"            │       │  Progress bar charts         │
└────────────┬────────────────┘       └──────────────┬───────────────┘
             │                                        │
             │  Telegram Webhook                      │  REST API call
             │  POST /webhook/telegram                │  POST /api/events
             ▼                                        ▼
        ┌────────────────────────────────────────────────┐
        │             CLOUDFLARE WORKER                  │
        │         Same business logic for both           │
        └────────────────────────┬───────────────────────┘
                                 │
                                 ▼
                          SUPABASE DB
```

### Bot Path — Natural Language
You type freely. Gemini reads it, extracts the data, and calls the right function.
- ✅ Fast and conversational
- ✅ Works anywhere Telegram works
- ✅ No manual form filling
- ❌ Less precise (AI interprets your words)

### Dashboard Path — Structured UI
You fill in a form or interact with a UI component (date picker, category dropdown, etc.).
- ✅ Full control over every field
- ✅ Rich editing (edit past entries, bulk delete)
- ✅ Visual feedback (charts, summaries, monthly reports)
- ✅ No ambiguity — what you fill is what gets saved
- ❌ Requires opening a browser

### What the Dashboard Shows (that the bot cannot)

| Dashboard Feature | Description |
|---|---|
| 📊 Bar Charts | Daily/weekly calorie intake, water intake, expense by category |
| 📈 Progress Rings | Daily water goal, activity completion |
| 📅 Calendar View | All events and reminders in a visual calendar |
| 🗂️ Monthly Reports | Expense totals, sleep averages, workout frequency |
| ✏️ Edit Past Entries | Correct a wrong food log or expense from last week |
| 🔍 Filter & Search | Search through all your logged data |
| 🧠 Memory Manager | View and delete what Quacky remembers about you |

---

## How Gemini Picks a Function

This is the core AI mechanism — called **Gemini Function Calling** (Tool Use).

Instead of asking Gemini to return free text, we give Gemini a **list of tools (functions)** it can choose from. Gemini reads your message and returns:
1. **Which function to call**
2. **What arguments to pass**

Your Worker then executes that function. Gemini never touches the database directly.

### Step-by-Step Example

```
You say: "Remind me to call mom tomorrow at 5 PM"
```

**Step 1 — Worker sends this to Gemini WITH a tools list:**
```json
{
  "message": "Remind me to call mom tomorrow at 5 PM",
  "tools": [
    { "name": "log_food",       "description": "Log a meal" },
    { "name": "log_expense",    "description": "Record an expense" },
    { "name": "log_sleep",      "description": "Record sleep" },
    { "name": "log_workout",    "description": "Record a workout" },
    { "name": "log_water",      "description": "Record water intake" },
    { "name": "create_reminder","description": "Create a reminder" },
    { "name": "create_event",   "description": "Create a calendar event" },
    { "name": "query_data",     "description": "Fetch data to answer a question" },
    { "name": "general_chat",   "description": "Just have a conversation" }
  ]
}
```

**Step 2 — Gemini returns a function call (NOT free text):**
```json
{
  "function_call": {
    "name": "create_reminder",
    "arguments": {
      "title": "Call mom",
      "scheduled_at": "2024-01-15T17:00:00+05:30",
      "reminder_type": "custom",
      "recurrence": null
    }
  }
}
```

**Step 3 — Worker validates the arguments (Zod schema check):**
```typescript
// Never trust AI output blindly!
const parsed = CreateReminderSchema.safeParse(functionCall.arguments);
if (!parsed.success) {
  // Ask user to clarify or use fallback
}
```

**Step 4 — Worker executes the function:**
```typescript
// repositories/reminderRepository.ts
await db.insert('reminders', {
  user_id: user.id,
  title: 'Call mom',
  scheduled_at: '2024-01-15T17:00:00+05:30',
  status: 'pending'
});
```

**Step 5 — Worker sends result back to Gemini for a friendly reply:**
```json
{
  "function_result": { "success": true, "reminder_id": "abc-123" }
}
```
Gemini replies: *"Done! I'll remind you to call mom tomorrow at 5 PM 📞"*

**Step 6 — That reply goes back to you on Telegram ✅**

---

### Full Function List

| Function | Triggered by |
|---|---|
| `log_food` | "I had dosa for breakfast", "ate rice and dal for lunch" |
| `log_water` | "drank 2 glasses of water", "had 500ml water" |
| `log_sleep` | "slept at 11, woke at 7", "slept for 6 hours" |
| `log_workout` | "did 30 min gym", "went for a run" |
| `log_expense` | "spent 200 on food", "paid 500 for groceries" |
| `log_activity` | "finished reading", "completed my morning walk" |
| `create_event` | "I have a meeting on Friday 3pm" |
| `create_reminder` | "remind me to call mom at 5pm" |
| `update_reminder` | "change my water reminder to every 3 hours" |
| `query_data` | "what did I eat today?", "how much did I spend?" |
| `get_summary` | "give me today's summary", "how was my week?" |
| `general_chat` | "how are you?", "tell me a joke" |

---

### How Gemini Handles Ambiguity

```
You: "I had water"

Gemini is unsure — could be log_water or general_chat.
Confidence is low, so Quacky asks:
→ "How much water did you have? 💧"

You: "2 glasses"
→ log_water called with { amount_ml: 500 }
→ "Done! 500ml logged 💧 You've had 1.5L today."
```

```
You: "Done with gym"

Gemini picks log_workout but is missing details:
→ "Great! 💪 What did you work on today and for how long?"

You: "chest and arms, 45 minutes"
→ log_workout called with { exercises: ["chest", "arms"], duration: 45 }
```

---

## Message Flow

This is exactly what happens every time you send a message to Quacky on Telegram:

```
Step 1 — You send a message on Telegram
         "I slept at 11 PM and woke up at 6 AM"
                        │
                        ▼
Step 2 — Telegram sends it to Cloudflare Worker
         POST https://quacky-api.workers.dev/webhook/telegram
         (Telegram calls this URL automatically — called a "webhook")
                        │
                        ▼
Step 3 — Worker checks for duplicates
         (prevents processing the same message twice)
                        │
                        ▼
Step 4 — Worker sends message to Google Gemini
         Gemini reads the message and returns structured JSON:
         {
           intent: "log_sleep",
           entities: {
             sleep_start: "2024-01-01T23:00:00+05:30",
             sleep_end:   "2024-01-02T06:00:00+05:30",
             duration_minutes: 420
           },
           response_text: "Great! 7 hours of sleep logged 😴"
         }
                        │
                        ▼
Step 5 — Worker VALIDATES the extracted data
         (never trust AI output blindly — check types, ranges, logic)
                        │
                        ▼
Step 6 — Worker saves to Supabase (PostgreSQL)
         INSERT INTO sleep_logs (user_id, sleep_start, sleep_end, ...)
                        │
                        ▼
Step 7 — Worker sends Gemini's friendly response back to Telegram
         "Great! 7 hours of sleep logged 😴 You slept at 11 PM and woke at 6 AM."
                        │
                        ▼
Step 8 — You see the reply on Telegram ✅
```

---

## Reminder Flow

Quacky proactively sends you reminders using Cloudflare Cron Triggers:

```
Every minute — Cloudflare automatically wakes up the Worker
                        │
                        ▼
Scheduler queries Supabase:
  SELECT * FROM reminders
  WHERE status = 'pending'
  AND scheduled_at <= NOW()
                        │
                        ▼
For each due reminder:
  → Send Telegram message to user
  → Mark reminder as 'sent' in Supabase
  → If recurring, schedule next occurrence
```

**Reminder types Quacky sends automatically:**

| Time | Reminder |
|------|----------|
| Morning (configurable) | Good morning briefing — today's events, tasks, weather mood |
| 8:00 AM | Breakfast reminder (if not logged) |
| 1:00 PM | Lunch reminder (if not logged) |
| 8:00 PM | Dinner reminder + evening check-in |
| Every 2 hrs | Water intake nudge |
| Night (configurable) | Sleep reminder |
| Custom | Any reminder you create via chat |

---

## Dashboard Flow

The SvelteKit dashboard talks to the **same Cloudflare Worker** as the bot. It can both read and write data, but it uses structured API calls instead of natural language.

```
┌─────────────────────────────────────────────────────────────────┐
│                   SVELTEKIT DASHBOARD                           │
│                                                                 │
│  Read:   GET  /api/food?date=today        → show food logs      │
│  Read:   GET  /api/expenses?month=nov     → bar chart           │
│  Read:   GET  /api/sleep?range=week       → sleep report        │
│  Write:  POST /api/events                 → create event form   │
│  Write:  POST /api/reminders              → reminder form       │
│  Edit:   PATCH /api/food/:id             → edit a food entry    │
│  Delete: DELETE /api/expenses/:id        → remove an expense    │
└───────────────────────────┬─────────────────────────────────────┘
                            │  REST API (JSON)
                            ▼
                   CLOUDFLARE WORKER
                            │
                            ▼
                   SUPABASE (PostgreSQL)
```

### Dashboard Pages & What They Show

| Page | Key UI Elements |
|---|---|
| **Overview** | Today's summary card, activity ring, water progress, quick stats |
| **Food Tracking** | Meal timeline, calorie bar chart, weekly nutrition summary |
| **Expenses** | Monthly total, category pie chart, transaction list, savings tracker |
| **Sleep** | Sleep duration line chart, consistency score, weekly average |
| **Fitness** | Workout calendar, exercise history, weekly frequency chart |
| **Water** | Daily progress bar, hourly intake chart, goal setting |
| **Calendar** | Full month view, event details, reminder management |
| **AI Memory** | View all stored memory facts, delete unwanted memories |
| **Settings** | Timezone, notification times, meal reminder toggles, currency |

---

## Technology Stack

| Component | Technology | Why |
|---|---|---|
| **Bot Interface** | Telegram Bot API | Free, widely used, great UX |
| **Backend** | Cloudflare Workers | Free tier, globally fast, serverless |
| **HTTP Framework** | Hono | Lightweight, TypeScript-native, made for Workers |
| **AI Brain** | Google Gemini API | Natural language understanding + responses |
| **Database** | Supabase (PostgreSQL) | Free tier, real-time, great TypeScript SDK |
| **Dashboard** | SvelteKit | Fast, lightweight, TypeScript-native |
| **Language** | TypeScript | Shared types across api + web |
| **Validation** | Zod | Runtime schema validation for AI outputs |
| **Monorepo** | pnpm Workspaces | Shared packages between api and web |

---

## Project Structure

```
quacky/
│
├── apps/
│   ├── api/                    # Cloudflare Worker — the brain
│   │   └── src/
│   │       ├── index.ts        # Entry point
│   │       ├── config/         # Environment bindings
│   │       ├── routes/         # HTTP route handlers
│   │       ├── telegram/       # Telegram send/receive helpers
│   │       ├── ai/             # Gemini intent extraction
│   │       ├── services/       # Business logic (food, sleep, etc.)
│   │       ├── repositories/   # All database queries
│   │       ├── scheduler/      # Cron reminder engine
│   │       └── utils/          # Shared helpers
│   │
│   └── web/                    # SvelteKit Dashboard — the eyes
│       └── src/
│           ├── routes/         # Pages (food, sleep, expenses...)
│           └── lib/            # API client + components
│
└── packages/
    ├── shared/                 # Shared TypeScript types + Zod schemas
    │   └── src/
    │       ├── types/          # Interfaces for all entities
    │       ├── schemas/        # Zod validation schemas
    │       └── constants/      # Categories, defaults, timezone
    │
    └── database/               # PostgreSQL schema + migrations
        ├── schema.sql
        └── migrations/
```

---

## Features

### 💬 Conversational Tracking
| What you say | What Quacky logs |
|---|---|
| "I had idli sambar for breakfast" | Food log → breakfast |
| "Spent 500 on groceries" | Expense → food category |
| "Did 30 min of running" | Workout log |
| "Slept at midnight, woke at 7" | Sleep log |
| "Drank 3 glasses of water" | Water log → 750ml |
| "Remind me to call mom tomorrow 5 PM" | Reminder created |

### 📊 Smart Queries
| What you ask | What Quacky replies |
|---|---|
| "What did I eat today?" | Full food summary |
| "How much did I spend this month?" | Expense total + breakdown |
| "How was my sleep this week?" | Sleep duration chart |
| "What are my plans for tomorrow?" | Events + reminders list |
| "Am I drinking enough water?" | Water vs daily goal |

### 🔔 Proactive Reminders
- Morning briefing with the day's agenda
- Meal reminders if meals are not logged
- Water intake nudges
- Evening check-in
- Sleep reminder at night
- Custom reminders on demand

### 🧠 AI Memory
- Remembers your preferences ("I prefer not to be reminded before 9 AM")
- Stores personal facts ("I'm vegetarian", "I go to gym on weekdays")
- Uses memory to personalize responses over time

---

## Database Tables

| Table | Stores |
|---|---|
| `users` | Your profile, timezone, preferences |
| `conversations` | Chat sessions |
| `messages` | Full chat history |
| `activities` | Daily tasks and activities |
| `food_logs` | Meals and nutrition |
| `water_logs` | Water consumption |
| `sleep_logs` | Sleep start, end, duration |
| `workout_logs` | Exercise sessions |
| `expenses` | Spending records |
| `events` | Calendar events |
| `reminders` | Scheduled notifications |
| `memory_facts` | Long-term AI memory |
| `daily_summaries` | End-of-day reports |
| `processed_updates` | Prevents duplicate messages |

---

## Setup Guide

### Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)
- Cloudflare account (free)
- Supabase account (free)
- Telegram bot token (from [@BotFather](https://t.me/BotFather))
- Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install
```bash
git clone https://github.com/your-username/quacky.git
cd quacky
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in your keys in .env
```

### 3. Set Up Database
```bash
# Run schema.sql in your Supabase SQL editor
# File: packages/database/schema.sql
```

### 4. Configure Worker Secrets
```bash
cd apps/api
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put GEMINI_API_KEY
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

### 5. Run Locally
```bash
# Terminal 1 — Worker
pnpm dev:api    # http://localhost:8787

# Terminal 2 — Dashboard
pnpm dev:web    # http://localhost:5173
```

### 6. Deploy to Cloudflare
```bash
cd apps/api
wrangler deploy
# Your worker is now live at:
# https://quacky-api.<your-subdomain>.workers.dev
```

### 7. Register Telegram Webhook
```bash
# Tell Telegram to send messages to your Worker
curl "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://quacky-api.<your-subdomain>.workers.dev/webhook/telegram"
```

---

## Development Roadmap

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Project setup, monorepo, database schema | 🔲 |
| Phase 2 | Telegram bot + Cloudflare Worker integration | 🔲 |
| Phase 3 | Gemini AI intent extraction | 🔲 |
| Phase 4 | Supabase database integration | 🔲 |
| Phase 5 | Activity, food, expense tracking | 🔲 |
| Phase 6 | Reminder engine + cron scheduler | 🔲 |
| Phase 7 | Sleep, fitness, water tracking | 🔲 |
| Phase 8 | AI memory + daily summaries | 🔲 |
| Phase 9 | SvelteKit dashboard | 🔲 |
| Phase 10 | Testing, security, optimization | 🔲 |

---

> **The central idea:** Tell Quacky what happens in your life. Let Quacky remember, organize, and remind you. 🦆
