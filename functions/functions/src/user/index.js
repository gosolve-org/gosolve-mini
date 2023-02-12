const functions = require("firebase-functions");
const { REGION } = require('../constants');
const { createDb, updateUser, getUserByUsername } = require("../db");
const { ensureAuth } = require("../utils");

module.exports.updateUser = functions.region(REGION).https.onCall(async (data, context) => {
    ensureAuth(context);
    const db = createDb();
    const userId = context.auth.uid;

    const usernameRegex = /^[a-zA-Z0-9\.\_\-]+$/;
    if (!usernameRegex.test(data.username)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The username can only contain letters, numbers, hyphens, underscores and periods.');
    }

    const user = await getUserByUsername(db, data.username);
    if (!!user && user.id !== userId) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'That username is already taken.');
    }

    const updateData = {
        name: data.name,
        username: data.username,
        birthYear: data.birthYear,
        updatedAt: new Date().getTime(),
    };

    if (data.isOnboarded !== undefined) updateData.isOnboarded = data.isOnboarded;

    await updateUser(db, userId, updateData);
});
