require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const app = require('../src/app');

// Vercel serverless: export the Express app, no app.listen()
module.exports = app;
