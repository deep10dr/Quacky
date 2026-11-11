import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE } from '#lib/server/auth.js';
import { api } from '#lib/api.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// hooks.server.ts already guarantees a signed-in user here.
	let apiOnline = false;
	try {
		const health = await api.health();
		apiOnline = health.status === 'ok';
	} catch {
		apiOnline = false; // Worker not running / unreachable
	}

	return { user: locals.user, apiOnline };
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		cookies.delete(SESSION_COOKIE, { path: '/' });
		redirect(303, '/login');
	}
};
