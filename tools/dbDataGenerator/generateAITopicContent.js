const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const path = require('path');
const { getPageContentChunks } = require('./src/wikipedia');
const { summarizeContent, generateTopicPageContent } = require('./src/openai');
const topicInputData = require('./out/topics.json');
const firebase = require('./src/firebase');
const Batch = require('batch');
const batch = new Batch();

batch.concurrency(10);

const log = (message) => {
    console.log(message);
    fs.appendFileSync(
        path.join(__dirname, 'logs.txt'),
        `${new Date().toISOString()}: ${message}\n`);
};

const run = async () => {
    if (!topicInputData || !topicInputData.length) {
        throw new Error('No topics found to generate ai content for (file: out/topics.json).');
    }

    if (!fs.existsSync(path.join(__dirname, 'out', 'topicData'))) {
        fs.mkdirSync(path.join(__dirname, 'out', 'topicData'));
    }

    console.log('Fetching all Firestore topics...');
    const locations = await firebase.getCollection('locations');
    const categories = await firebase.getCollection('categories');
    const topics = await firebase.getCollection('topics');
    console.log('Done.');

    topicInputData.forEach(el => {
        const matchingLocation = locations.find(l => l.location === el.location);
        const matchingCategory = categories.find(c => c.category === el.category);

        if (!matchingLocation) {
            throw new Error(`No firestore location found for ${el.location}`);
        }
        if (!matchingCategory) {
            throw new Error(`No firestore category found for ${el.category}`);
        }

        const matchingTopic = topics.find(t =>
            t.locationId === matchingLocation.id && t.categoryId === matchingCategory.id);
        if (!matchingTopic) {
            throw new Error(`No firestore topic found for ${el.category} (${matchingCategory.id}) x ${el.location} (${matchingLocation.id})`);
        }

        el.topicId = matchingTopic.id;
    });

    let progressCounter = 0;

    topicInputData.forEach(el => {
        batch.push(async (done) => {
            console.log(`${++progressCounter}/${topicInputData.length}`);

            try {
                const matchingLocation = locations.find(l => l.location === el.location);
                const matchingCategory = categories.find(c => c.category === el.category);

                const contentChunks = await getPageContentChunks(el.wikiPage, 8000);
                let summary = '';
                for (let i = 0; i < contentChunks.length; i++) {
                    const chunk = contentChunks[i];
                    const chunkSummary = await summarizeContent(chunk, contentChunks.length > 1 ? 1 : 2);
                    summary += chunkSummary + '\n';
                }
                let topicContent;
                for (let i = 0; i < 3; i++) {
                    try {
                        topicContent = await generateTopicPageContent(el.location, el.category, summary);
                        break;
                    } catch (err) {
                        console.log(`Error occured for ${el.topicId} (${el.category} x ${el.location}): ` + err.message);
                        if (i === 2) {
                            throw err;
                        }
                    }
                }
                const topic = {
                    id: el.topicId,
                    data: {
                        content: topicContent,
                        location: matchingLocation.location,
                        category: matchingCategory.category,
                    },
                };
                done(null, topic);
            } catch (err) {
                log(`Error occured for ${el.topicId} (${el.category} x ${el.location}): ` + err.message);
                log(err.stack);
                done(null, null);
            }
        });
    });

    batch.end((err, topics) => {
        if (err) {
            throw err;
        }

        topics.filter(el => el).forEach(topic => {
            fs.writeFileSync(
                path.join(__dirname, 'out', 'topicData', `${topic.id}.json`),
                JSON.stringify(topic, null, 2));
        });
    });
};

run()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
