import { db } from "utils/firebase";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";

const addToAllowList = async (email: string) => {
	try {
		return await updateDoc(doc(db, "admin", "allowList"), {
			emails: arrayUnion(email),
		});
	} catch (err) {
		throw new Error("Not allowed");
	}
};

export { addToAllowList };
