import { db, functions } from "utils/firebase";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";

import { Action } from "models/Action";
import { httpsCallable } from "firebase/functions";

const upsertActionFunction = httpsCallable(functions, 'upsertAction');

const addAction = async ({ details, location, category }: { details: Action, location: string, category: string }) => {
	try {
		const id = await addDoc(collection(db, "actions"), {
			...details,
			createdAt: new Date().getTime(),
			updatedAt: new Date().getTime(),
		}).then((docRef) => docRef.id);

		await upsertActionFunction({
			id,
			topicId: details.topicId,
			category,
			location,
			title: details.title,
			authorUsername: details.authorUsername,
			content: details.content,
			createdAt: details.createdAt
		});

		return id;
	} catch (err) {
		console.error(err);
		throw new Error("Not allowed");
	}
};

const updateAction = async ({
	docId,
	details,
	location,
	category
}: {
	docId: string;
	details?: Action;
	location: string;
	category: string;
}) => {
	try {
		const actionRef = doc(db, "actions", docId);
		const docSnap = await getDoc(actionRef);

		if (docSnap.exists()) {
			await updateDoc(actionRef, {
				...details,
				updatedAt: new Date().getTime(),
			});

			await upsertActionFunction({
				id: docId,
				topicId: details.topicId,
				category,
				location,
				title: details.title,
				authorUsername: details.authorUsername,
				content: details.content,
				createdAt: details.createdAt
			});
		} else {
			await addAction({ details, location, category });
		}
	} catch (err) {
		console.error(err);
		throw new Error("Not allowed");
	}
};

export { addAction, updateAction };
