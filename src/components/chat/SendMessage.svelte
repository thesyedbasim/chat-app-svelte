<script lang="ts">
	import { user } from '$lib/store/auth';
	import { postMessage, scrollToEnd } from '$lib/store/messages';
	import { page } from '$app/stores';

	const { id: chatRoomId } = $page.params;

	let msgContent = '';

	const handleSendMessage = async () => {
		if (!$user) return;

		const msgToSend = msgContent.trim();
		msgContent = '';

		await postMessage({ content: msgToSend, from: $user.uid, chatRoomId });
	};
</script>

<form on:submit|preventDefault={handleSendMessage} style="position: fixed; bottom: 0;">
	<div class="form-row align-items-center">
		<div class="form-group col-aut0">
			<input
				type="text"
				class="form-control"
				placeholder="Send something..."
				bind:value={msgContent}
			/>
		</div>
	</div>
</form>
