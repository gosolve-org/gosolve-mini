import { db } from "utils/firebase";
import { setDoc, updateDoc, doc, getDoc } from "firebase/firestore";

import { Topic } from "models/Topic";

const addTopic = async ({ uid, details }: { uid: string; details?: Topic }) => {
	try {
		await setDoc(doc(db, "topics", uid), {
			...details,
			createdAt: new Date().getTime(),
			updatedAt: new Date().getTime(),
		}).then(() => Promise.resolve());
	} catch (err) {
		throw new Error("Not allowed");
	}
};

const updateTopic = async ({
	docId,
	details,
}: {
	docId: string;
	details?: Topic;
}) => {
	try {
		const userRef = doc(db, "topics", docId);
		const docSnap = await getDoc(userRef);

		if (docSnap.exists()) {
			await updateDoc(userRef, {
				...details,
				updatedAt: new Date().getTime(),
			});
		} else {
			await addTopic({ uid: docId, details });
		}

		Promise.resolve();
	} catch (err) {
		throw new Error("Not allowed");
	}
};

export { addTopic, updateTopic };
