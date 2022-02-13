<script lang="ts">
	import { user } from '$lib/store/auth';
	import { postMessage } from '$lib/store/messages';
	import { page } from '$app/stores';

	const { id: chatRoomId } = $page.params;

	let msgContent = '';
	$: isValid = msgContent.trim();

	const handleSendMessage = async () => {
		if (!$user) return;

		if (!isValid) return;

		const msgToSend = msgContent.trim();
		msgContent = '';

		await postMessage({ content: msgToSend, from: $user.uid, chatRoomId });
	};
</script>

<div class="mt-3">
	<form
		on:submit|preventDefault={handleSendMessage}
		class="w-100 pr-3"
		style="position: fixed; bottom: 0;"
	>
		<input
			type="text"
			class="form-control w-100"
			placeholder="Send something..."
			bind:value={msgContent}
		/>
	</form>
</div>
