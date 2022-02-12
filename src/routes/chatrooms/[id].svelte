<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';

	import { user } from '$lib/store/auth';
	import { subscribeMessages, messages } from '$lib/store/messages';
	import { currentChatRoom } from '$lib/store/chatRooms';
	import Message from '../../components/chat/Message.svelte';
	import type { Unsubscribe } from 'firebase/auth';
	import { afterMessage } from '$lib/store/messages';

	import SendMessage from '../../components/chat/SendMessage.svelte';

	$: chatRoomId = $page.params.id;

	let unsubscribe: Unsubscribe | undefined;
	const init = async (id: string, user: typeof $user) => {
		if (!user) return;

		if ($currentChatRoom !== chatRoomId && unsubscribe) unsubscribe();

		currentChatRoom.set(chatRoomId);

		//@ts-ignore
		//await fetchMembers(id, $chatRooms[chatRoomId].members);
		unsubscribe = await subscribeMessages(id);
	};

	const handleIdChange = (id) => {
		if (!id) return;

		if (unsubscribe) unsubscribe();
	};

	$: handleIdChange(chatRoomId);
	$: init(chatRoomId, $user);

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});
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
