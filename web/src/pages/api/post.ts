import * as Sentry from '@sentry/react';
import { db } from 'utils/firebase';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { type Post } from 'features/Post/types/Post';

const addPost = async (details: Post) => {
    try {
        return await addDoc(collection(db, 'posts'), {
            ...details,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        }).then((docRef) => docRef.id);
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        throw new Error('Not allowed');
    }
};

const updatePost = async ({ docId, details }: { docId: string; details: Post }) => {
    try {
        const postRef = doc(db, 'posts', docId);
        const docSnap = await getDoc(postRef);

        if (docSnap.exists()) {
            await updateDoc(postRef, {
                ...details,
                updatedAt: new Date().getTime(),
            });

            return docId;
        }

        return await addPost(details);
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        throw new Error('Not allowed');
    }
};

export { addPost, updatePost };
