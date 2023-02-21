const searchFunctions = require('./src/search');
const notificationFunctions = require('./src/notifications');
const userFunctions = require('./src/user');

module.exports = { ...searchFunctions, ...notificationFunctions, ...userFunctions };
