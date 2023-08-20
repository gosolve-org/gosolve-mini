import * as Sentry from "@sentry/react";
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

import { auth, db, useDocumentOnceWithDependencies } from "utils/firebase";
import { registerUser, doesUserExist, getUser } from "pages/api/user";
import { ErrorWithCode } from "models/ErrorWithCode";
import { ERROR_CODES } from "constants/errorCodes";
import { FirebaseError } from "firebase/app";
import { AuthUser } from "models/AuthUser";
import { doc } from "firebase/firestore";

interface AuthContext {
    user: AuthUser;
    isAuthenticated: () => boolean;
    loading: boolean;
    login: (email: string, password: string, shouldValidateUser?: boolean)
        => Promise<UserCredential>;
    getGoogleCredentials: () => Promise<UserCredential>;
    setShouldRemember: (shouldRemember: boolean) => void;
    logout: () => Promise<void>;
    registerWithEmail: (email: string, password: string) => Promise<UserCredential>;
    registerWithGoogle: (credentials: UserCredential) => Promise<UserCredential>;
    hasEditorRights: () => boolean;
    doesUserExist: (email: string) => Promise<boolean>;
    setIsLoginFinished: (isLoginFinished: boolean) => void;
    isUserProfileLoading: boolean;
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
    hasEditorRights: null,
    doesUserExist: null,
    setIsLoginFinished: null,
    isUserProfileLoading: true,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<AuthUser>(null);
    const [isLoginFinished, setIsLoginFinished] = useState<boolean>(true);
    const [userProfile, isUserProfileLoading] = useDocumentOnceWithDependencies(() => doc(db, `user`, user.uid), [ user?.uid ]);

    const isAuthenticated = () => !!user && isLoginFinished;
    const hasEditorRights = () => userProfile?.id === user?.uid &&
        (userProfile?.data()?.role === "admin" || userProfile?.data()?.role === "editor");

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
                        Sentry.captureException(err);
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

    const login = async (email: string, password: string, shouldValidateUser: boolean = true): Promise<UserCredential> => {
        try
        {
            const signInPromise = signInWithEmailAndPassword(auth, email, password);
            const userExistsPromise = shouldValidateUser ? doesUserExist(email) : null;
            const [credentials, userExists] =
                await Promise.all([signInPromise, userExistsPromise]);

            if (shouldValidateUser && !userExists) {
                throw new ErrorWithCode(ERROR_CODES.notFound);
            }
    
            return credentials;
        } catch (err) {
            if (err instanceof ErrorWithCode) throw err;

            if (err instanceof FirebaseError) {
                if (err.code === 'auth/wrong-password') {
                    throw new ErrorWithCode(ERROR_CODES.wrongPassword)
                }

                if (err.code === 'auth/user-not-found') {
                    throw new ErrorWithCode(ERROR_CODES.notFound);
                }
            }

            Sentry.captureException(err);
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
                Sentry.captureException(logoutErr);
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
                getGoogleCredentials,
                setShouldRemember,
                logout,
                registerWithEmail,
                registerWithGoogle,
                hasEditorRights,
                doesUserExist,
                setIsLoginFinished,
                isUserProfileLoading,
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
