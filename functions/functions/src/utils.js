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
