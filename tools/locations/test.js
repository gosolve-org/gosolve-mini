const fs = require('fs');

const countries = require('./countries.json');

const counters = {
    ADM1: 0,
    ADM2: 0,
    ADM3: 0,
    ADM4: 0,
    ADM5: 0,
    ADMD: 0,
    OTHER: 0,
    FOUND_BIG_CITIES: 0,
    TOTAL: 0,
};

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

// Write all the big cities to a file called bigCities.json
fs.writeFileSync('./bigCities.json', JSON.stringify(bigCities));

Object.keys(countries).forEach(countryCode => {
    console.log(countryCode);
    const locations = require(`./locationData/locations_${countryCode}.json`);
    locations.forEach(location => {
        counters.TOTAL++;

        if (location.featureCode === 'ADM1') {
            counters.ADM1++;
        } else if (location.featureCode === 'ADM2') {
            counters.ADM2++;
        } else if (location.featureCode === 'ADM3') {
            counters.ADM3++;
        } else if (location.featureCode === 'ADM4') {
            counters.ADM4++;
        } else if (location.featureCode === 'ADM5') {
            counters.ADM5++;
        } else if (location.featureCode === 'ADMD') {
            counters.ADMD++;
        } else {
            counters.OTHER++;
        }

        if (bigCities.includes(location.name) || bigCities.includes(location.asciiName)) {
            counters.FOUND_BIG_CITIES++;
        }
    });
});

// Log all the counters to the console
console.log(counters);
