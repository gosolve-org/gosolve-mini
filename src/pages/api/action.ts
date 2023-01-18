import { db } from "utils/firebase";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";

import { Action } from "models/Action";

const addAction = async ({ details }: { details?: Action }) => {
	try {
		return await addDoc(collection(db, "actions"), {
			...details,
			createdAt: new Date().getTime(),
			updatedAt: new Date().getTime(),
		}).then((docRef) => docRef.id);
	} catch (err) {
		throw new Error("Not allowed");
	}
};

const updateAction = async ({
	docId,
	details,
}: {
	docId: string;
	details?: Action;
}) => {
	try {
		const userRef = doc(db, "actions", docId);
		const docSnap = await getDoc(userRef);

		if (docSnap.exists()) {
			await updateDoc(userRef, {
				...details,
				updatedAt: new Date().getTime(),
			});
		} else {
			await addAction({ details });
		}

		Promise.resolve();
	} catch (err) {
		throw new Error("Not allowed");
	}
};

export { addAction, updateAction };
