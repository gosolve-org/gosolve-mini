const dotenv = require('dotenv');
const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');
dotenv.config();

let db;

if (process.env.FIREBASE_EMULATORS === 'true' || process.env.FIREBASE_EMULATORS?.toString() === 'true') {
    console.log('Using Firebase emulators');
    
    admin.initializeApp();
    db = admin.firestore();
    db.settings({
        host: 'localhost:8080',
        ssl: false,
    });
} else {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    db = admin.firestore();
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
        const existingDoc = existingDocuments
            .find((d) => d[uniqueProperty] === doc[uniqueProperty]);
        const docRef = doc.id || existingDoc?.id
            ? collection.doc(doc.id ?? existingDoc.id)
            : collection.doc();
        delete doc.id;
        batch.set(docRef, doc, { merge: true });
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
