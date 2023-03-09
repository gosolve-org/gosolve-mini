import { db, wrappedHttpsCallable } from "utils/firebase";
import { setDoc, doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

import { User } from "models/User";
import { ErrorWithCode } from "models/ErrorWithCode";
import { ERROR_CODES } from "constants/errorCodes";
import { WaitlistUser } from "models/WaitlistUser";

const updateUserFunction = wrappedHttpsCallable('updateUser');
const registerUserFunction = wrappedHttpsCallable('registerUser');

const registerUser = async ({ email, password, userId, authMethod }: {
	email: string,
	password?: string,
	userId?: string,
	authMethod: 'email'|'google'
}) => {
	await registerUserFunction({ email, password, userId, authMethod });
};

const updateUser = async ({
	details,
}: {
	details: User;
}) => {
	await updateUserFunction({
		name: details.name,
		username: details.username,
		birthYear: details.birthYear,
		isOnboarded: details.isOnboarded,
	});
};

const getUser = async (uid: string): Promise<User> => {
	try {
		const userRef = doc(db, "user", uid);
		const docSnap = await getDoc(userRef);

		if (!docSnap.exists()) return null;
		return docSnap.data() as User;
	} catch (err) {
		console.error(err);
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
		console.error(err);
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

export { registerUser, updateUser, getUser, isUserOnboarded, doesUserExist, getWaitlistUser };
