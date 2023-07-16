// Generates topics for all combinations of locations and categories found
// in the current database (with placeholder content).
const { getCollection, saveToDb } = require('./src/firebase');

const placeholderContent = require('./in/topicPlaceholderContent.json');
// placeholderContent as string (json) without any new lines
const placeholderContentStr = JSON.stringify(placeholderContent);

const now = Date.now();
Promise.all([getCollection('locations'), getCollection('categories')])
    .then(([locations, categories]) => {
        const topics = [];
        locations.forEach((location) => {
            categories.forEach((category) => {
                if (category.hidden === true) return;

                const title = `${category.category} in ${location.location}`;
                topics.push({
                    locationId: location.id,
                    categoryId: category.id,
                    content: placeholderContentStr.replace('{{TITLE}}', title),
                    createdAt: now,
                    updatedAt: now,
                    title,
                });
            });
        });

        saveToDb('topics', topics);
    });
