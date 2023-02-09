const functions = require("firebase-functions");
const { REGION } = require('../constants');
const { upsertDocument, deleteDocument, search } = require('./meili');
const { createDb, getAction, getTopic, getCategory, getLocation } = require('../db');
const { getFirestoreEventType, editorJsContentToRawText } = require("../utils");
const { defineString } = require("firebase-functions/params");
const axios = require('axios').default;

const MEILI_API_URL = defineString('MEILI_API_URL');
const MEILI_API_KEY = defineString('MEILI_API_KEY');

module.exports.upsertPost = functions.region(REGION).https.onCall(async (data) => {
    await axios.post(
        `${MEILI_API_URL.value()}/indexes/resources/documents`, 
        [{
            ...data,
            type: 'post',
            id: `post-${data.id}`
        }],
        { headers: { "Authorization": `Bearer ${MEILI_API_KEY.value()}` } }
    );
});

module.exports.upsertPostToMeiliSearch = functions.region(REGION).firestore
    .document('posts/{docId}')
    .onWrite(async (change) => {
        const eventType = getFirestoreEventType(change.before, change.after);
        const id = change.after.id;

        if (eventType === 'create' || eventType === 'update') {
            const db = createDb();

            let { title, authorUsername, topicId, actionId, content, createdAt } = change.after.data();

            if (!!actionId) {
                topicId = (await getAction(db, actionId)).topicId;
            }

            const { category, location } = await getTopic(db, topicId);

            await upsertDocument(id, 'post', {
                topicId,
                actionId,
                category,
                location,
                title,
                authorUsername,
                content,
                createdAt,
            });
        } else if (eventType === 'delete') {
            await deleteDocument(id, 'post');
        }
    });

module.exports.upsertAction = functions.region(REGION).https.onCall(async (data) => {
    await axios.post(
        `${MEILI_API_URL.value()}/indexes/resources/documents`, 
        [{
            ...data,
            type: 'action',
            id: `action-${data.id}`
        }],
        { headers: { "Authorization": `Bearer ${MEILI_API_KEY.value()}` } }
    );
});

module.exports.upsertActionToMeiliSearch = functions.region(REGION).firestore
    .document('actions/{docId}')
    .onWrite(async (change) => {
        const eventType = getFirestoreEventType(change.before, change.after);
        const id = change.after.id;

        if (eventType === 'create' || eventType === 'update') {
            const db = createDb();

            const { authorUsername, createdAt, topicId, title, content } = change.after.data();
            const { category, location } = await getTopic(db, topicId);

            await upsertDocument(id, 'action', {
                topicId,
                category,
                location,
                title,
                authorUsername,
                content: editorJsContentToRawText(content),
                createdAt,
            });
        } else if (eventType === 'delete') {
            await deleteDocument(id, 'action');
        }
    });

module.exports.upsertTopic = functions.region(REGION).https.onCall(async (data) => {
    await axios.post(
        `${MEILI_API_URL.value()}/indexes/resources/documents`, 
        [{
            ...data,
            type: 'topic',
            id: `topic-${data.id}`
        }],
        { headers: { "Authorization": `Bearer ${MEILI_API_KEY.value()}` } }
    );
});

module.exports.upsertTopicToMeiliSearch = functions.region(REGION).firestore
    .document('topics/{docId}')
    .onWrite(async (change) => {
        const eventType = getFirestoreEventType(change.before, change.after);
        const id = change.after.id;

        if (eventType === 'create' || eventType === 'update') {
            const db = createDb();

            const { content, categoryId, locationId } = change.after.data();
            const [{ category }, { location }] = await Promise.all([
                getCategory(db, categoryId),
                getLocation(db, locationId),
            ]);

            await upsertDocument(id, 'topic', {
                category,
                location,
                content: editorJsContentToRawText(content),
            });
        } else if (eventType === 'delete') {
            await deleteDocument(id, 'topic');
        }
    });

// Searches through all resources
module.exports.search = functions.region(REGION).https.onCall(async (data) => {
    const query = data.query;
    if (!query) return [];

    return await search(query, data.offset, data.limit);
});
