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
		console.log(err);
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

export { addUser, updateUser };
