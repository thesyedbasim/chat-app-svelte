import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import { browser } from '$app/env';

export interface Contact {
	userUid: User['uid'];
	name: string;
}

const contactsLocalStorage = browser ? JSON.parse(localStorage.getItem('contacts')) || {} : {};

const getAllContactsFromLocalStorage = () => {
	return contactsLocalStorage;
};

const addContactToLocalStorage = (contactInfo: Contact) => {
	contactsLocalStorage[contactInfo.userUid] = contactInfo;

	if (browser) localStorage.setItem('contacts', JSON.stringify(contactsLocalStorage));
};

export const contacts = writable<{ [key: Contact['userUid']]: Contact }>(
	getAllContactsFromLocalStorage() || {}
);

export const addNewContact = (contactInfo: Contact) => {
	contacts.update((value) => {
		value[contactInfo.userUid] = contactInfo;

		return value;
	});

	addContactToLocalStorage(contactInfo);
};
