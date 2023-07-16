const axios = require('axios').default;
const inputData = require('./in/topicGenerationInputData.json');
const fs = require('fs');
const path = require('path');

// If you want to manually search for wiki pages for topics which none can be found for,
// set this to true
const INCLUDE_TOPICS_WITHOUT_WIKI_PAGE = false;

const log = (message) => {
    console.log(message);
    fs.appendFileSync(
        path.join(__dirname, 'logs.txt'),
        `${new Date().toISOString()}: ${message}\n`);
};

const askUser = async (question) => {
    process.stdout.write(`${question} `);
    return new Promise((resolve) => {
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
};

const run = async () => {
    const topics = [];

    const totalTopics = inputData.locations.length * inputData.categories.length;
    let processedTopics = 0;

    for (let locationI = 0; locationI < inputData.locations.length; ++locationI) {
        for (let categoryI = 0; categoryI < inputData.categories.length; ++categoryI) {
            ++processedTopics;
            if (processedTopics % 150 === 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            console.log(`${processedTopics}/${totalTopics}...`);
            const location = inputData.locations[locationI];
            const category = inputData.categories[categoryI].name;
            const wikiQuery = inputData.categories[categoryI].wikiSearchQuery;
    
            const topic = {
                location,
                category,
            };
    
            const response = await axios.get('https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                encodeURIComponent(`${wikiQuery} ${location}`));

            if (response.status !== 200) {
                console.error(`Error for ${wikiQuery} x ${location}: ${response.status} ${response.statusText} ${await JSON.stringify(response.data)}`);
                throw new Error('Error while fetching data from Wikipedia.');
            }

            let links = response.data[3].map(el => el.replace(/https\:\/\/[^\/]+\/wiki\//, ''));
            if (links.length === 0) {
                log(`No results found for ${category} ${location}`);
                if (INCLUDE_TOPICS_WITHOUT_WIKI_PAGE) topics.push(topic);
                continue;
            }

            if (links.length > 1) {
                console.log(`Multiple results found for ${category} ${location}`);
                // Ask user which one to use
                for (let i = 0; i < links.length; ++i) {
                    console.log(`${i + 1}: ${links[i]}`);
                }
                console.log('0: None of the above');
                const answer = Number(await askUser('Which one to use?'));
                if (answer === 0) {
                    log(`No results found for ${category} ${location}`);
                    if (INCLUDE_TOPICS_WITHOUT_WIKI_PAGE) topics.push(topic);
                    continue;
                }
                topic.wikiPage = links[answer - 1];
            } else {
                topic.wikiPage = links[0];
            }

            topics.push(topic);
        }
    }

    fs.writeFileSync(
        path.join(__dirname, 'out', 'topics.json'),
        JSON.stringify(topics, null, 2));

    console.log('Topics written to file: out/topics.json');
    console.log('Failed topics written to file: logs.txt');
    process.exit(0);
};

run()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });