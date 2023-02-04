const functions = require("firebase-functions");
const axios = require("axios").default;
const { defineString } = require("firebase-functions/params");
const { REGION } = require('../constants');

const MEILI_API_URL = defineString('MEILI_API_URL');
const MEILI_API_KEY = defineString('MEILI_API_KEY');

// Adds or updates a post to our search engine
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

// Adds or updates a post to our search engine
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

// Adds or updates a post to our search engine
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

// Searches through all resources
module.exports.search = functions.region(REGION).https.onCall(async (data) => {
    const query = data.query;
    if (!query) return [];
    
    const request = { q: query };

    if (data.offset) request.offset = data.offset;
    if (data.limit) request.limit = data.limit;

    const result = await axios.post(
        `${MEILI_API_URL.value()}/indexes/resources/search`,
        request,
        {
            headers: {
                "Authorization": `Bearer ${MEILI_API_KEY.value()}`,
                "Content-Type": "application/json"
            }
        }
    );

    if (result.data.hits) result.data.hits.forEach(el => {
        el.id = el.id.replace(/^[a-z]+\-/, '');
        el.content = undefined;
    });

    return result.data;
});
