<script lang="ts">
	import { user } from '$lib/store/auth';

	import { chatRooms, fetchChatRooms } from '$lib/store/chatRooms';

	const handleFetchChatRooms = async (u) => {
		if (!$user) return;

		fetchChatRooms($user);
	};

	$: handleFetchChatRooms($user);
</script>

<div class="row">
	<div class="col-3">
		{#each Object.values($chatRooms) as chatRoom}
			<a href={`/chatrooms/${chatRoom.id}`}
				><h2>
					{chatRoom.name}
				</h2></a
			>
		{/each}
	</div>
	<div class="col" style="position: relative; height: 85vh; overflow-y: scroll;"><slot /></div>
</div>
