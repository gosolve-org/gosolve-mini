import { db } from "utils/firebase";
import { setDoc, updateDoc, doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

import { User } from "models/User";
import { ErrorWithCode } from "models/ErrorWithCode";
import { ERROR_CODES } from "constants/errorCodes";
import { WaitlistUser } from "models/WaitlistUser";

const addUser = async ({ uid, details }: { uid: string; details?: User }) => {
	try {
		await setDoc(doc(db, "user", uid), {
			...details,
			role: "user",
			createdAt: new Date().getTime(),
			updatedAt: new Date().getTime(),
		}).then(() => Promise.resolve());
	} catch (err) {
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

const getUser = async (uid: string): Promise<User> => {
	try {
		const userRef = doc(db, "user", uid);
		const docSnap = await getDoc(userRef);

		if (!docSnap.exists()) return null;
		return docSnap.data() as User;
	} catch (err) {
		throw new Error("Not allowed");
	}
};

const doesUserExist = async (email: string): Promise<boolean> => {
	try {
		return !(await getDocs(query(collection(db, 'user'), where('email', '==', email)))).empty;
	} catch (err) {
		console.error(err);
		return false;
	}
};

const isUserOnboarded = async (userId: string) => {
	try {
		const userRef = doc(db, "user", userId);
		const docSnap = await getDoc(userRef);

		if (!docSnap.exists()) return false;
		return docSnap.get('isOnboarded') ?? false;
	} catch (err) {
		throw new Error("Not allowed");
	}
};

const getWaitlistUser = async (email:string): Promise<WaitlistUser> => {
	const urlSearchParams = new URLSearchParams({
		email,
		api_key: process.env.NEXT_PUBLIC_WAITLIST_API_KEY
	});
	return await fetch("https://api.getwaitlist.com/api/v1/waiter?" + urlSearchParams, {
		method: "GET"
	})
	.then(async response => {
		if (!response.ok) {
			return await response.json()
				.then(err => {
					if (err?.error_code === 'NO_WAITER_FOUND') {
						return null;
					}

					console.error(`${response.status}: ${err?.error_string ?? err}`);
					throw new ErrorWithCode(ERROR_CODES.waitlistRequestFailed);
				});
		}

		return await response.json();
	})
	.catch(err => {
		if (err instanceof ErrorWithCode) {
			throw err;
		}

		console.error(err);
		throw new Error(`Can't connect to the internet.`);
	});
}

export { addUser, updateUser, getUser, isUserOnboarded, doesUserExist, getWaitlistUser };
