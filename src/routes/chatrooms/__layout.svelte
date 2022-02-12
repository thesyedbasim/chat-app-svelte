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
		<div class="card">
			<div class="card-header">
				<h2>My Chat rooms</h2>
				<button class="btn btn-primary">Create</button>
			</div>
			<div class="card-body">
				{#each Object.values($chatRooms) as chatRoom}
					<a href={`/chatrooms/${chatRoom.id}`}
						><h3>
							{chatRoom.name}
						</h3></a
					>
				{/each}
			</div>
		</div>
	</div>
	<div class="col" style="position: relative; height: 85vh; overflow-y: scroll;"><slot /></div>
</div>
