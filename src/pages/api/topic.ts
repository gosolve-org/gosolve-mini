import { db, functions } from "utils/firebase";
import { collection, updateDoc, doc, getDoc, addDoc } from "firebase/firestore";

import { Topic } from "models/Topic";
import { httpsCallable } from "firebase/functions";

const upsertTopicFunction = httpsCallable(functions, 'upsertTopic');

const addTopicHistory = async ({ details }: { details: Topic }) => {
	try {
		return await addDoc(collection(db, "topicHistory"), {
			...details,
			createdAt: new Date().getTime(),
			updatedAt: new Date().getTime(),
		}).then((docRef) => docRef.id);
	} catch (err) {
		throw new Error("Not allowed");
	}
};

const addTopic = async ({ details, category, location }: { details: Topic, category: string, location: string }) => {
	try {
		const id = await addDoc(collection(db, "topics"), {
			...details,
			createdAt: new Date().getTime(),
			updatedAt: new Date().getTime(),
		}).then(doc => doc.id);

		await Promise.all([
			addTopicHistory({ details }),
			upsertTopicFunction({
				id,
				category,
				location,
				content: details.content
			})
		]);

		return id;
	} catch (err) {
		throw new Error("Not allowed");
	}
};

const updateTopic = async ({
	docId,
	details,
	category,
	location
}: {
	docId: string;
	details: Topic;
	category: string;
	location: string;
}) => {
	try {
		if (!docId) await addTopic({ details, category, location });
		else {
			const topicRef = doc(db, "topics", docId);
			const docSnap = await getDoc(topicRef);

			if (docSnap.exists()) {
				await updateDoc(topicRef, {
					...details,
					updatedAt: new Date().getTime(),
				});

				await Promise.all([
					addTopicHistory({ details }),
					upsertTopicFunction({
						id: docId,
						category,
						location,
						content: details.content
					})
				]);
			} else {
				await addTopic({ details, category, location });
			}
		}

		Promise.resolve();
	} catch (err) {
		throw new Error("Not allowed");
	}
};

export { addTopic, updateTopic };
