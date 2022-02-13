<script lang="ts">
	import { user } from '$lib/store/auth';

	import { chatRooms, currentChatRoom, fetchChatRooms } from '$lib/store/chatRooms';
	import { subscribeMessages, unreadMessages } from '$lib/store/messages';

	const handleFetchChatRooms = async (u) => {
		if (!$user) return;

		await fetchChatRooms($user);

		// subscribe to all chatrooms
		Object.values($chatRooms).forEach(async (chatRoomItem) => {
			//await fetchMessages(chatRoomItem.id);
			await subscribeMessages(chatRoomItem.id);
		});
	};

	$: handleFetchChatRooms($user);
</script>

<div class="row">
	<div class="col-3">
		<h2>My Chat rooms</h2>
		<button class="btn btn-primary">Create</button>
		<div class="list-group mt-3">
			{#each Object.values($chatRooms) as chatRoom}
				<a
					class={`list-group-item list-group-item-action ${
						chatRoom.id === $currentChatRoom ? 'active' : ''
					}`}
					href={`/chatrooms/${chatRoom.id}`}
				>
					{chatRoom.name}
					{#if $unreadMessages[chatRoom.id] && $unreadMessages[chatRoom.id] > 0}
						<span class="badge badge-danger badge-pill">{$unreadMessages[chatRoom.id]}</span>
					{/if}
				</a>
			{/each}
		</div>
	</div>

	<div class="col" style="position: relative; height: 85vh; overflow-y: scroll;"><slot /></div>
</div>
