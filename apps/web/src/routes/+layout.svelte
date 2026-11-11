<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(:root) {
		--bg: #f6f7f9;
		--card: #ffffff;
		--border: #e4e7ec;
		--text: #101828;
		--muted: #667085;
		--accent: #f59e0b;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--bg: #0f1115;
			--card: #181b21;
			--border: #2a2f38;
			--text: #f2f4f7;
			--muted: #98a2b3;
		}
	}

	:global(body) {
		margin: 0;
		font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
		color: var(--text);
		background: var(--bg);
	}
</style>
