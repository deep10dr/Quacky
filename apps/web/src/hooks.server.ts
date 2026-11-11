import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { DASHBOARD_USERNAME, SESSION_SECRET } from '$app/env/private';
import { SESSION_COOKIE, verifySession } from '#lib/server/auth.js';

/**
 * Runs on every request. Reads the session cookie and, if it is not valid,
 * sends the visitor to /login. Only /login itself is public.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(SESSION_COOKIE);

	const signedIn = Boolean(token && SESSION_SECRET && (await verifySession(token, SESSION_SECRET)));
	event.locals.user = signedIn ? { name: DASHBOARD_USERNAME ?? 'admin' } : null;

	if (!event.locals.user && event.url.pathname !== '/login') {
		redirect(303, '/login');
	}

	return resolve(event);
};
