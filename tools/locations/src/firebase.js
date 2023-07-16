const admin = require('firebase-admin');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

admin.initializeApp(firebaseConfig);
const db = admin.firestore();

if (process.env.FIREBASE_EMULATORS === 'true' || process.env.FIREBASE_EMULATORS?.toString() === 'true') {
    db.settings({
        host: 'localhost:8080',
        ssl: false,
    });
}

/**
 * 
 * @param {*} collectionName 
 * @param {*} documents 
 * @param {*} uniqueProperty (Optional) If set, the document will be updated if a document
 * with the same uniqueProperty already exists.
 */
module.exports.saveToDb = async (collectionName, documents, uniqueProperty = null) => {
    let existingDocuments = [];
    if (uniqueProperty) {
        existingDocuments = await module.exports.getCollection(collectionName);
    }

    const collection = db.collection(collectionName);
    let batch = db.batch();
    let batchCount = 0;

    console.log(`Uploading ${documents.length} documents to ${collectionName}`);
    for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const docRef = collection.doc();
        batch.set(docRef, doc);
        batchCount++;
        if (batchCount === 499 || i === documents.length - 1) {
            await batch.commit();
            batch = db.batch();
            batchCount = 0;
        }
    }
    console.log(`Uploaded ${documents.length} documents to ${collectionName}`);
};

module.exports.getCollection = async (collectionName) => {
    const collection = db.collection(collectionName);
    const snapshot = await collection.get();
    const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return documents;
};
