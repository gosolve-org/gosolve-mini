import { db, functions } from "utils/firebase";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";

import { Post } from "models/Post";
import { httpsCallable } from "firebase/functions";

const upsertPostFunction = httpsCallable(functions, 'upsertPost');

const addPost = async ({ details, category, location }: { details: Post, category: string, location: string }) => {
	try {
		const id = await addDoc(collection(db, "posts"), {
			...details,
			createdAt: new Date().getTime(),
			updatedAt: new Date().getTime(),
		}).then((docRef) => docRef.id);

		await upsertPostFunction({
			id,
			topicId: details.topicId,
			actionId: details.actionId,
			category,
			location,
			title: details.title,
			authorUsername: details.authorUsername,
			content: details.content,
			createdAt: details.createdAt
		});

		return id;
	} catch (err) {
		throw new Error("Not allowed");
	}
};

const updatePost = async ({
	docId,
	details,
	category,
	location
}: {
	docId: string;
	details: Post;
	category: string;
	location: string;
}) => {
	try {
		const postRef = doc(db, "posts", docId);
		const docSnap = await getDoc(postRef);

		if (docSnap.exists()) {
			await Promise.all([
				updateDoc(postRef, {
					...details,
					updatedAt: new Date().getTime(),
				}),
				upsertPostFunction({
					id: docId,
					topicId: details.topicId,
					actionId: details.actionId,
					category,
					location,
					title: details.title,
					authorUsername: details.authorUsername,
					content: details.content,
					createdAt: details.createdAt
				})
			]);
		} else {
			await addPost({ details, category, location });
		}

		Promise.resolve();
	} catch (err) {
		throw new Error("Not allowed");
	}
};

export { addPost, updatePost };
