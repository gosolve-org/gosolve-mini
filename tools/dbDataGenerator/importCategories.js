const categories = require('./in/categories.json');
const firebase = require('./src/firebase');

firebase.saveToDb('categories', categories, 'category');
