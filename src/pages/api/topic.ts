import { db } from "utils/firebase";
import { collection, updateDoc, doc, getDoc, addDoc } from "firebase/firestore";

import { Topic } from "models/Topic";

const addTopic = async ({ details }: { details?: Topic }) => {
	try {
		await addDoc(collection(db, "topics"), {
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
		if (!docId) await addTopic({ details });
		else {
			const userRef = doc(db, "topics", docId);
			const docSnap = await getDoc(userRef);

			if (docSnap.exists()) {
				await updateDoc(userRef, {
					...details,
					updatedAt: new Date().getTime(),
				});
			} else {
				await addTopic({ details });
			}
		}

		Promise.resolve();
	} catch (err) {
		throw new Error("Not allowed");
	}
};

export { addTopic, updateTopic };
