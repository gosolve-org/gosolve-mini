import { db } from "utils/firebase";
import { setDoc, updateDoc, doc, getDoc } from "firebase/firestore";

import { User } from "models/User";

const addUser = async ({ uid, details }: { uid: string; details?: User }) => {
	try {
		await setDoc(doc(db, "user", uid), {
			...details,
			role: "user",
			createdAt: new Date().getTime(),
			updatedAt: new Date().getTime(),
		}).then(() => Promise.resolve());
	} catch (err) {
		throw new Error("Not allowed");
	}
};

const updateUser = async ({
	docId,
	details,
}: {
	docId: string;
	details?: User;
}) => {
	try {
		const userRef = doc(db, "user", docId);
		const docSnap = await getDoc(userRef);

		if (docSnap.exists()) {
			await updateDoc(userRef, {
				...details,
				updatedAt: new Date().getTime(),
			});
		} else {
			await addUser({ uid: docId, details });
		}

		Promise.resolve();
	} catch (err) {
		throw new Error("Not allowed");
	}
};

const getUser = async (uid: string): Promise<User> => {
	try {
		const userRef = doc(db, "user", uid);
		const docSnap = await getDoc(userRef);

		if (!docSnap.exists()) return null;
		return docSnap.data() as User;
	} catch (err) {
		throw new Error("Not allowed");
	}
};

const isUserOnboarded = async (userId: string) => {
	try {
		const userRef = doc(db, "user", userId);
		const docSnap = await getDoc(userRef);

		if (!docSnap.exists()) return false;
		return docSnap.get('isOnboarded') ?? false;
	} catch (err) {
		throw new Error("Not allowed");
	}
};

export { addUser, updateUser, getUser, isUserOnboarded };
