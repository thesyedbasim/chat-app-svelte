<script lang="ts">
	import { user } from '$lib/store/auth';

	import type { ChatRoom } from '$lib/store/chatRooms';
	import { addNewContact, contacts } from '$lib/store/contacts';
	import type { Message } from '$lib/store/messages';
	import { deleteMessage } from '$lib/store/messages';
	import Modal from '../Modal.svelte';

	export let message: Message;
	export let chatRoomId: ChatRoom['id'];

	$: isMessageByMe = message.from === $user.uid;

	const handleDeleteMessage = async () => {
		await deleteMessage(chatRoomId, message.id, message.isLive);
	};

	let isModalOpen = false;
	const openModal = () => {
		isModalOpen = true;
	};
	const closeModal = () => {
		isModalOpen = false;
	};

	let contactName: string = '';
	const handleAddNewContact = () => {
		addNewContact({ userUid: message.from, name: contactName });
		closeModal();
	};

	let isContextMenuOpen = false;
	const showContextMenu = () => {
		isContextMenuOpen = true;
	};
	const hideContextMenu = () => {
		isContextMenuOpen = false;
	};
</script>

<div class="card mt-3" on:mouseenter={showContextMenu} on:mouseleave={hideContextMenu}>
	<div class="card-header d-flex justify-content-between">
		{#if isMessageByMe}
			Me
		{:else}
			<a href={`/contacts/${message.from}`}>{$contacts[message.from]?.name || 'Unknown'}</a>
		{/if}
		<div class="context-menu">
			<button class="btn btn-primary btn-sm" style="visibility: hidden;" id="height-fixer"
				>&nbsp;</button
			>
			{#if isContextMenuOpen}
				{#if !isMessageByMe && !isModalOpen && !$contacts[message.from]}
					<button class="btn btn-secondary btn-outline" on:click={openModal}>Add to contact</button>
				{/if}
				{#if message.from === $user.uid}
					<button class="btn btn-danger btn-sm" on:click={handleDeleteMessage}>Delete</button>
				{/if}
			{/if}
		</div>
		{#if isModalOpen}
			<form class="form" on:submit|preventDefault={handleAddNewContact}>
				<input
					type="text"
					class="form-control"
					bind:value={contactName}
					placeholder="Contact name"
				/>
				<button class="btn btn-primary">Add to contact</button>
			</form>
		{/if}
	</div>
	<div class={`card-body ${message.isLocal ? 'text-secondary' : ''}`}>{message.content}</div>
</div>
