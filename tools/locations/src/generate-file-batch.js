const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const path = require('path');
const countries = require('../data/countries.json');
const { run: generateFile } = require('./generate-file');
const firebase = require('./firebase');

const run = async () => {
    const alreadyExistingLocations = await firebase.getCollection('locations');

    const bigCities = [];
    // Read all lines from the file /Users/tomd/Downloads/cities15000.txt and split them by tab
    const locationLines = fs.readFileSync('/Users/tomd/Downloads/cities15000.txt').toString().split("\n");
    if (!locationLines || locationLines.length === 0) {
        throw new Error('cities15000.txt not found.');
    }

    // Loop over all lines
    locationLines.forEach(locationLine => {
        if (!locationLine) return;

        // Split the line by tab
        const parts = locationLine.split('\t');

        const addCity = (name) => bigCities.push({
            name,
            countryCode: parts[8],
        });

        if (!parts[1]) throw new Error('No name found in BigCities line.');
        addCity(parts[1]);
        if (parts[1] !== parts[2] && !!parts[2]) addCity(parts[2]);
    });
    
    const logFilePath = path.join(__dirname, '..', 'logs.txt');
    Object.keys(countries).forEach(countryCode => {
        const bigCitiesForCountry = bigCities
            .filter(city => city.countryCode === countryCode)
            .map(city => city.name);
        try {
            generateFile(countryCode, bigCitiesForCountry, alreadyExistingLocations);
            fs.appendFileSync(logFilePath, `${new Date().toISOString()}: Processing of ${countryCode} success.\n`);
        } catch (err) {
            fs.appendFileSync(logFilePath, `\n${new Date().toISOString()}: Processing of ${countryCode} FAILED:\n${new Date().toISOString()}: ${err.stack}\n\n`);
        }
    });

    console.log('Process done. Check the logs.txt file for errors.');
};

run()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
