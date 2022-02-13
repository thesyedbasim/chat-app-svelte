<script lang="ts">
	import { page } from '$app/stores';

	import { user } from '$lib/store/auth';
	import { messages, markAsRead } from '$lib/store/messages';
	import { currentChatRoom } from '$lib/store/chatRooms';
	import Message from '../../components/chat/Message.svelte';
	import { afterMessage } from '$lib/store/messages';

	import SendMessage from '../../components/chat/SendMessage.svelte';

	$: chatRoomId = $page.params.id;

	const init = async (id: string, user: typeof $user) => {
		if (!user) return;

		if (chatRoomId !== $currentChatRoom) {
			currentChatRoom.set(id);
			markAsRead($currentChatRoom);
		}
	};

	$: init(chatRoomId, $user);
</script>

<!-- {#if $messages && $messages[chatRoomId]?.members && typeof $chatRooms[chatRoomId].members[0] !== 'string'}
	{#each $chatRooms[chatRoomId].members as member}
		{#if member.id !== $user.uid}
			<p>{member.name},</p>
		{/if}
	{/each} 
{/if} -->

{#if $messages[chatRoomId]}
	{#each Object.values($messages[chatRoomId]) as message}
		<Message {message} {chatRoomId} />
	{/each}
{/if}

<div id="after-message" bind:this={$afterMessage} />

<SendMessage />
