import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { DocumentData, FirestoreError, getFirestore, Query, QuerySnapshot } from "firebase/firestore";
import { useCollectionOnce } from "react-firebase-hooks/firestore";

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

export const useCollectionOnceWithDependencies = (
	query : Query<DocumentData>,
	dependencies: any[]):[QuerySnapshot | undefined, boolean, FirestoreError | undefined, () => Promise<void>] => {
		const [collection, isLoading, err, reloadData] = useCollectionOnce(dependencies.every(Boolean) ? query : null);
		return [collection, (isLoading || dependencies.some(el => !el) || collection?.docs === undefined), err, reloadData];
	};
