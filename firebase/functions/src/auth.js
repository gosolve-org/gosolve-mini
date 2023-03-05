const functions = require('firebase-functions');
const admin = require('firebase-admin');
const ErrorWithCode = require('./models/ErrorWithCode');
const constants = require('./constants');

module.exports.createUserWithEmailAndPassword = async (email, password) => {
    let existingUser = null;

    try {
        existingUser = await admin.auth().getUserByEmail(email);
    } catch (err) {
        if (err?.errorInfo?.code !== 'auth/user-not-found') {
            throw err;
        }
    }

    if (!!existingUser) {
        throw new ErrorWithCode(constants.ERROR_CODES.AUTH.USER_ALREADY_EXISTS);
    }

    const user = await admin.auth().createUser({
        email,
        password,
    });

    return user.uid;
};
