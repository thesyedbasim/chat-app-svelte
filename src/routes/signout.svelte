<script lang="ts">
	import { onMount } from 'svelte';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';

	onMount(() => {
		signOut(auth);

		goto('/login', { replaceState: true });
	});
</script>
