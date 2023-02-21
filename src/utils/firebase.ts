import { getApp, getApps, initializeApp } from "firebase/app";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getAuth } from "@firebase/auth";
import { DocumentData, DocumentReference, DocumentSnapshot, FirestoreError, getFirestore, Query, QuerySnapshot } from "firebase/firestore";
import { useCollectionOnce, useDocumentOnce } from "react-firebase-hooks/firestore";
import { OnceOptions } from "react-firebase-hooks/firestore/dist/firestore/types";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
if (process.env.FUNCTIONS_EMULATOR === 'true' || process.env.FUNCTIONS_EMULATOR?.toString() === 'true') {
	connectFunctionsEmulator(functions, "localhost", 5001);
}

export const useCollectionOnceWithDependencies = (
	query: () => Query<DocumentData>,
	dependencies: any[]):[QuerySnapshot | undefined, boolean, FirestoreError | undefined, () => Promise<void>] => {
		const [collection, isLoading, err, reloadData] = useCollectionOnce(dependencies.every(Boolean) && query ? query() : null);
		return [collection, (isLoading || dependencies.some(el => !el) || collection?.docs === undefined), err, reloadData];
	};

export const useDocumentOnceWithDependencies = (
	docRef: () => DocumentReference,
	dependencies: any[],
	options?: OnceOptions | undefined):[DocumentSnapshot | undefined, boolean, FirestoreError | undefined, () => Promise<void>] => {
		const [snapshot, isLoading, err, reloadData] = useDocumentOnce(dependencies.every(Boolean) && docRef ? docRef() : null, options);
		return [snapshot, (isLoading || dependencies.some(el => !el)), err, reloadData];
	};
