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
	deleteDoc
} from 'firebase/firestore';
import { writable } from 'svelte/store';
import type { ChatRoom } from './chatRooms';

export interface Message {
	id: string;
	content: string;
	from: User['uid'];
	timestamp: string;
	isLocal: boolean;
}

export const messages = writable<{ [key: ChatRoom['id']]: { [key: Message['id']]: Message } }>({});
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

/**
 * Subscribes and updates local messages on snapshot change
 */
export const subscribeMessages = async (chatRoomId: ChatRoom['id']): Promise<Unsubscribe> => {
	const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');

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
					...(messageData as Omit<Omit<Message, 'id'>, 'isLocal'>),
					isLocal: querySnapshot.metadata.hasPendingWrites
				};

				messages.update((value) => {
					if (!value[chatRoomId]) {
						value[chatRoomId] = { [messageRes.doc.id]: message };
					}

					value[chatRoomId][messageRes.doc.id] = message;

					scrollToEnd();

					return value;
				});
			}
		});
	});

	return unsubscribe;
};

export const deleteMessage = async (chatRoomId: ChatRoom['id'], messageId: Message['id']) => {
	const messageRef = doc(db, 'chatRooms', chatRoomId, 'messages', messageId);

	await deleteDoc(messageRef);
};
