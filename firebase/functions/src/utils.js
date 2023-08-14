const functions = require('firebase-functions');

module.exports.truncate = (str, n) => {
    return (str.length > n) ? str.slice(0, n) + '…' : str;
}

module.exports.toUrlPart = (content) => content?.split(" ").join("-");

module.exports.getFirestoreEventType = (before, after) => {
    if (!after.exists) {
        return 'delete';
    } else if (!before.exists) {
        return 'create';
    } else {
        return 'update';
    }
}

module.exports.editorJsContentToRawText = (editorJsContent) => {
    return editorJsContent;
};

module.exports.ensureAuth = (context) => {
    if (!context?.auth?.uid) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called while authenticated.');
    }
}

module.exports.createErrorResponse = (errorCode) => ({ error: { code: errorCode } });
