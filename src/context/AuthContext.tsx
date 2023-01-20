import {
	createContext,
	ReactNode,
	useContext,
	useState,
	useEffect,
} from "react";
import { useRouter } from "next/router";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	setPersistence,
	browserLocalPersistence,
	browserSessionPersistence,
	signOut,
	UserCredential,
} from "@firebase/auth";

import { auth } from "utils/firebase";
import { updateUser } from "pages/api/user";

const AuthContext = createContext<{
	user: {
		uid: string;
		email: string | null;
		displayName: string | null;
		photoURL: string | null;
	} | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<UserCredential>;
	loginWithGoogle: () => Promise<UserCredential>;
	setShouldRemember: (shouldRemember: boolean) => void;
	logout: () => Promise<void>;
	register: (email: string, password: string) => Promise<UserCredential>;
}>({
	user: null,
	loading: true,
	login: (email: string, password: string) =>
		signInWithEmailAndPassword(auth, email, password),
	loginWithGoogle: () => signInWithPopup(auth, new GoogleAuthProvider()),
	setShouldRemember: (shouldRemember: boolean) => {},
	logout: () => Promise.resolve(),
	register: (email, password) =>
		createUserWithEmailAndPassword(auth, email, password),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [user, setUser] = useState<{
		uid: string;
		email: string | null;
		displayName: string | null;
		photoURL: string | null;
	} | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser({
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
					photoURL: user.photoURL,
				});
			} else {
				setUser(null);
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const addToWaitlist = async (email: string) => {
		await fetch("https://api.getwaitlist.com/api/v1/waiter", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
				api_key: process.env.NEXT_PUBLIC_WAITLIST_API_KEY,
			}),
		});
	};

	const validateUser = async (credentials: UserCredential) => {
		return await updateUser({
			docId: credentials.user.uid,
			details: { email: credentials.user.email || "" },
		})
			.then(() => credentials)
			.catch(() => {
				throw new Error("Not allowed");
			});
	};

	const login = async (email: string, password: string) => {
		const credentials = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);

		return await validateUser(credentials)
			.then(() => credentials)
			.catch(async () => {
				await addToWaitlist(email);
				throw new Error("Not allowed");
			});
	};

	const loginWithGoogle = async () => {
		let userEmail = "";
		const provider = new GoogleAuthProvider();
		const credentials = await signInWithPopup(auth, provider).then(
			(credentials) => {
				userEmail = credentials.user.email;
				return credentials;
			}
		);

		return await validateUser(credentials)
			.then(() => credentials)
			.catch(async () => {
				await addToWaitlist(userEmail);
				throw new Error("Not allowed");
			});
	};

	const setShouldRemember = async (setShouldRemember: boolean) => {
		setShouldRemember
			? await setPersistence(auth, browserLocalPersistence)
			: await setPersistence(auth, browserSessionPersistence);
	};

	const logout = async () => {
		setUser(null);

		return await signOut(auth);
	};

	const register = async (email: string, password: string) => {
		const credentials = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		return await validateUser(credentials)
			.then(() => credentials)
			.catch(async () => {
				await addToWaitlist(email);
				throw new Error("Not allowed");
			});
	};

	return (
		<AuthContext.Provider
			value={{
				loading,
				user,
				login,
				loginWithGoogle,
				setShouldRemember,
				logout,
				register,
			}}
		>
			{loading ? null : children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useCount must be used within a CountProvider");
	}

	return context;
};
