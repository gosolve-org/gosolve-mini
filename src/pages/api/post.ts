import { db } from "utils/firebase";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";

import { Post } from "models/Post";

const addPost = async ({ details }: { details?: Post }) => {
	try {
		return await addDoc(collection(db, "posts"), {
			...details,
			createdAt: new Date().getTime(),
			updatedAt: new Date().getTime(),
		}).then((docRef) => docRef.id);
	} catch (err) {
		throw new Error("Not allowed");
	}
};

const updatePost = async ({
	docId,
	details,
}: {
	docId: string;
	details?: Post;
}) => {
	try {
		const userRef = doc(db, "posts", docId);
		const docSnap = await getDoc(userRef);

		if (docSnap.exists()) {
			await updateDoc(userRef, {
				...details,
				updatedAt: new Date().getTime(),
			});
		} else {
			await addPost({ details });
		}

		Promise.resolve();
	} catch (err) {
		throw new Error("Not allowed");
	}
};

export { addPost, updatePost };
