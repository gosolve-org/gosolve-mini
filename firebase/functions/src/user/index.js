const functions = require("firebase-functions");
const { createUserWithEmailAndPassword } = require("../auth");
const constants = require("../constants");
const { createDb, updateUser, getUserByUsername, addUser } = require("../db");
const ErrorWithCode = require("../models/ErrorWithCode");
const { ensureAuth, createErrorResponse } = require("../utils");

module.exports.updateUser = functions.region(constants.REGION).https.onCall(async (data, context) => {
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


module.exports.registerUser = functions.region(constants.REGION).https.onCall(async (data) => {
    let { email, password, authMethod, userId } = data;
    const db = createDb();

    if (authMethod === 'google' && !userId) {
        throw new Error('userId is missing when registering user with auth method being Google.');
    }

    if (authMethod === 'email') {
        try {
            userId = await createUserWithEmailAndPassword(email, password);
        } catch (err) {
            if (err instanceof ErrorWithCode) {
                if (err.code !== constants.ERROR_CODES.AUTH.USER_ALREADY_EXISTS) {
                    return createErrorResponse(err.code);
                }
            } else {
                functions.logger.error(err);
                return createErrorResponse(constants.ERROR_CODES.UNKNOWN);
            }
        }
    }

    const user = {
        email,
        role: "user",
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
    }

    await addUser(db, userId, user);
});
