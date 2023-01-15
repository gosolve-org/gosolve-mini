import {
	createContext,
	ReactNode,
	useContext,
	useState,
	useEffect,
} from "react";
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
import { auth } from "utils/auth/initializeApp";

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

	const login = (email: string, password: string) => {
		return signInWithEmailAndPassword(auth, email, password);
	};

	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		return await signInWithPopup(auth, provider);
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

	const register = (email: string, password: string) => {
		return createUserWithEmailAndPassword(auth, email, password);
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
