<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { signInWithEmailAndPassword } from 'firebase/auth';

	onMount(() => {
		const user = auth.currentUser;

		if (user) goto('/', { replaceState: true });
	});

	let email = '';
	let password = '';

	$: isValid = !!email.trim() && !!password.trim();

	const login = async () => {
		if (!isValid) return;

		const userCredentials = await signInWithEmailAndPassword(auth, email, password);
	};

	const submitHandler = async () => {
		await login();

		goto('/');
	};
</script>

<div class="card">
	<div class="card-body">
		<h1 class="card-title">Login</h1>
		<form on:submit|preventDefault={submitHandler} class="form">
			<div class="form-group">
				<label for="email">Email:</label>
				<input type="email" bind:value={email} id="email" class="form-control" />
			</div>
			<div class="form-group">
				<label for="password">Password:</label>
				<input type="password" bind:value={password} id="password" class="form-control" />
			</div>
			<button class="btn btn-primary mt-3" disabled={!isValid}>Login</button>
			<a href="/signup" style="display: block;" class="mt-3">Create a new accont</a>
		</form>
	</div>
</div>
