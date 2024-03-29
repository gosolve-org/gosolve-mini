// IMPORTS A TXT FILE FROM http://download.geonames.org/export/dump/ CONTAINING LOCATIONS
// ADDS TO THE EXISTING locations.json FILE, CREATES IF NOT EXISTS YET

const fs = require('fs');
const path = require('path');
const countries = require('../data/countries.json');

const FEATURE_CODE_FILTERS = {
    'A': ['ADM1', 'ADM2'/*, 'ADM3', 'ADM4', 'ADM5', 'ADMD'*/],
    //'H': ['GLCR', 'GULF', 'HBR', 'OCN', 'SEA'],
    //'L': ['AREA', 'CST', 'PRK'],
    // Unsure if these P - PPL places are needed in search. For now, they are filtered out.
    // These add a total of 2.725.010 locations and will require a big machine upgrade.
    //'P': ['PPL'], // populated place: a city, town, village, or other agglomeration of buildings where people live and work
    //'S': ['AIRP', 'PYR', 'PYRS'],
    //'T': ['BCH', 'BCHS', 'CNYN', 'DSRT', 'ISL', 'ISLS'],
};
const FEATURE_CODE_BIG_CITY_EXCEPTIONS = ['ADM1', 'ADM2', 'ADM3', 'ADM4', 'ADM5', 'ADMD'];

const ADMIN_DIVISION_TARGET_LEVEL = 0;

module.exports.run = (countryCode, bigCities, alreadyExistingLocations) => {
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
    const country = countries[countryCode].name;

    console.log(`Reading file for country ${countryCode}.`);

    console.log('Loading import...');
    const locationLines = fs.readFileSync(TXT_IMPORT_PATH).toString().split("\n");
    console.log('Import loaded 1/5');

    const targetId = alreadyExistingLocations
        .find(el => el.countryCode === countryCode)?.id;

    if (targetId == null) {
        throw new Error(`No already existing location found for country ${countryCode}.`);
    }

    let locations = locationLines.map(locationLine => {
        const parts = locationLine.split('\t');
        const featureClass = parts[6];
        const featureCode = parts[7];

        let matchingBigCity = undefined;
        if (!FEATURE_CODE_FILTERS[featureClass] || !FEATURE_CODE_FILTERS[featureClass].includes(featureCode)) {
            if (!FEATURE_CODE_BIG_CITY_EXCEPTIONS.includes(featureCode)) {
                return null;
            }

            matchingBigCity = bigCities.find(bigCity =>
                parts[1].includes(bigCity) ||
                parts[2].includes(bigCity) ||
                bigCity.includes(parts[1]) ||
                bigCity.includes(parts[2]) ||
                (parts[3] && parts[3].includes(bigCity))) || undefined;
            
            if (!matchingBigCity) {
                return null;
            }
        }

        const location = {
            id: parts[0],
            name: parts[1],
            nameLowerCase: parts[1]?.toLowerCase(),
            asciiName: parts[1] !== parts[2] ? parts[2] : null,
            //alternateNames: parts[3]?.split(','),
            _geo: {
                lat: Number(parts[4]) || null,
                lng: Number(parts[5]) || null,
            },
            featureClass,
            featureCode,
            //countryCode: parts[8],
            //alternateCountryCodes: parts[9],
            adminCode1: parts[10],
            adminCode2: parts[11],
            adminCode3: parts[12],
            adminCode4: parts[13],
            population: !isNaN(parts[14]) ? Number(parts[14]) : null,
            //elevation: parts[15],
            //dem: parts[16],
            adminDivisionTargetLevel: ADMIN_DIVISION_TARGET_LEVEL,
            //country,
            targetName: country,
            targetId,
            matchingBigCity,
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
    console.log('Deserialization complete 2/5');

    const bigCityDuplicates = new Set();
    locations
        .filter(l => l.matchingBigCity)
        .forEach(location => bigCityDuplicates.add(location.matchingBigCity));
    bigCityDuplicates.forEach(bigCityDuplicate => {
        const locationsWithBigCityDuplicate = locations
            .filter(location => location.matchingBigCity === bigCityDuplicate)
            .sort((a, b) => (b.population || 0) - (a.population || 0));
        locationsWithBigCityDuplicate
            .slice(1)
            .forEach(location => locations.splice(locations.indexOf(location), 1));
    });

    console.log('Big city duplicates removed 3/5');

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
                .sort((a, b) => (b.population || 0) - (a.population || 0));
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
    console.log('Duplicate removal complete 4/5');


    const exportFilePath = path.join(__dirname, '..', 'locationData', `locations_${countryCode}.json`);
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
    console.log(`Added ${locations.length} locations for ${countryCode}. (${Math.floor(locations.length / locationLines.length * 100)}% of all location data) 5/5`);
    console.log(`${locations.filter(l => !!l._geo).length}/${locations.length} contain geo info.`);
};
