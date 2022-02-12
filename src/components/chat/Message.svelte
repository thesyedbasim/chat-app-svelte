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
		deleteMessage(chatRoomId, message.id);
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
</script>

<div class="card mt-3">
	<div class="card-header">
		{#if isMessageByMe}
			Me
		{:else}
			<a href={`/contacts/${message.from}`}>{$contacts[message.from]?.name || 'Unknown'}</a>
		{/if}
		{#if !isMessageByMe && !isModalOpen && !$contacts[message.from]}
			<button class="btn btn-secondary btn-outline" on:click={openModal}>Add to contact</button>
		{/if}
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
	<div class="card-footer">
		{#if message.from === $user.uid}
			<button class="btn btn-danger" on:click={handleDeleteMessage}>Delete</button>
		{/if}
	</div>
</div>
