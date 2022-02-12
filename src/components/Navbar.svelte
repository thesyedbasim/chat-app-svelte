<script lang="ts">
	import { user } from '$lib/store/auth';
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
	<div class="container-fluid">
		<a class="navbar-brand" href="#">Navbar</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNav"
			aria-controls="navbarNav"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav">
				{#if $user}
					<li class="nav-item">
						<a class="nav-link" href="/signout">Sign out</a>
					</li>
				{:else}
					<li class="nav-item">
						<a class="nav-link" href="/signup">Sign up</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/login">Login</a>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</nav>
