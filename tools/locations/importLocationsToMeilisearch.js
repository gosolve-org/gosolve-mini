const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

const countries = require('./countries.json');
const countryCodes = Object.keys(countries);
const { meilisearchApiKey, meilisearchBaseUri, meilisearchIndex } = require('./env.json');

const MAX_SINGLE_BATCH_LEN = 50000000;

const run = async () => {
    for (let i = 0; i < countryCodes.length; ++i) {
        const countryCode = countryCodes[i];
        console.log(`Processing ${countryCode}...`);
        let json = fs.readFileSync(path.join(__dirname, 'locationData', `locations_${countryCode}.json`)).toString();

        if (json.length < MAX_SINGLE_BATCH_LEN) {
            console.log(`POSTing to Meilisearch`);
            await addDocuments(json);
            console.log(`Done processing ${countryCode}.`);
        } else {
            json = json.trim();
            json = json.substring(1, json.length - 1);
            for (let j = 0; json.length > 0; ++j) {
                const cutIndex = Math.min(json.length, MAX_SINGLE_BATCH_LEN);
                let partialJson = json.substring(0, cutIndex);
                json = json.substring(cutIndex);
                const cutIndexCompleteJson = json.indexOf(",{");
                if (cutIndexCompleteJson === -1) {
                    partialJson += json;
                    json = "";
                } else {
                    partialJson += json.substring(0, cutIndexCompleteJson);
                    json = json.substring(cutIndexCompleteJson + 1);
                }

                console.log(`POSTing to Meilisearch (${j}/?)`);
                await addDocuments(`[${partialJson}]`);
                console.log(`Done processing ${countryCode} (${j}/?).`);
            }
        }
    }
}

const addDocuments = async (json) => {
    const postResponse = await axios.post(
        `${meilisearchBaseUri}/indexes/${meilisearchIndex}/documents`,
        json,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${meilisearchApiKey}`
            }
        });
    const taskId = postResponse.data.taskUid;
    console.log(`POST complete with taskId ${taskId}`);

    let secondsWait = 2;
    while (true) {
        await new Promise(resolve => setTimeout(resolve, secondsWait * 1000));
        const taskStatusResponse = await axios.get(
            `${meilisearchBaseUri}/tasks/${taskId}`,
            {
                headers: {
                    'Authorization': `Bearer ${meilisearchApiKey}`
                }
            });
        
        console.log(`Task status for id ${taskId} is: ${taskStatusResponse.data.status}`);
        if (taskStatusResponse.data.status === 'succeeded') break;
        secondsWait += 2;
    }
}

run()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
