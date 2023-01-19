import { db } from "utils/firebase";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";

import { Comment } from "models/Comment";

const addComment = async ({ details }: { details?: Comment }) => {
	try {
		return await addDoc(collection(db, "comments"), {
			...details,
			createdAt: new Date().getTime(),
		}).then((docRef) => docRef.id);
	} catch (err) {
		throw new Error("Not allowed");
	}
};

export { addComment };
