import { db, wrappedHttpsCallable } from "utils/firebase";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

import { User } from "models/User";

const updateUserFunction = wrappedHttpsCallable('updateUser');
const registerUserFunction = wrappedHttpsCallable('registerUser');

const registerUser = async ({ email, password, userId, authMethod }: {
    email: string,
    password?: string,
    userId?: string,
    authMethod: 'email'|'google'
}) => {
    email = email.toLowerCase().trim();
    await registerUserFunction({ email, password, userId, authMethod });
};

const updateUser = async ({
    details,
}: {
    details: User;
}) => {
    await updateUserFunction({
        name: details.name,
        username: details.username,
        birthYear: details.birthYear,
        isOnboarded: details.isOnboarded,
    });
};

const getUser = async (uid: string): Promise<User> => {
    try {
        const userRef = doc(db, "user", uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) return null;
        return docSnap.data() as User;
    } catch (err) {
        console.error(err);
        throw new Error("Not allowed");
    }
};

const doesUserExist = async (email: string): Promise<boolean> => {
    email = email.toLowerCase().trim();
    try {
        return !(await getDocs(query(collection(db, 'user'), where('email', '==', email)))).empty;
    } catch (err) {
        console.error(err);
        return false;
    }
};

const isUserOnboarded = async (userId: string) => {
    try {
        const userRef = doc(db, "user", userId);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) return false;
        return docSnap.get('isOnboarded') ?? false;
    } catch (err) {
        console.error(err);
        throw new Error("Not allowed");
    }
};

export { registerUser, updateUser, getUser, isUserOnboarded, doesUserExist };
