const functions = require("firebase-functions");
const axios = require("axios").default;
const { defineString } = require("firebase-functions/params");
const { REGION } = require('../constants');
const { Novu } = require('@novu/node');

const NOVU_API_KEY = defineString('NOVU_API_KEY');

const novu = new Novu(NOVU_API_KEY.value());

// Adds or updates a post to our search engine
module.exports.notifyTest = functions.region(REGION).https.onCall(async (data) => {
    await novu.trigger('test-notification', {
        to: {
          subscriberId: '<REPLACE_WITH_DATA>'
        },
        payload: {
            text: data.text
        }
    });
});
