const axios = require('axios');

/**
 * Fetch asteroid data from NASA API
 * @param {string} start_date - Start date in YYYY-MM-DD format
 * @param {string} end_date - End date in YYYY-MM-DD format
 * @returns {Object} NASA API response data
 */
const fetchAsteroidDataFromNASA = async (start_date, end_date) => {
  const apiKey = process.env.NASA_API_KEY;
  const baseUrl = process.env.NASA_BASE_URL;
  const url = `${baseUrl}/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch data from NASA: ${error.message}`);
  }
};

module.exports = { fetchAsteroidDataFromNASA };