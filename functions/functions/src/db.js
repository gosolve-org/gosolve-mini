const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

module.exports.createDb = () => admin.firestore();

module.exports.getPost = async (db, postId) => {
    const postDoc = await db.collection('posts').doc(postId).get();
    const post = postDoc.data();

    return {
        authorId: post.authorId,
        topicId: post.topicId,
        actionId: post.actionId,
        title: post.title,
    }
};

module.exports.getAction = async (db, actionId) => {
    const actionDoc = await db.collection('actions').doc(actionId).get();
    const action = actionDoc.data();

    return {
        authorId: action.authorId,
        authorUsername: action.authorUsername,
        topicId: action.topicId,
        title: action.title,
    };
};

module.exports.getTopic = async (db, topicId) => {
    const topicDoc = await db.collection('topics').doc(topicId).get();
    const topic = topicDoc.data();

    const [ { category }, { location } ] = await Promise.all([
        this.getCategory(db, topic.categoryId),
        this.getLocation(db, topic.locationId),
    ]);

    return {
        title: topic.title,
        content: topic.content,
        categoryId: topic.categoryId,
        locationId: topic.locationId,
        category,
        location,
    };
};

module.exports.getCategory = async (db, categoryId) => {
    const categoryDoc = await db.collection('categories').doc(categoryId).get();
    return { category: categoryDoc.data().category };
};

module.exports.getLocation = async (db, locationId) => {
    const locationDoc = await db.collection('locations').doc(locationId).get();
    return { location: locationDoc.data().location };
};
