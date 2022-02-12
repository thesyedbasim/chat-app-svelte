import { writable } from 'svelte/store';

import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from '$lib/firebase';

export interface Member {
	id: User['uid'];
	email: User['email'];
	name: User['displayName'];
}

export interface ChatRoom {
	id: string;
	name: string;
	members?: Member[];
}

// ChatRooms
export const chatRooms = writable<{ [key: ChatRoom['id']]: ChatRoom }>({});
export const currentChatRoom = writable<ChatRoom['id']>();

export const fetchChatRooms = async (user: User) => {
	let shouldFetch = false;

	chatRooms.subscribe((value) => {
		if (Object.keys(value).length === 0) shouldFetch = true;
	});

	if (!shouldFetch) return;

	const chatRoomsRef = collection(db, 'chatRooms');
	const q = query(chatRoomsRef, where('members', 'array-contains', user.uid));

	const querySnapshot = await getDocs(q);

	querySnapshot.forEach(async (chatRoomData) => {
		const chatRoom: ChatRoom = {
			id: chatRoomData.id,
			...(chatRoomData.data() as Omit<ChatRoom, 'id'>)
		};

		chatRooms.update((value) => {
			value[chatRoom.id] = chatRoom;

			return value;
		});
	});
};

// Members
export const members = writable<Member[]>([]);

export const clearMembers = () => members.set([]);

export const fetchMembers = async (chatRoomId: ChatRoom['id'], memberIds: Member['id'][]) => {
	memberIds.forEach(async (memberId) => {
		const userRef = doc(db, `users/${memberId}`);
		const userData = await getDoc(userRef);

		const member: Member = { id: userData.id, ...(userData.data() as Omit<Member, 'id'>) };

		chatRooms.update((value) => {
			value[chatRoomId].members.push(member);

			return value;
		});
	});
};
