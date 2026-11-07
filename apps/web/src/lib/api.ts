/**
 * Typed API client for the Quacky Cloudflare Worker.
 * Used by the SvelteKit dashboard to fetch and mutate data.
 */

const API_BASE = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8787';

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error: string }).error ?? 'Request failed');
  }

  return res.json() as Promise<T>;
}

// ── Health ────────────────────────────────────────────────────────────────────
export const api = {
  health: () => request<{ status: string; timestamp: string }>('/health'),

  // ── Food (Phase 5) ─────────────────────────────────────────────────────────
  food: {
    list: (params?: { date?: string; limit?: number }) =>
      request(`/api/food?${new URLSearchParams(params as Record<string, string>)}`),
    create: (body: unknown) =>
      request('/api/food', { method: 'POST', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/food/${id}`, { method: 'DELETE' }),
  },

  // ── Expenses (Phase 5) ─────────────────────────────────────────────────────
  expenses: {
    list: (params?: { month?: string; category?: string }) =>
      request(`/api/expenses?${new URLSearchParams(params as Record<string, string>)}`),
    create: (body: unknown) =>
      request('/api/expenses', { method: 'POST', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/expenses/${id}`, { method: 'DELETE' }),
  },

  // ── Sleep (Phase 7) ────────────────────────────────────────────────────────
  sleep: {
    list: (params?: { range?: string }) =>
      request(`/api/sleep?${new URLSearchParams(params as Record<string, string>)}`),
  },

  // ── Water (Phase 7) ────────────────────────────────────────────────────────
  water: {
    today: () => request('/api/water/today'),
  },

  // ── Workouts (Phase 7) ─────────────────────────────────────────────────────
  workouts: {
    list: (params?: { range?: string }) =>
      request(`/api/workouts?${new URLSearchParams(params as Record<string, string>)}`),
  },

  // ── Events (Phase 5) ──────────────────────────────────────────────────────
  events: {
    list: (params?: { from?: string; to?: string }) =>
      request(`/api/events?${new URLSearchParams(params as Record<string, string>)}`),
    create: (body: unknown) =>
      request('/api/events', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      request(`/api/events/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/events/${id}`, { method: 'DELETE' }),
  },

  // ── Reminders (Phase 6) ───────────────────────────────────────────────────
  reminders: {
    list: () => request('/api/reminders'),
    create: (body: unknown) =>
      request('/api/reminders', { method: 'POST', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/reminders/${id}`, { method: 'DELETE' }),
  },

  // ── Memory (Phase 8) ──────────────────────────────────────────────────────
  memory: {
    list: () => request('/api/memory'),
    delete: (id: string) =>
      request(`/api/memory/${id}`, { method: 'DELETE' }),
  },

  // ── Summary (Phase 8) ─────────────────────────────────────────────────────
  summary: {
    daily: (date: string) => request(`/api/summary/daily?date=${date}`),
    weekly: (from: string) => request(`/api/summary/weekly?from=${from}`),
  },
};
