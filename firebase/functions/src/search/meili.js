const axios = require("axios").default;
const { defineString } = require("firebase-functions/params");
const functions = require("firebase-functions");

const MEILI_API_URL = defineString('MEILI_API_URL');
const MEILI_API_KEY = defineString('MEILI_API_KEY');
const MEILI_RESOURCE_INDEX = defineString('MEILI_RESOURCE_INDEX');

const getResourceIndexUrl = () =>
    `${MEILI_API_URL.value()}/indexes/${MEILI_RESOURCE_INDEX.value()}`;

const createHeaders = ({ hasJsonBody = false } = {}) => {
    const headers = { "Authorization": `Bearer ${MEILI_API_KEY.value()}` };
    if (hasJsonBody) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
};

const upsertDocument = async (id, type, data) => {
    await axios.post(
        `${getResourceIndexUrl()}/documents`, 
        [{
            ...data,
            type: type,
            id: `${type}-${id}`
        }],
        { headers: createHeaders() }
    );
};

const deleteDocument = async (id, type) => {
    await axios.delete(`${getResourceIndexUrl()}/documents/${type}-${id}`, {
        headers: createHeaders()
    });
};

const search = async (query, options) => {
    const request = { q: query.query, filter: [] };

    if (!!options.offset) request.offset = options.offset;
    if (!!options.limit) request.limit = options.limit;
    if (!!query.categoryIdFilter) {
        functions.logger.log(`categoryIdFilter: ${query.categoryIdFilter}`);
        request.filter.push(`categoryId = ${query.categoryIdFilter}`);
    }
    if (!!query.locationIdFilter) {
        functions.logger.log(`locationIdFilter: ${query.locationIdFilter}`);
        request.filter.push(`locationId = ${query.locationIdFilter}`);
    }

    const result = await axios.post(
        `${getResourceIndexUrl()}/search`,
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
