const functions = require("firebase-functions");
const { REGION } = require('../constants');
const constants = require('../constants');
const { toUrlPart } = require('../utils');
const { triggerNotification, createSubscriber } = require('./novu');
const { createDb, getPost, getTopic, getAction } = require('../db');

const handleRootCommentCreation = async (commentId, commentAuthorUsername, commentAuthorId, postId) => {
        const db = createDb();

        let { actionId, title: postTitle, authorId: postAuthorId, topicId } = await getPost(db, postId);
        if (!!actionId) {
            topicId = (await getAction(db, actionId)).topicId;
        }
        const { category, location } = await getTopic(db, topicId);

        if (postAuthorId === commentAuthorId) return;

        await triggerNotification(constants.NOVU.TRIGGERS.NEW_POST_COMMENT, [postAuthorId], {
            username: commentAuthorUsername,
            postTitle,
            category: toUrlPart(category),
            location: toUrlPart(location),
            isPostOnAction: !!actionId,
            postId,
            actionId,
            commentId,
        });
}

const handleCommentReply = async (commentId, commentAuthorUsername, commentAuthorId, postId, parentCommentId) => {
    const db = createDb();

    const getParentCommentAuthorId = async () => {
        const parentCommentDoc = await db.collection('comments').doc(parentCommentId).get();
        return parentCommentDoc.data().authorId;
    };

    const getOtherCommentReplyAuthorIds = async () => {
        const otherCommentReplyDocs = await db
            .collection('comments')
            .where('parentId', '==', parentCommentId)
            .get();

        return otherCommentReplyDocs.docs.map(doc => doc.data().authorId);
    };

    const getResourceProperties = async () => {
        let { title: postTitle, actionId, topicId } = await getPost(db, postId);
        if (!!actionId) {
            topicId = (await getAction(db, actionId)).topicId;
        }
        const { category, location } = await getTopic(db, topicId);

        return { postTitle, category, location, actionId };
    };

    const [
        parentCommentAuthorId,
        otherCommentReplyAuthorIds,
        { postTitle, category, location, actionId }
    ] = await Promise.all([
        getParentCommentAuthorId(),
        getOtherCommentReplyAuthorIds(),
        getResourceProperties(),
    ]);

    const subscriberIds = [...new Set(otherCommentReplyAuthorIds.concat(parentCommentAuthorId))]
        .filter(id => id !== commentAuthorId);

    if (subscriberIds.length === 0) return;

    await triggerNotification(constants.NOVU.TRIGGERS.NEW_COMMENT_REPLY, subscriberIds, {
        username: commentAuthorUsername,
        postTitle,
        category: toUrlPart(category),
        location: toUrlPart(location),
        isPostOnAction: !!actionId,
        postId,
        actionId,
        commentId,
    });
}

module.exports.createSubscriber = functions.region(REGION).https.onCall(async (data) => {
    await createSubscriber(data.userId, data.email);
});

module.exports.notifyCommentCreation = functions.region(REGION).firestore
    .document('comments/{docId}')
    .onCreate(async (snapshot) => {
        const id = snapshot.id;
        const { authorUsername, authorId, postId, parentId } = snapshot.data();

        if (!!parentId) {
            await handleCommentReply(id, authorUsername, authorId, postId, parentId);
        } else {
            await handleRootCommentCreation(id, authorUsername, authorId, postId);
        }
    });

module.exports.notifyPostCreation = functions.region(REGION).firestore
    .document('posts/{docId}')
    .onCreate(async (snapshot) => {
        const db = createDb();
        const id = snapshot.id;
        const { authorId, authorUsername, actionId } = snapshot.data();

        if (!actionId) return;

        const { topicId, title: actionTitle, authorId: actionAuthorId } = await getAction(db, actionId);

        const { category, location } = await getTopic(db, topicId);

        if (authorId === actionAuthorId) return;

        await triggerNotification(constants.NOVU.TRIGGERS.NEW_ACTION_POST, [actionAuthorId], {
            username: authorUsername,
            actionTitle,
            category: toUrlPart(category),
            location: toUrlPart(location),
            postId: id,
            actionId,
        });
    });
