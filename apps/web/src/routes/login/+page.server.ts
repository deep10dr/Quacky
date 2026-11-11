import { fail, redirect } from '@sveltejs/kit';
import { DASHBOARD_USERNAME, DASHBOARD_PASSWORD, SESSION_SECRET } from '$app/env/private';
import { SESSION_COOKIE, SESSION_MAX_AGE, createSession, safeEqual } from '#lib/server/auth.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	// Already signed in? Skip the login page.
	if (locals.user) redirect(303, '/');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const username = String(form.get('username') ?? '').trim();
		const password = String(form.get('password') ?? '');

		if (!DASHBOARD_USERNAME || !DASHBOARD_PASSWORD || !SESSION_SECRET) {
			return fail(500, { username, error: 'Login is not configured on the server.' });
		}

		// Evaluate both checks so timing doesn't reveal which one failed.
		const userOk = await safeEqual(username, DASHBOARD_USERNAME);
		const passOk = await safeEqual(password, DASHBOARD_PASSWORD);
		if (!userOk || !passOk) {
			return fail(401, { username, error: 'Invalid username or password.' });
		}

		cookies.set(SESSION_COOKIE, await createSession(SESSION_SECRET), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: SESSION_MAX_AGE
		});

		redirect(303, '/');
	}
};
