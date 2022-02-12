import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import { auth } from '$lib/firebase';

export const user = writable<User | null>(await auth.currentUser);

export const updateUser = (updatedUser: User | null) => user.set(updatedUser);
