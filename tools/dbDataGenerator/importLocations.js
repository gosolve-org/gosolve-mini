const locations = require('./in/locations.json');
const firebase = require('./src/firebase');

firebase.saveToDb('locations', locations, 'location');
