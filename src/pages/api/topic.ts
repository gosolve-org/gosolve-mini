import * as Sentry from '@sentry/react'
import { db } from "utils/firebase";
import { collection, updateDoc, doc, getDoc, addDoc } from "firebase/firestore";
import { Topic } from "models/Topic";

const addTopicHistory = async ({ details }: { details: Topic }) => {
    try {
        return await addDoc(collection(db, "topicHistory"), {
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

const addTopic = async (details: Topic) => {
    try {
        const id = await addDoc(collection(db, "topics"), {
            ...details,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        }).then(doc => doc.id);

        await addTopicHistory({ details });

        return id;
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        throw new Error("Not allowed");
    }
};

const updateTopic = async (docId: string, details: Topic) => {
    try {
        if (!docId) await addTopic(details);
        else {
            const topicRef = doc(db, "topics", docId);
            const docSnap = await getDoc(topicRef);

            if (docSnap.exists()) {
                await updateDoc(topicRef, {
                    ...details,
                    updatedAt: new Date().getTime(),
                });

                await addTopicHistory({ details });

                return docId;
            } else {
                return await addTopic(details);
            }
        }

        Promise.resolve();
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        throw new Error("Not allowed");
    }
};

export { addTopic, updateTopic };
