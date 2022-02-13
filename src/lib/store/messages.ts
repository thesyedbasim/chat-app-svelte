import { db } from '$lib/firebase';
import type { Unsubscribe, User } from 'firebase/auth';
import {
	addDoc,
	collection,
	serverTimestamp,
	query,
	orderBy,
	onSnapshot,
	doc,
	deleteDoc,
	limit,
	getDocs,
	where,
	Timestamp
} from 'firebase/firestore';
import { writable } from 'svelte/store';
import { user } from './auth';
import type { ChatRoom } from './chatRooms';
import { currentChatRoom } from './chatRooms';

export interface Message {
	id: string;
	content: string;
	from: User['uid'];
	timestamp: string;
	isLocal: boolean;
	isLive: boolean;
}

export const messages = writable<{ [key: ChatRoom['id']]: { [key: Message['id']]: Message } }>({});
const latestMessage = writable<Message & { chatRoomId: ChatRoom['id'] }>();

export const unreadMessages = writable<{ [key: ChatRoom['id']]: number }>({});

export const afterMessage = writable<HTMLDivElement>();

export const scrollToEnd = () => {
	afterMessage.subscribe((value) => {
		if (!value) return;

		setTimeout(() => {
			value.scrollIntoView();
		}, 0);
	});
};

export const postMessage = async ({
	content,
	from,
	chatRoomId
}: {
	content: Message['content'];
	from: User['uid'];
	chatRoomId: ChatRoom['id'];
}) => {
	const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');

	await addDoc(messagesRef, { content, from, timestamp: serverTimestamp() });
};

const NUM_OF_MESSAGES_TO_FETCH = 3;
/**
 * Fetches the last "n" messages, and updates locally
 */
export const fetchMessages = async (chatRoomId: ChatRoom['id']) => {
	const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');

	const q = query(messagesRef, limit(NUM_OF_MESSAGES_TO_FETCH), orderBy('timestamp', 'desc'));

	const messagesRes = await getDocs(q);

	messagesRes.forEach((msgRes) => {
		const message: Message = { id: msgRes.id, isLive: false, ...(msgRes.data() as Message) };

		messages.update((value) => {
			if (!value[chatRoomId]) {
				value[chatRoomId] = { [msgRes.id]: message };
			} else {
				value[chatRoomId][msgRes.id] = message;
			}

			return value;
		});
	});
};

//const curLocalTime = Timestamp.fromDate(new Date());
/**
 * Subscribes and updates local messages on snapshot change
 */
export const subscribeMessages = async (chatRoomId: ChatRoom['id']): Promise<Unsubscribe> => {
	const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');

	//const q = query(messagesRef, where('timestamp', '>', curLocalTime), orderBy('timestamp', 'asc'));
	const q = query(messagesRef, orderBy('timestamp', 'asc'));

	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		querySnapshot.docChanges().forEach((messageRes) => {
			if (messageRes.type === 'removed') {
				messages.update((value) => {
					delete value[chatRoomId][messageRes.doc.id];

					return value;
				});

				return;
			}

			const messageId = messageRes.doc.id;
			const messageData = messageRes.doc.data();

			if (messageRes.doc.exists()) {
				const message: Message = {
					id: messageId,
					isLive: true,
					...(messageData as Message),
					isLocal: querySnapshot.metadata.hasPendingWrites
				};

				messages.update((value) => {
					if (!value[chatRoomId]) {
						value[chatRoomId] = { [messageRes.doc.id]: message };
					} else {
						value[chatRoomId][messageRes.doc.id] = message;
					}

					scrollToEnd();

					return value;
				});

				if (!querySnapshot.metadata.hasPendingWrites) {
					latestMessage.set({ ...message, chatRoomId });
				}
			}
		});
	});

	return unsubscribe;
};

export const deleteMessage = async (
	chatRoomId: ChatRoom['id'],
	messageId: Message['id'],
	isLive: Message['isLive']
) => {
	const messageRef = doc(db, 'chatRooms', chatRoomId, 'messages', messageId);

	await deleteDoc(messageRef);

	if (!isLive) {
		messages.update((value) => {
			delete value[chatRoomId][messageId];

			return value;
		});
	}
};

// Update notification count of a chatroom when new message arrives
latestMessage.subscribe((value) => {
	if (!value) return;

	// return if message was sent by current user
	let isFromCurUser = false;
	user.subscribe((userValue) => {
		if (value.from === userValue?.uid) isFromCurUser = true;
	});
	if (isFromCurUser) return;

	// return if message was from current chat room
	let isFromCurChatRoom = false;
	currentChatRoom.subscribe((chatRoomValue) => {
		if (value.chatRoomId === chatRoomValue) isFromCurChatRoom = true;
	});
	if (isFromCurChatRoom) return;

	unreadMessages.update((unreadMsgsValue) => {
		if (unreadMsgsValue[value.chatRoomId] === undefined) unreadMsgsValue[value.chatRoomId] = 0;

		unreadMsgsValue[value.chatRoomId]++;

		latestMessage.set(null);

		return unreadMsgsValue;
	});
});

export const markAsRead = (chatRoomId: ChatRoom['id']) => {
	unreadMessages.update((value) => {
		value[chatRoomId] = 0;

		return value;
	});
};
