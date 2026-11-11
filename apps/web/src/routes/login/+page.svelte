<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Sign in · Quacky</title>
</svelte:head>

<main>
	<form
		method="POST"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update();
				submitting = false;
			};
		}}
	>
		<h1>🦆 Quacky</h1>
		<p class="sub">Sign in to your dashboard</p>

		{#if form?.error}
			<p class="error" role="alert">{form.error}</p>
		{/if}

		<label>
			Username
			<input name="username" autocomplete="username" value={form?.username ?? ''} required />
		</label>

		<label>
			Password
			<input name="password" type="password" autocomplete="current-password" required />
		</label>

		<button type="submit" disabled={submitting}>
			{submitting ? 'Signing in…' : 'Sign in'}
		</button>
	</form>
</main>

<style>
	main {
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 1rem;
	}

	form {
		width: 100%;
		max-width: 22rem;
		display: grid;
		gap: 1rem;
		padding: 2rem;
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 1rem;
	}

	h1 {
		margin: 0;
		font-size: 1.75rem;
	}

	.sub {
		margin: -0.5rem 0 0;
		color: var(--muted);
	}

	label {
		display: grid;
		gap: 0.35rem;
		font-size: 0.9rem;
		font-weight: 500;
	}

	input {
		padding: 0.65rem 0.75rem;
		font: inherit;
		color: inherit;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 0.5rem;
	}

	input:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	button {
		padding: 0.7rem;
		font: inherit;
		font-weight: 600;
		color: #fff;
		background: var(--accent);
		border: 0;
		border-radius: 0.5rem;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.error {
		margin: 0;
		padding: 0.6rem 0.75rem;
		font-size: 0.9rem;
		color: #b42318;
		background: #fee4e2;
		border-radius: 0.5rem;
	}
</style>
