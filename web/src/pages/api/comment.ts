import * as Sentry from '@sentry/react';
import { db } from 'utils/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { type Comment } from 'features/Post/types/Comment';

const addComment = async ({ details }: { details?: Comment }) => {
    try {
        return await addDoc(collection(db, 'comments'), {
            ...details,
            createdAt: new Date().getTime(),
        }).then((docRef) => docRef.id);
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        throw new Error('Not allowed');
    }
};

export { addComment };
