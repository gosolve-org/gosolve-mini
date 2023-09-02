import * as Sentry from '@sentry/react';
import { createContext, type ReactNode, useContext, useState, useEffect, useMemo } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    signOut,
    type UserCredential,
} from '@firebase/auth';

import { auth, db, useDocumentOnceWithDependencies } from 'utils/firebase';
import { registerUser, doesUserExist, getUser } from 'pages/api/user';
import { FirebaseError } from 'firebase/app';
import type AuthUser from 'features/Auth/types/AuthUser';
import { doc } from 'firebase/firestore';
import { ErrorWithCode } from 'common/models/ErrorWithCode';
import ERROR_CODES from 'common/constants/errorCodes';

interface AuthContext {
    user: AuthUser | null;
    isAuthenticated: () => boolean;
    loading: boolean;
    login: (
        email: string,
        password: string,
        shouldValidateUser?: boolean,
    ) => Promise<UserCredential>;
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

const AuthContext = createContext<AuthContext | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoginFinished, setIsLoginFinished] = useState<boolean>(true);
    const [userProfile, isUserProfileLoading] = useDocumentOnceWithDependencies(
        () => doc(db, `user`, (user as AuthUser).uid),
        [user?.uid],
    );

    const isAuthenticated = () => !!user && isLoginFinished;
    const hasEditorRights = () =>
        userProfile?.id === user?.uid &&
        (userProfile?.data()?.role === 'admin' || userProfile?.data()?.role === 'editor');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                if (authUser.email == null) {
                    throw new Error('User email is missing');
                }

                getUser(authUser.uid)
                    .then((newUser) => {
                        if (newUser == null) {
                            setUser(null);
                        } else {
                            setUser({
                                uid: authUser.uid,
                                email: authUser.email!,
                                displayName: authUser.displayName,
                                photoURL: authUser.photoURL,
                                name: newUser.name,
                                birthYear: newUser.birthYear,
                                username: newUser.username,
                                isOnboarded: newUser.isOnboarded ?? false,
                            });
                        }
                    })
                    .catch((err) => {
                        Sentry.captureException(err);
                        console.error(err);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const login = async (
        email: string,
        password: string,
        shouldValidateUser: boolean = true,
    ): Promise<UserCredential> => {
        try {
            const signInPromise = signInWithEmailAndPassword(auth, email, password);
            const userExistsPromise = shouldValidateUser ? doesUserExist(email) : null;
            const [credentials, userExists] = await Promise.all([signInPromise, userExistsPromise]);

            if (shouldValidateUser && !userExists) {
                throw new ErrorWithCode(ERROR_CODES.notFound);
            }

            return credentials;
        } catch (err) {
            if (err instanceof ErrorWithCode) throw err;

            if (err instanceof FirebaseError) {
                if (err.code === 'auth/wrong-password') {
                    throw new ErrorWithCode(ERROR_CODES.wrongPassword);
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
        return signInWithPopup(auth, provider);
    };

    const setShouldRemember = async (shouldRemember: boolean) => {
        if (shouldRemember) {
            await setPersistence(auth, browserLocalPersistence);
        } else {
            await setPersistence(auth, browserSessionPersistence);
        }
    };

    const logout = async () => {
        setUser(null);

        return signOut(auth);
    };

    const registerWithGoogle = async (credentials: UserCredential): Promise<UserCredential> => {
        if (credentials.user?.email == null) {
            throw new Error('Could not register user with Google. Email is missing.');
        }

        try {
            await registerUser({
                email: credentials.user.email,
                authMethod: 'google',
                userId: credentials.user.uid,
            });
        } catch (err) {
            try {
                await logout();
            } catch (logoutErr) {
                Sentry.captureException(logoutErr);
                console.error(
                    'Could not log user out after unsuccesful Google registration.',
                    logoutErr,
                );
            }

            throw err;
        }

        return credentials;
    };

    const registerWithEmail = async (email: string, password: string): Promise<UserCredential> => {
        await registerUser({ email, password, authMethod: 'email' });
        return login(email, password, false);
    };

    const providerValue = useMemo(
        () => ({
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
        }),
        [
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
        ],
    );

    return (
        <AuthContext.Provider value={providerValue}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context == null) {
        throw new Error('useAuth must be used within a AuthContextProvider');
    }

    return context;
};
