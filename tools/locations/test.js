const fs = require('fs');
const path = require('path');

const locations = require('./locationData/locations_CN.json');
const countries = require('./countries.json');

const features = {};
const featuresCount = {};
locations.forEach(location => {
    if (!features[location.featureClass]) features[location.featureClass] = {};
    if (!features[location.featureClass][location.featureCode])
        features[location.featureClass][location.featureCode] = [];
    if (!featuresCount[location.featureClass]) featuresCount[location.featureClass] = {};
    if (!featuresCount[location.featureClass][location.featureCode])
        featuresCount[location.featureClass][location.featureCode] = 0;
    
    features[location.featureClass][location.featureCode].push(location.name);
    ++featuresCount[location.featureClass][location.featureCode];
});

Object.values(features).forEach(feature => {
    Object.keys(feature).forEach(featureClass => {
        const featureClasses = feature[featureClass];
        const MAX = featureClass != 'PPL' ? 5 : 100;
        if (featureClasses.length <= MAX) return;
        const els = [];

        for (let i = 0; i < MAX; ++i) {
            els.push(featureClasses.splice(Math.floor(Math.random()*featureClasses.length), 1));
        }

        feature[featureClass] = els;
    })
});

fs.writeFileSync(path.join(__dirname, 'out1.json'), JSON.stringify(features));
fs.writeFileSync(path.join(__dirname, 'out2.json'), JSON.stringify(featuresCount));

const featuresCountTotal = {};
Object.keys(countries).forEach(countryCode => {
    const locationsForCountry = require(`./locationData/locations_${countryCode}.json`);
    locationsForCountry.forEach(location => {
        if (!featuresCountTotal[location.featureClass]) featuresCountTotal[location.featureClass] = {};
        if (!featuresCountTotal[location.featureClass][location.featureCode])
            featuresCountTotal[location.featureClass][location.featureCode] = 0;
        
        ++featuresCountTotal[location.featureClass][location.featureCode];
    });
});

fs.writeFileSync(path.join(__dirname, 'out3.json'), JSON.stringify(featuresCountTotal));
