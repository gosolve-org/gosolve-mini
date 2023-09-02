import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, connectAuthEmulator } from '@firebase/auth';
import {
    connectFirestoreEmulator,
    type DocumentData,
    type DocumentReference,
    type DocumentSnapshot,
    type FirestoreError,
    getFirestore,
    type Query,
    type QuerySnapshot,
} from 'firebase/firestore';
import { useCollectionOnce, useDocumentOnce } from 'react-firebase-hooks/firestore';
import { type OnceOptions } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { getAnalytics as getFirebaseAnalytics } from 'firebase/analytics';
import { ErrorWithCode } from 'common/models/ErrorWithCode';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASURMENT_ID,
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const getAnalytics = () => getFirebaseAnalytics(app);

if (
    process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === 'true' ||
    process.env.NEXT_PUBLIC_FIREBASE_EMULATORS?.toString() === 'true'
) {
    console.log('Using Firebase Emulators');
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
}

export const useCollectionOnceWithDependencies = (
    query: (() => Query<DocumentData>) | null,
    dependencies: any[],
): [QuerySnapshot | undefined, boolean, FirestoreError | undefined, () => Promise<void>] => {
    const [collection, isLoading, err, reloadData] = useCollectionOnce(
        dependencies.every(Boolean) && query != null ? query() : null,
    );
    return [
        collection,
        isLoading ||
            dependencies.some((el) => (typeof el === 'boolean' ? !el : el == null)) ||
            collection?.docs === undefined,
        err,
        reloadData,
    ];
};

interface FirestoreDocumentHookOptions {
    onceOptions?: OnceOptions | undefined;
}
export const useDocumentOnceWithDependencies = (
    docRef: (() => DocumentReference) | null,
    dependencies: any[],
    options?: FirestoreDocumentHookOptions,
): [DocumentSnapshot | undefined, boolean, FirestoreError | undefined, () => Promise<void>] => {
    const [snapshot, isLoading, err, reloadData] = useDocumentOnce(
        dependencies.every(Boolean) && docRef != null ? docRef() : null,
        options?.onceOptions,
    );
    return [
        snapshot,
        isLoading || dependencies.some((el) => (typeof el === 'boolean' ? !el : el == null)),
        err,
        reloadData,
    ];
};

export const wrappedHttpsCallable = (functionName: string) => {
    const callable = httpsCallable(functions, functionName);
    return async (data?: unknown) => {
        const result = await callable(data);
        const resultData = result.data as any;

        if (resultData?.error != null) {
            if (resultData.error.code != null) {
                throw new ErrorWithCode(resultData.error.code);
            } else {
                console.error('Received error without code from function.', resultData.error);
                throw new Error('Something went wrong.');
            }
        }

        return resultData;
    };
};
