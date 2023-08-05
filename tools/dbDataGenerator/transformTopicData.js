const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const fs = require('fs');
const firebase = require('./src/firebase');

const run = async () => {
    const topics = await firebase.getCollection('topics');
    const locations = await firebase.getCollection('locations');
    const categories = await firebase.getCollection('categories');

    topics.forEach(topic => {
        const location = locations.find(l => l.id === topic.locationId);
        const category = categories.find(c => c.id === topic.categoryId);
        if (!location) {
            throw new Error(`No location found for topic ${topic.id}`);
        }
        if (!category) {
            throw new Error(`No category found for topic ${topic.id}`);
        }
        topic.location = location.location;
        topic.category = category.category;
    });

    const ids = fs.readdirSync(path.join(__dirname, 'out', 'topicData'))
        ?.map(el => el.substring(0, el.length - '.json'.length));
    if (!ids || !ids.length) {
        throw new Error('No topic data files found.');
    }

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const doc = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'topicData', `${id}.json`)));

        const location = locations.find(l => l.location === doc.data.location);
        const category = categories.find(c => c.category === doc.data.category);

        const existingTopic = topics.find(t => t.locationId === location.id && t.categoryId === category.id);

        doc.id = existingTopic.id;
        
        fs.writeFileSync(
            path.join(__dirname, 'out', 'topicData', `${id}.json`),
            JSON.stringify(doc, null, 2));
    }
};

run()
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
