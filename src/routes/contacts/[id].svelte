<script lang="ts">
	import { page } from '$app/stores';
	import { contacts } from '$lib/store/contacts';

	const { id: contactId } = $page.params;

	const name = $contacts[contactId]?.name || 'Unknown';
</script>

<h1>{name}</h1>
