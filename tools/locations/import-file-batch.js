const fs = require('fs');
const path = require('path');
const countries = require('./countries.json');
const { run } = require('./import-file');

const bigCities = [];
// Read all lines from the file /Users/tomd/Downloads/cities15000.txt and split them by tab
const locationLines = fs.readFileSync('/Users/tomd/Downloads/cities15000.txt').toString().split("\n");
// Loop over all lines
locationLines.forEach(locationLine => {
    // Split the line by tab
    const parts = locationLine.split('\t');
    bigCities.push(parts[1]);
    if (parts[1] !== parts[2]) bigCities.push(parts[2]);
});

const logFilePath = path.join(__dirname, 'logs.txt');
Object.keys(countries).forEach(countryCode => {
    try {
        run(countryCode, bigCities);
        fs.appendFileSync(logFilePath, `${new Date().toISOString()}: Processing of ${countryCode} success.\n`);
    } catch (err) {
        fs.appendFileSync(logFilePath, `\n${new Date().toISOString()}: Processing of ${countryCode} FAILED:\n${new Date().toISOString()}: ${err.stack}\n\n`);
    }
});
