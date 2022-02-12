<script lang="ts">
	import { user } from '$lib/store/auth';

	import type { ChatRoom } from '$lib/store/chatRooms';
	import type { Message } from '$lib/store/messages';
	import { deleteMessage } from '$lib/store/messages';

	export let message: Message;
	export let chatRoomId: ChatRoom['id'];

	const handleDeleteMessage = async () => {
		deleteMessage(chatRoomId, message.id);
	};
</script>

<div class="card mt-3">
	<div class="card-header">by: {message.from}</div>
	<div class={`card-body ${message.isLocal ? 'text-secondary' : ''}`}>{message.content}</div>
	<div class="card-footer">
		{#if message.from === $user.uid}
			<button class="btn btn-danger" on:click={handleDeleteMessage}>Delete</button>
		{/if}
	</div>
</div>
