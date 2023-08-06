const fs = require('fs');

const countries = require('../data/countries.json');

let totalCounter = 0;
const counters = {
    ADM1: {},
    ADM2: {},
    ADM3: {},
    ADM4: {},
    ADM5: {},
    ADMD: {},
    OTHER: {},
};
const countryCounters = {};

Object.keys(countries).forEach(countryCode => {
    countryCounters[countryCode] = 0;
    Object.values(counters).forEach(counter => {
        counter[countryCode] = 0;
    });
    const locations = require(`../locationData/locations_${countryCode}.json`);
    locations.forEach(location => {
        totalCounter++;
        countryCounters[countryCode]++;

        if (location.featureCode === 'ADM1') {
            counters.ADM1[countryCode]++;
        } else if (location.featureCode === 'ADM2') {
            counters.ADM2[countryCode]++;
        } else if (location.featureCode === 'ADM3') {
            counters.ADM3[countryCode]++;
        } else if (location.featureCode === 'ADM4') {
            counters.ADM4[countryCode]++;
        } else if (location.featureCode === 'ADM5') {
            counters.ADM5[countryCode]++;
        } else if (location.featureCode === 'ADMD') {
            counters.ADMD[countryCode]++;
        } else {
            counters.OTHER[countryCode]++;
        }
    });
});

console.log('Total locations:', totalCounter);
console.log('\n');

console.log('Feature code counters:');
// For each key in counters, log the key and the  sum of the values of all countries
Object.keys(counters).forEach(key => {
    console.log(key, Object.values(counters[key]).reduce((a, b) => a + b, 0));
});
console.log('\n');

console.log('Top 15 countries:');
const sortedCountryCounters = Object.keys(countryCounters).sort((a, b) => countryCounters[b] - countryCounters[a]);
sortedCountryCounters.slice(0, 15).forEach(countryCode => {
    console.log(countryCode, countryCounters[countryCode]);
});
console.log('\n');

// Log the feature code counters for the top 5 countries
console.log('Top 5 countries feature code counters:');
sortedCountryCounters.slice(0, 5).forEach(countryCode => {
    console.log(`Feature code counters for ${countryCode}:`);
    Object.keys(counters).forEach(key => {
        console.log(key, counters[key][countryCode]);
    });
    console.log('\n');
});