<script lang="ts">
	import { chatRooms } from '$lib/store/chatRooms';
	import { goto } from '$app/navigation';

	const navigateChatroom = (theChatRooms: typeof $chatRooms) => {
		if (!theChatRooms) return;

		if (Object.keys(theChatRooms).length > 0) {
			goto(`/chatrooms/${$chatRooms[Object.keys($chatRooms)[0]].id}`, { replaceState: true });
		}
	};

	$: navigateChatroom($chatRooms);
</script>
