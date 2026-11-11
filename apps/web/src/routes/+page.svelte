<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const hour = new Date().getHours();
	const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

	// Placeholder cards. Each will show live data once its API phase ships.
	const cards = [
		{ icon: '🍽️', title: 'Food today', value: '—', hint: 'Calories logged' },
		{ icon: '💧', title: 'Water today', value: '—', hint: 'Millilitres' },
		{ icon: '💸', title: 'Spent this month', value: '—', hint: 'Across all categories' },
		{ icon: '😴', title: 'Last sleep', value: '—', hint: 'Hours slept' },
		{ icon: '⏰', title: 'Reminders', value: '—', hint: 'Upcoming' },
		{ icon: '📝', title: 'Notes', value: '—', hint: 'Saved notes' }
	];
</script>

<svelte:head>
	<title>Dashboard · Quacky</title>
</svelte:head>

<header>
	<span class="brand">🦆 Quacky</span>
	<div class="right">
		<span class="status" class:online={data.apiOnline}>
			<i></i>{data.apiOnline ? 'API online' : 'API offline'}
		</span>
		<form method="POST" action="?/logout">
			<button type="submit" class="ghost">Sign out</button>
		</form>
	</div>
</header>

<main>
	<h1>{greeting}, {data.user?.name} 👋</h1>
	<p class="sub">Here's your day at a glance.</p>

	<section class="grid">
		{#each cards as card (card.title)}
			<article>
				<span class="icon">{card.icon}</span>
				<h2>{card.title}</h2>
				<p class="value">{card.value}</p>
				<p class="hint">{card.hint}</p>
			</article>
		{/each}
	</section>
</main>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.9rem 1.5rem;
		background: var(--card);
		border-bottom: 1px solid var(--border);
	}

	.brand {
		font-weight: 700;
		font-size: 1.1rem;
	}

	.right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.85rem;
		color: var(--muted);
	}

	.status i {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: #d92d20;
	}

	.status.online i {
		background: #12b76a;
	}

	.ghost {
		padding: 0.4rem 0.8rem;
		font: inherit;
		font-size: 0.85rem;
		color: inherit;
		background: transparent;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		cursor: pointer;
	}

	main {
		max-width: 60rem;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	h1 {
		margin: 0;
		font-size: 1.6rem;
	}

	.sub {
		margin: 0.25rem 0 1.5rem;
		color: var(--muted);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		gap: 1rem;
	}

	article {
		padding: 1.25rem;
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 1rem;
	}

	.icon {
		font-size: 1.5rem;
	}

	h2 {
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--muted);
	}

	.value {
		margin: 0.25rem 0;
		font-size: 1.9rem;
		font-weight: 700;
	}

	.hint {
		margin: 0;
		font-size: 0.8rem;
		color: var(--muted);
	}
</style>
