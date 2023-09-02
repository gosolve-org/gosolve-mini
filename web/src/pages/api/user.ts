import * as Sentry from '@sentry/react';
import { db, wrappedHttpsCallable } from 'utils/firebase';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import type UserUpdate from 'features/Auth/types/UserUpdate';
import type User from 'features/Auth/types/User';

const updateUserFunction: (details: UserUpdate) => Promise<any> =
    wrappedHttpsCallable('updateUser');
const registerUserFunction = wrappedHttpsCallable('registerUser');

const registerUser = async ({
    email,
    password,
    userId,
    authMethod,
}: {
    email: string;
    password?: string;
    userId?: string;
    authMethod: 'email' | 'google';
}) => {
    const trimmedEmail = email.toLowerCase().trim();
    await registerUserFunction({ email: trimmedEmail, password, userId, authMethod });
};

const updateUser = async (details: UserUpdate) => {
    await updateUserFunction(details);
};

const getUser = async (uid: string): Promise<User | null> => {
    try {
        const userRef = doc(db, 'user', uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) return null;
        return docSnap.data() as User;
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        throw new Error('Not allowed');
    }
};

const doesUserExist = async (email: string): Promise<boolean> => {
    const trimmedEmail = email.toLowerCase().trim();
    try {
        return !(await getDocs(query(collection(db, 'user'), where('email', '==', trimmedEmail))))
            .empty;
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        return false;
    }
};

const isUserOnboarded = async (userId: string) => {
    try {
        const userRef = doc(db, 'user', userId);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) return false;
        return docSnap.get('isOnboarded') ?? false;
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        throw new Error('Not allowed');
    }
};

export { registerUser, updateUser, getUser, isUserOnboarded, doesUserExist };
