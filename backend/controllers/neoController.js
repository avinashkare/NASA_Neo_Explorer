const moment = require('moment');
const nasaService = require('../services/nasaService');
const dataService = require('../services/dataService');
const dbService = require('../services/dbService');

/**
 * Fetch NEO data for a date range, fetching from NASA if needed
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getNeoList = async (req, res) => {
  const { start_date, end_date } = req.query;

  // Validate date format
  if (!start_date || !end_date || !moment(start_date, 'YYYY-MM-DD', true).isValid() || !moment(end_date, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).json({ error: 'Start and end dates are required and must be in YYYY-MM-DD format' });
  }

  try {
    const missingDates = await dbService.checkDateRangeDatabase(start_date, end_date);
    if (missingDates.length > 0) {
      const mergedIntervals = dataService.mergeDateIntervals(missingDates);
      for (const interval of mergedIntervals) {
        const data = await nasaService.fetchAsteroidDataFromNASA(interval.start, interval.end);
        const processedData = dataService.flattenNEOData(data);
        await dbService.insertAsteroidsToDB(processedData);
      }
    }

    const allData = await dbService.fetchAsteroidsFromDB(start_date, end_date);
    res.json(allData);
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

/**
 * Fetch NEO data from database for a date range
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getNeoFromDB = async (req, res) => {
  const { start_date, end_date } = req.query;

  // Validate date format
  if (!start_date || !end_date || !moment(start_date, 'YYYY-MM-DD', true).isValid() || !moment(end_date, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).json({ error: 'Start and end dates are required and must be in YYYY-MM-DD format' });
  }

  try {
    const data = await dbService.fetchAsteroidsFromDB(start_date, end_date);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

module.exports = { getNeoList, getNeoFromDB };