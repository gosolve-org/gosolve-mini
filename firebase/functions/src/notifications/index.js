const functions = require("firebase-functions");
const { REGION } = require('../constants');
const constants = require('../constants');
const { toUrlPart, truncate, getFirestoreEventType } = require('../utils');
const { triggerNotification, createSubscriber } = require('./novu');
const { createDb, getPost, getTopic, getAction, getCategory, getLocation, getUserById } = require('../db');
const { functionWrapper } = require('../sentry');
const { createDiscordActivityNotification, DiscordActivityNotificationTypes, isDiscordActivityTypeEnabled, escape } = require('./discord');

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

module.exports.createSubscriber = functions.region(REGION).firestore
    .document('user/{docId}')
    .onCreate(functionWrapper(async (change) => {
        await createSubscriber(change.id, change.data().email);
    }));


module.exports.notifyCommentCreation = functions.region(REGION).firestore
    .document('comments/{docId}')
    .onCreate(functionWrapper(async (snapshot) => {
        const db = createDb();
        const id = snapshot.id;
        const { authorUsername, authorId, postId, parentId, content } = snapshot.data();

        const promises = [];

        if (!!parentId) {
            promises.push(handleCommentReply(id, authorUsername, authorId, postId, parentId));
        } else {
            promises.push(handleRootCommentCreation(id, authorUsername, authorId, postId));
        }

        if (isDiscordActivityTypeEnabled(DiscordActivityNotificationTypes.Comments)) {
            promises.push((async () => {
                const { title, actionId, topicId } = await getPost(db, postId);
                let topic;
                let link;
                if (!!actionId) {
                    const action = await getAction(db, actionId);
                    topic = await getTopic(db, action.topicId);
                    link = `https://mini.gosolve.org/${toUrlPart(topic.category)}/${toUrlPart(topic.location)}/actions/${actionId}/community/${postId}`;
                } else {
                    topic = await getTopic(db, topicId);
                    link = `https://mini.gosolve.org/${toUrlPart(topic.category)}/${toUrlPart(topic.location)}/community/${postId}`;
                }
    
                await createDiscordActivityNotification(
                    DiscordActivityNotificationTypes.Comments,
                    'New Comment',
                    {
                        Author: authorUsername,
                        Comment: escape(truncate(content, 100)),
                        ['Post title']: escape(truncate(title, 100)),
                    },
                    link);
            })());
        }

        await Promise.all(promises);
    }));

module.exports.notifyPostCreation = functions.region(REGION).firestore
    .document('posts/{docId}')
    .onCreate(functionWrapper(async (snapshot) => {
        const db = createDb();
        const id = snapshot.id;
        const { authorId, authorUsername, actionId, topicId, title, content } = snapshot.data();

        const shouldCreateDiscordActivityNotification = isDiscordActivityTypeEnabled(DiscordActivityNotificationTypes.Posts);
        const createNovuNotification = !!actionId;

        if (!shouldCreateDiscordActivityNotification && !createNovuNotification) return;

        let topic;
        let action;
        let category;
        let location;
        if (!!actionId) {
            action = await getAction(db, actionId);
            topic = await getTopic(db, action.topicId);
        } else {
            topic = await getTopic(db, topicId);
        }
        category = topic.category;
        location = topic.location;

        const promises = [];

        if (createNovuNotification && authorId !== action.authorId) {
            promises.push(triggerNotification(constants.NOVU.TRIGGERS.NEW_ACTION_POST, [action.authorId], {
                username: authorUsername,
                actionTitle,
                category: toUrlPart(category),
                location: toUrlPart(location),
                postId: id,
                actionId,
            }));
        }

        if (shouldCreateDiscordActivityNotification) {
            const notificationData = {
                Author: authorUsername,
                Title: escape(truncate(title, 100)),
                Post: escape(truncate(content, 100)),
            };
            let link;
            if (!!actionId) {
                notificationData.Action = escape(truncate(action.title, 100));
                link = `https://mini.gosolve.org/${toUrlPart(category)}/${toUrlPart(location)}/actions/${actionId}/community/${id}`;
            } else {
                notificationData.Topic = escape(truncate(topic.title, 100));
                link = `https://mini.gosolve.org/${toUrlPart(category)}/${toUrlPart(location)}/community/${id}`;
            }
            await createDiscordActivityNotification(
                DiscordActivityNotificationTypes.Posts,
                'New Post',
                notificationData,
                link);
        }

        await Promise.all(promises);
    }));

module.exports.notifyActionWrite = functions.region(REGION).firestore
    .document('actions/{docId}')
    .onWrite(functionWrapper(async (change) => {
        if (!isDiscordActivityTypeEnabled(DiscordActivityNotificationTypes.Actions)) return;
        const eventType = getFirestoreEventType(change.before, change.after);

        if (eventType !== 'create' && eventType !== 'update') return;

        const db = createDb();
        const id = change.after.id;
        const { authorUsername, topicId, title } = change.after.data();

        const topic = await getTopic(db, topicId);

        await createDiscordActivityNotification(
            DiscordActivityNotificationTypes.Actions,
            eventType === 'create' ? 'New Action' : 'Action Updated',
            {
                Author: authorUsername,
                Title: escape(truncate(title, 100)),
                Topic: topic.title,
            },
            `https://mini.gosolve.org/${toUrlPart(topic.category)}/${toUrlPart(topic.location)}/actions/${id}`);
    }));

module.exports.notifyTopicUpdate = functions.region(REGION).firestore
    .document('topicHistory/{docId}')
    .onCreate(functionWrapper(async (snapshot) => {
        if (!isDiscordActivityTypeEnabled(DiscordActivityNotificationTypes.Topics)) return;
        const db = createDb();
        const { title, categoryId, locationId, authorUsername } = snapshot.data();

        const [category, location] = await Promise.all([
            getCategory(db, categoryId),
            getLocation(db, locationId),
        ]);

        await createDiscordActivityNotification(
            DiscordActivityNotificationTypes.Topics,
            'Topic Updated',
            {
                Author: authorUsername,
                Topic: title,
            },
            `https://mini.gosolve.org/${toUrlPart(category.category)}/${toUrlPart(location.location)}`);
    }));
