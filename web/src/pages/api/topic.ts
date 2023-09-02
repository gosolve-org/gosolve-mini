import * as Sentry from '@sentry/react';
import { db } from 'utils/firebase';
import { collection, updateDoc, doc, getDoc, addDoc } from 'firebase/firestore';
import { type Topic } from 'features/Resource/Topic/types/Topic';

const addTopicHistory = async ({
    details,
    authorUsername,
}: {
    details: Topic;
    authorUsername: string;
}) => {
    try {
        return await addDoc(collection(db, 'topicHistory'), {
            ...details,
            authorUsername,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        }).then((docRef) => docRef.id);
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        throw new Error('Not allowed');
    }
};

const addTopic = async (details: Topic, authorUsername: string) => {
    try {
        const id = await addDoc(collection(db, 'topics'), {
            ...details,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        }).then((topicDoc) => topicDoc.id);

        await addTopicHistory({ details, authorUsername });

        return id;
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        throw new Error('Not allowed');
    }
};

const updateTopic = async (docId: string, details: Topic, authorUsername: string) => {
    try {
        if (!docId) {
            await addTopic(details, authorUsername);
            return docId;
        }

        const topicRef = doc(db, 'topics', docId);
        const docSnap = await getDoc(topicRef);

        if (docSnap.exists()) {
            await updateDoc(topicRef, {
                ...details,
                updatedAt: new Date().getTime(),
            });

            await addTopicHistory({ details, authorUsername });

            return docId;
        }

        return await addTopic(details, authorUsername);
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        throw new Error('Not allowed');
    }
};

export { addTopic, updateTopic };
