import { defineEnvVars } from '@sveltejs/kit/env';

/** Treat an empty or missing value as "not set". */
const optional = (value: string | undefined) => value || undefined;

/**
 * Server-only environment variables (read via `$app/env/private`).
 * Optional so the app still boots without them; the login page then
 * reports "Login is not configured" instead of crashing.
 */
export const variables = defineEnvVars({
	DASHBOARD_USERNAME: { schema: optional, description: 'Admin username for the dashboard login' },
	DASHBOARD_PASSWORD: { schema: optional, description: 'Admin password for the dashboard login' },
	SESSION_SECRET: { schema: optional, description: 'Secret used to sign session cookies' }
});
