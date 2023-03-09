const { defineString } = require("firebase-functions/params");
const { Novu } = require('@novu/node');
const functions = require("firebase-functions");

const NOVU_API_KEY = defineString('NOVU_API_KEY');

const createNovuClient = () => new Novu(NOVU_API_KEY.value());

module.exports.triggerNotification = async (name, subscriberIds, payload) => {
    const novu = createNovuClient();
    await novu.trigger(name, {
        to: subscriberIds.map(id => ({ subscriberId: id })),
        payload
    })
};

module.exports.createSubscriber = async (id, email) => {
    const novu = createNovuClient();

    let subscriber;
    try {
        subscriber = await novu.subscribers.get(id);
    } catch (_) {}

    if (!!subscriber && subscriber.status >= 200 && subscriber.status < 300 && !!subscriber.data?.email) {
        functions.logger.warn(`Will not create subscriber with id ${id} because subscriber with this id already exists.`);
        return;
    }

    await novu.subscribers.identify(id, {
        email,
    });
};
