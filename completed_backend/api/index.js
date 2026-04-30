require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const app = require('../src/app');

// Vercel rewrites preserve the original URL (e.g. /api/user/register)
// but Express routes are mounted at /user, /items, etc.
// So we strip the /api prefix before passing to Express.
const handler = (req, res) => {
  req.url = req.url.replace(/^\/api/, '') || '/';
  app(req, res);
};

module.exports = handler;
