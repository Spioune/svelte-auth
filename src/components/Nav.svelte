<script>
	import { session } from '$app/stores'
	const user = $session && $session.user
</script>

<nav class="flex items-center justify-between max-w-4xl mx-auto px-8 py-4">
	<div class="flex items-center space-x-14">
		<a class="hover:bg-white hover:bg-opacity-20 hover:text-white rounded-md px-4 py-1" href="/">Home</a>
	</div>
	<div class="flex items-center space-x-6">
		{#if user}
			<div>
				Welcome {user.given_name || user.nickname}
			</div>
			<img
				class="rounded-full w-8"
				src="https://vercel.com/api/www/avatar/iCN90wrJQWsHu06I5xtuUAsp?&s=60"
				alt="Avatar"
			/>
		{:else}
			<a rel="external" href="/api/auth/login">Login</a>
		{/if}
	</div>
</nav>

<!-- <pre>{JSON.stringify(user, null, 2)}</pre> -->
