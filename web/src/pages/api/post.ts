import * as Sentry from '@sentry/react'
import { db } from "utils/firebase";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { Post } from 'features/Post/types/Post';

const addPost = async ({ details, category, location }: { details: Post, category: string, location: string }) => {
    try {
        return await addDoc(collection(db, "posts"), {
            ...details,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        }).then((docRef) => docRef.id);
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        throw new Error("Not allowed");
    }
};

const updatePost = async ({
    docId,
    details,
    category,
    location
}: {
    docId: string;
    details: Post;
    category: string;
    location: string;
}) => {
    try {
        const postRef = doc(db, "posts", docId);
        const docSnap = await getDoc(postRef);

        if (docSnap.exists()) {
            await updateDoc(postRef, {
                ...details,
                updatedAt: new Date().getTime(),
            });

            return docId;
        } else {
            return await addPost({ details, category, location });
        }
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        throw new Error("Not allowed");
    }
};

export { addPost, updatePost };
