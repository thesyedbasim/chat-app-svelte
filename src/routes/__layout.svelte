<script>
	import Navbar from '../components/Navbar.svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { updateUser, user } from '$lib/store/auth';

	onAuthStateChanged(auth, (user) => {
		updateUser(user);
	});
</script>

<Navbar />
<div class="container-fluid">
	<slot />
</div>
