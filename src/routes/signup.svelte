<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { createUserWithEmailAndPassword } from 'firebase/auth';

	onMount(() => {
		const user = auth.currentUser;

		if (user) goto('/', { replaceState: true });
	});

	let email = '';
	let password = '';
	let passwordConfirm = '';

	$: isValid =
		!!email.trim() && !!password.trim() && !!passwordConfirm.trim() && password === passwordConfirm;

	const signUp = async () => {
		if (!isValid) return;

		const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
	};

	const submitHandler = async () => {
		await signUp();

		goto('/');
	};
</script>

<div class="card">
	<div class="card-body">
		<h1 class="card-title">Sign Up</h1>
		<form on:submit|preventDefault={submitHandler} class="form">
			<div class="form-group">
				<label for="email">Email:</label>
				<input type="email" bind:value={email} id="email" class="form-control" />
			</div>
			<div class="form-group">
				<label for="password">Password:</label>
				<input type="password" bind:value={password} id="password" class="form-control" />
			</div>
			<div class="form-group">
				<label for="password-confirm">Confirm Password:</label>
				<input
					type="password"
					bind:value={passwordConfirm}
					id="confirm-password"
					class="form-control"
				/>
			</div>
			<button class="btn btn-primary mt-3" disabled={!isValid}>Sign up</button>
			<a href="/login" style="display: block;" class="mt-3">I already have an account</a>
		</form>
	</div>
</div>
