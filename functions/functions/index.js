const searchFunctions = require('./src/search');
const notificationFunctions = require('./src/notifications');

module.exports = { ...searchFunctions, ...notificationFunctions };
