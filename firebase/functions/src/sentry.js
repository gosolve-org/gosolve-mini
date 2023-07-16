const Sentry = require('@sentry/node');
const { defineString } = require("firebase-functions/params");

const init = () => Sentry.init({
    dsn: defineString('SENTRY_DSN').value(),
    environment: defineString('ENVIRONMENT').value(),
    tracesSampleRate: 1.0,
});

module.exports.Sentry = Sentry;

module.exports.functionWrapper = (handler) => {
    return async (...args) => {
        init();

        try {
            return await handler(...args);
        } catch (e) {
            Sentry.captureException(e);
            await Sentry.flush(2000);

            throw e;
        }
    }
};
