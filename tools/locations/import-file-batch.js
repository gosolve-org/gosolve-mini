const fs = require('fs');
const path = require('path');
const countries = require('./countries.json');
const { run } = require('./import-file');

const logFilePath = path.join(__dirname, 'logs.txt');
Object.keys(countries).forEach(countryCode => {
    try {
        run(countryCode);
        fs.appendFileSync(logFilePath, `${new Date().toISOString()}: Processing of ${countryCode} success.\n`);
    } catch (err) {
        fs.appendFileSync(logFilePath, `\n${new Date().toISOString()}: Processing of ${countryCode} FAILED:\n${new Date().toISOString()}: ${err.stack}\n\n`);
    }
});
