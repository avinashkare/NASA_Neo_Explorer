const AsteroidService = require('../services/asteroidService');
const NasaService = require('../services/nasaService');
const { validateDateRange, mergeDateIntervals } = require('../utils/dateUtils');
const { processAsteroid } = require('../utils/asteroidProcessor');

/**
 * Controller for asteroid-related endpoints
 */
class AsteroidController {
  /**
   * Endpoint to get asteroid data (fetch from NASA and store it in DB if not available)
   */
  static async getAsteroidsList(req, res) {
    const { startDate, endDate } = req.query;

    // Validate date range
    const { error } = validateDateRange(startDate, endDate);
    if (error) {
      return res.status(400).json({ error });
    }

    try {
      const dateRangeCheck = await AsteroidService.checkMissingDateRanges(startDate, endDate);
      
      if (dateRangeCheck.rows.length > 0) {
        // Merge consecutive dates into intervals to optimize API calls
        const intervals = mergeDateIntervals(dateRangeCheck.rows);
        
        console.log(`Found ${dateRangeCheck.rows.length} missing dates, merged into ${intervals.length} intervals`);
        
        // Fetch data for each interval
        for (const interval of intervals) {
          console.log(`Fetching data for interval: ${interval.startDate} to ${interval.endDate}`);
          
          try {
            // Fetch data from NASA API for the entire interval
            const asteroidsFromNASA = await NasaService.fetchAsteroidData(interval.startDate, interval.endDate);
            
            // Process and format the asteroid data
            const processedAsteroids = asteroidsFromNASA.map(asteroid => processAsteroid(asteroid));
            
            // Insert new data into the database
            if (processedAsteroids.length > 0) {
              await AsteroidService.insertToDatabase(processedAsteroids);
              console.log(`Inserted ${processedAsteroids.length} asteroids for interval ${interval.startDate} to ${interval.endDate}`);
            }
          } catch (intervalError) {
            console.error(`Error processing interval ${interval.startDate} to ${interval.endDate}:`, intervalError);
            // Continue with other intervals even if one fails
          }
        }
      }

      // Fetch all data from database for the requested range
      const result = await AsteroidService.fetchFromDatabase(startDate, endDate);

      if (result.rows.length > 0) {
        return res.json({ asteroids: result.rows });
      } else {
        return res.status(404).json({ message: 'No asteroid data found for the given date range.' });
      }

    } catch (err) {
      console.error('Error processing asteroid data:', err);
      return res.status(500).json({ error: 'Failed to process asteroid data' });
    }
  }

  /**
   * Endpoint to retrieve asteroid data from the database
   */
  static async getAsteroids(req, res) {
    const { startDate, endDate } = req.query;

    // Validate date range
    const { error } = validateDateRange(startDate, endDate);
    if (error) {
      return res.status(400).json({ error });
    }

    try {
      // Select asteroid data from DB within the given date range
      const result = await AsteroidService.fetchFromDatabase(startDate, endDate);

      // If no data is found, return an appropriate message
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No asteroid data found for the given date range.' });
      }

      // If data is found, return it to the frontend
      return res.json({ asteroids: result.rows });

    } catch (err) {
      console.error('Error retrieving asteroid data:', err);
      return res.status(500).json({ error: 'Failed to retrieve asteroid data' });
    }
  }
}

module.exports = AsteroidController;