require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NASA_API_KEY: process.env.NASA_API_KEY,
  NASA_BASE_URL: process.env.NASA_BASE_URL
};