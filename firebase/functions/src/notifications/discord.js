const axios = require('axios').default;
const { defineString } = require("firebase-functions/params");

const DISCORD_WEBHOOK_ENV_PREFIX = "DISCORD_WEBHOOK_";

const DiscordActivityNotificationTypes = {
    AllActivity: 'ALL_ACTIVITY',
    Topics: 'TOPICS',
    Actions: 'ACTIONS',
    Posts: 'POSTS',
    Comments: 'COMMENTS',
}

const WEBHOOKS = Object.values(DiscordActivityNotificationTypes).reduce((acc, value) => {
    acc[value] = defineString(`${DISCORD_WEBHOOK_ENV_PREFIX}${value}`);
    return acc;
}, {});

const environment = defineString('ENVIRONMENT');

module.exports.DiscordActivityNotificationTypes = DiscordActivityNotificationTypes;

module.exports.escape = (str) => str.replace(/\n/g, ' ');

const isDiscordActivityTypeEnabled = (type) => !!WEBHOOKS[type].value() && !!WEBHOOKS[DiscordActivityNotificationTypes.AllActivity].value();
module.exports.isDiscordActivityTypeEnabled = isDiscordActivityTypeEnabled;

module.exports.createDiscordActivityNotification = async (type, title, properties, link) => {
    if (!isDiscordActivityTypeEnabled(type)) return;
    const promises = [];
    const envValue = environment.value();
    const data = {
        username: envValue === 'production'
            ? 'goSolve Activity'
            : `goSolve Activity | ${envValue}`,
        avatar_url: 'https://www.gosolve.org/assets/images/favicon.png',
        content: null,
        embeds: [{
            title,
            description: Object.keys(properties).map(key => `**${key}:** ${properties[key]}`).join('\n') + '\n\n' + `[View on goSolve](${link})`,
            color: 1884036,
        }]
    };

    promises.push(axios.post(WEBHOOKS[type].value(), data));
    if (type !== DiscordActivityNotificationTypes.AllActivity) {
        promises.push(axios.post(WEBHOOKS[DiscordActivityNotificationTypes.AllActivity].value(), data));
    }

    await Promise.all(promises);
};
