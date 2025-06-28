const axios = require('axios');
const { NASA_API_KEY, NASA_BASE_URL } = require('../config/environment');
const { flattenNEOData } = require('../utils/asteroidProcessor');

/**
 * Service for interacting with NASA API
 */
class NasaService {
  /**
   * Function to fetch asteroid data from NASA API
   * @param {String} startDate - The start date in 'YYYY-MM-DD' format 
   * @param {String} endDate - The end date in 'YYYY-MM-DD' format 
   * @returns {Array} - Array of flattened asteroid objects
   */
  static async fetchAsteroidData(startDate, endDate) {
    try {
      console.log(`Fetching NASA data from ${startDate} to ${endDate}`);
      const response = await axios.get(`${NASA_BASE_URL}/feed`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          api_key: NASA_API_KEY,
        },
      });
      return flattenNEOData(response.data);
    } catch (error) {
      throw new Error('Error fetching data from NASA API: ' + error.message);
    }
  }
}

module.exports = NasaService;