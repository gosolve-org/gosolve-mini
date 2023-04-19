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
    UserCredential
} from "@firebase/auth";

import { auth } from "utils/firebase";
import { registerUser, doesUserExist, getUser, getWaitlistUser, updateUser } from "pages/api/user";
import { ErrorWithCode } from "models/ErrorWithCode";
import { ERROR_CODES } from "constants/errorCodes";
import { FirebaseError } from "firebase/app";
import { AuthUser } from "models/AuthUser";

interface AuthContext {
    user: AuthUser;
    isAuthenticated: () => boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<UserCredential>;
    getGoogleCredentials: () => Promise<UserCredential>;
    setShouldRemember: (shouldRemember: boolean) => void;
    logout: () => Promise<void>;
    registerWithEmail: (email: string, password: string) => Promise<UserCredential>;
    registerWithGoogle: (credentials: UserCredential) => Promise<UserCredential>;
    validateUser: (credentials: UserCredential) => Promise<boolean>;
}

const AuthContext = createContext<AuthContext>({
    user: null,
    isAuthenticated: null,
    loading: true,
    login: null,
    getGoogleCredentials: null,
    setShouldRemember: null,
    logout: null,
    registerWithEmail: null,
    registerWithGoogle: null,
    validateUser: null,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<AuthUser>(null);

    const isAuthenticated = () => !!user;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                getUser(authUser.uid)
                    .then(user => {
                        setUser({
                            uid: authUser.uid,
                            email: authUser.email,
                            displayName: authUser.displayName,
                            photoURL: authUser.photoURL,
                            name: user?.name,
                            birthYear: user?.birthYear,
                            username: user?.username,
                        });
                    })
                    .catch(err => {
                        console.error(err);
                    }).finally(() => {
                        setLoading(false);
                    });
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const validateUser = async (credentials: UserCredential): Promise<boolean> => {
        if (!credentials.user.email) throw new Error('Could not retrieve email address.');

        return await doesUserExist(credentials.user.email);
    };

    const login = async (email: string, password: string, shouldValidateUser: boolean = true): Promise<UserCredential> => {
        try
        {
            const credentials = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            if (shouldValidateUser && !await validateUser(credentials)) {
                throw new ErrorWithCode(ERROR_CODES.notFound);
            }
    
            return credentials;
        } catch (err) {
            if ((err instanceof FirebaseError && err.code === 'auth/user-not-found')
                || (err instanceof ErrorWithCode && err.code === ERROR_CODES.notFound)) {
                    const waitlistUser = await getWaitlistUser(email);
                    if (waitlistUser?.removed_from_waitlist === false) {
                        throw new ErrorWithCode(ERROR_CODES.waitlistUserNotOffboarded);
                    } else {
                        throw new ErrorWithCode(ERROR_CODES.notFound);
                    }
            }

            if (err instanceof ErrorWithCode) throw err;

            if (err instanceof FirebaseError) {
                if (err.code === 'auth/wrong-password') {
                    throw new ErrorWithCode(ERROR_CODES.wrongPassword)
                }
            }

            console.error(err);
            throw new Error('Something went wrong');
        }
    };

    const getGoogleCredentials = async (): Promise<UserCredential> => {
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

    const registerWithGoogle = async (credentials: UserCredential): Promise<UserCredential> => {
        try {
            await registerUser({ email: credentials.user.email, authMethod: 'google', userId: credentials.user.uid });
        } catch (err) {
            try {
                await logout();
            } catch (logoutErr) {
                console.error('Could not log user out after unsuccesful Google registration.', logoutErr);
            } finally {
                throw err;
            }
        }

        return credentials;
    };

    const registerWithEmail = async (email: string, password: string): Promise<UserCredential> => {
        await registerUser({ email, password, authMethod: 'email' });
        return await login(email, password, false);
    };

    return (
        <AuthContext.Provider
            value={{
                loading,
                user,
                isAuthenticated,
                login,
                validateUser,
                getGoogleCredentials,
                setShouldRemember,
                logout,
                registerWithEmail,
                registerWithGoogle,
            }}
        >
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthContextProvider");
    }

    return context;
};
