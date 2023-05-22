// IMPORTS A TXT FILE FROM http://download.geonames.org/export/dump/ CONTAINING LOCATIONS
// ADDS TO THE EXISTING locations.json FILE, CREATES IF NOT EXISTS YET

const fs = require('fs');
const path = require('path');
const countries = require('./countries.json');
const continents = require('./continents.json');

const FEATURE_CLASS_WEIGHTS = {
    'A': 10, // country, state, region,...
    'P': 20, // city, village,...
    'H': 30, // stream, lake, ...
    'T': 40, // mountain,hill,rock,...
    'V': 50, // forest,heath,...
    'L': 60, // parks,area, ...
    'R': 70, // road, railroad
    'S': 80, // spot, building, farm
    'U': 90, // undersea
};
const FEATURE_CLASS_WEIGHT_DEFAULT = 500;
const ADMINISTRATIVE_DIVISION_TARGET_LEVEL = 0;

module.exports.run = (countryCode) => {
    const TXT_IMPORT_PATH = `/Users/tomd/Downloads/${countryCode}/${countryCode}.txt`;
    /**
     * Administrative division levels:
     * -2: World
     * -1: Continent
     * 0: Country
     * 1: fipscode (subject to change to iso code), see exceptions below, see file admin1Codes.txt for display names of this code; varchar(20)
     * 2: code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80) 
     * 3: code for third level administrative division, varchar(20)
     * 4: code for fourth level administrative division, varchar(20)
     */
    const country = countries[countryCode];
    const continent = continents[countryCode];

    console.log(`Reading file for country ${countryCode}.`);

    console.log('Loading import...');
    const locationLines = fs.readFileSync(TXT_IMPORT_PATH).toString().split("\n");
    console.log('Import loaded 1/4');
    let locations = locationLines.map(locationLine => {
        const parts = locationLine.split('\t');
        const location = {
            id: parts[0],
            name: parts[1],
            nameLowerCase: parts[1]?.toLowerCase(),
            asciiName: parts[2],
            alternateNames: parts[3]?.split(','),
            _geo: {
                lat: Number(parts[4]) || null,
                lng: Number(parts[5]) || null,
            },
            featureClass: parts[6],
            featureClassWeight: FEATURE_CLASS_WEIGHTS[parts[6]] || FEATURE_CLASS_WEIGHT_DEFAULT,
            featureCode: parts[7],
            countryCode: parts[8],
            alternateCountryCodes: parts[9],
            adminCode1: parts[10],
            adminCode2: parts[11],
            adminCode3: parts[12],
            adminCode4: parts[13],
            adminDivisionTargetLevel: ADMINISTRATIVE_DIVISION_TARGET_LEVEL,
            country,
            continent,
        };

        if (location.name == null || location.name.trim().length === 0) return null;
        if (!location._geo.lat || !location._geo.lng) {
            location._geo = null;
        }

        location.alternateNames = location.alternateNames?.filter(name => name != "" && !/[0-9]/.test(name));
        if (location.alternateNames?.length === 0) location.alternateNames = null;
        if (location.alternateCountryCodes?.length === 0) location.alternateCountryCodes = null;

        return location;
    }).filter(el => el);
    console.log('Deserialization complete 2/4');

    locations = locations.sort((a, b) => {
        if(a.nameLowerCase < b.nameLowerCase) return -1;
        if(a.nameLowerCase > b.nameLowerCase) return 1;
        return 0;
    });

    const locationsToRemove = new Set();

    const locationsLength = locations.length;
    locations.forEach((location, i) => {
        if (i % 100 === 0) {
            if (i > 0) {
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
            }
            process.stdout.write(`Duplicate removal ${i}/${locationsLength}`);
        }
        if (locationsToRemove.has(location)) return;
        let locationsWithName = [location];
        for (let j = i + 1; j < locationsLength; ++j) {
            if (locations[j].nameLowerCase === location.nameLowerCase) {
                locationsWithName.push(locations[j]);
            } else {
                break;
            }
        }
        if (locationsWithName.length > 0) {
            locationsWithName = locationsWithName
                .sort((a, b) => a.featureClass.charCodeAt(0) - b.featureClass.charCodeAt(0));
        }
        for (let j = 1; j < locationsWithName.length; ++j) {
            locationsToRemove.add(locationsWithName[j]);
        }
    });
    process.stdout.write("\n");

    console.log(`Removing ${locationsToRemove.size} duplicates.`);
    locations = locations.filter(l => !locationsToRemove.has(l));
    locations.forEach(l => {
        delete l.nameLowerCase;
    });
    console.log('Duplicate removal complete 3/4');

    const exportFilePath = path.join(__dirname, `locations_${countryCode}.json`);
    if (locations.length > 100000) {
        fs.writeFileSync(exportFilePath, "", { encoding:'utf8', flag:'w' });
        const stream = fs.createWriteStream(exportFilePath, {flags:'a'});
        stream.write('[');
        locations.forEach((location, i) => {
            stream.write(JSON.stringify(location));
            if (i !== locations.length - 1) {
                stream.write(',');
            }
        });
        stream.write(']');
        stream.end();
    } else {
        fs.writeFileSync(exportFilePath, JSON.stringify(locations), { encoding:'utf8', flag:'w' });
    }
    console.log(`Added ${locations.length} locations for ${countryCode}. 4/4`);
    console.log(`${locations.filter(l => !!l._geo).length}/${locations.length} contain geo info.`);
};
