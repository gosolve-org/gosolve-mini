const fs = require('fs');
const path = require('path');
const firebase = require('./src/firebase');

const run = async () => {
    const ids = fs.readdirSync(path.join(__dirname, 'out', 'topicData'))
        ?.map(el => el.substring(0, el.length - '.json'.length));
    if (!ids || !ids.length) {
        throw new Error('No topic data files found.');
    }

    const topics = await firebase.getCollection('topics');

    const data = [];
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        console.log(`${i + 1}/${ids.length}`);
        const dataItem = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'topicData', `${id}.json`)));
        const convertedDataItem = { id: dataItem.id, ...dataItem.data };
        delete convertedDataItem.category;
        delete convertedDataItem.location;

        if (!topics.find(t => t.id === convertedDataItem.id)) {
            throw new Error(`No firestore topic found for ${convertedDataItem.id}`);
        }

        if (convertedDataItem.content instanceof Object) {
            convertedDataItem.content = JSON.stringify(convertedDataItem.content);
        }
        data.push(convertedDataItem);
    }

    await firebase.saveToDb('topics', data);
};

run()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
