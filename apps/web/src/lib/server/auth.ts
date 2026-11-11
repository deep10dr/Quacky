/**
 * Minimal single-user session auth.
 *
 * The session cookie value is `<expiry-unix-seconds>.<hmac-sha256-hex>`.
 * It is signed with SESSION_SECRET, so it cannot be forged or extended
 * without the secret. Uses only Web Crypto, so it runs on Node and Workers.
 */

export const SESSION_COOKIE = 'quacky_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

const encoder = new TextEncoder();

function toHex(bytes: ArrayBuffer): string {
	return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sign(secret: string, data: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(data)));
}

async function sha256(value: string): Promise<string> {
	return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

/** Constant-time string comparison. */
function constantTimeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

/** Compare two secrets without leaking length or early-exit timing. */
export async function safeEqual(a: string, b: string): Promise<boolean> {
	return constantTimeEqual(await sha256(a), await sha256(b));
}

export async function createSession(secret: string): Promise<string> {
	const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
	return `${expires}.${await sign(secret, String(expires))}`;
}

export async function verifySession(token: string, secret: string): Promise<boolean> {
	const [expires, signature] = token.split('.');
	if (!expires || !signature) return false;
	if (!/^\d+$/.test(expires) || Number(expires) <= Math.floor(Date.now() / 1000)) return false;
	return constantTimeEqual(signature, await sign(secret, expires));
}
