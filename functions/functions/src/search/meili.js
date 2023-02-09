const axios = require("axios").default;
const { defineString } = require("firebase-functions/params");

const MEILI_API_URL = defineString('MEILI_API_URL');
const MEILI_API_KEY = defineString('MEILI_API_KEY');

const createHeaders = ({ hasJsonBody = false } = {}) => {
    const headers = { "Authorization": `Bearer ${MEILI_API_KEY.value()}` };
    if (hasJsonBody) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
};

const upsertDocument = async (id, type, data) => {
    await axios.post(
        `${MEILI_API_URL.value()}/indexes/resources/documents`, 
        [{
            ...data,
            type: type,
            id: `${type}-${id}`
        }],
        { headers: createHeaders() }
    );
};

const deleteDocument = async (id, type) => {
    await axios.delete(`${MEILI_API_URL.value()}/indexes/resources/documents/${type}-${id}`, {
        headers: createHeaders()
    });
};

const search = async (query, offset, limit) => {
    const request = { q: query };

    if (!!offset) request.offset = offset;
    if (!!limit) request.limit = limit;

    const result = await axios.post(
        `${MEILI_API_URL.value()}/indexes/resources/search`,
        request,
        {
            headers: createHeaders({ hasJsonBody: true })
        }
    );
    
    if (result.data.hits) result.data.hits.forEach(el => {
        el.id = el.id.replace(/^[a-z]+\-/, '');
        el.content = undefined;
    });
    
    return result.data;
}


module.exports = { upsertDocument, deleteDocument, search };
