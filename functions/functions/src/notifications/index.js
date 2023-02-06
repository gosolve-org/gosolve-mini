const functions = require("firebase-functions");
const { REGION } = require('../constants');
const constants = require('../constants');
const { toUrlPart } = require('../utils');
const { triggerNotification, createSubscriber } = require('./novu');
const { createDb } = require('../db');

const getPostMetaData = async (db, postId) => {
    const postDoc = await db.collection('posts').doc(postId).get();
    let { authorId: postAuthorId, topicId, actionId, title: postTitle } = postDoc.data();

    let actionTitle;
    let actionAuthorId;
    if (!!actionId) {
        const actionDoc = await db.collection('actions').doc(actionId).get();
        const action = actionDoc.data();
        topicId = action.topicId;
        actionTitle = action.title;
        actionAuthorId = action.authorId;
    }

    const topicDoc = await db.collection('topics').doc(topicId).get();

    const { categoryId, locationId } = topicDoc.data();
    const [ categoryDoc, locationDoc ] = await Promise.all([
        db.collection('categories').doc(categoryId).get(),
        db.collection('locations').doc(locationId).get(),
    ]);
    const category = categoryDoc.data().category;
    const location = locationDoc.data().location;

    return { postTitle, category, location, actionId, postAuthorId, actionTitle, actionAuthorId };
}

const handleRootCommentCreation = async (commentId, commentAuthorUsername, commentAuthorId, postId) => {
        const db = createDb();

        const { postTitle, category, location, actionId, postAuthorId } = await getPostMetaData(db, postId);

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

    const [
        parentCommentAuthorId,
        otherCommentReplyAuthorIds,
        { postTitle, category, location, actionId }
    ] = await Promise.all([
        getParentCommentAuthorId(),
        getOtherCommentReplyAuthorIds(),
        getPostMetaData(db, postId),
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
        const { authorId, authorUsername } = snapshot.data();

        const { actionId, category, location, actionTitle, actionAuthorId } = await getPostMetaData(db, id);

        if (!actionId) return;
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
