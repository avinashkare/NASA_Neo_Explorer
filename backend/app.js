require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = process.env.NASA_BASE_URL;

/**
 * Function to check if the provided date range is valid
 * @param {String} startDate - The start date in 'YYYY-MM-DD' format
 * @param {String} endDate - The end date in 'YYYY-MM-DD' format
 * @returns 
 */
const checkDate = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { error: 'Please provide both startDate and endDate parameters.' };
  }
  return { error: null };
};

/**
 * Function to fetch asteroid data from the database
 * @param {*} pool - The PostgreSQL connection pool
 * @param {String} startDate - The start date in 'YYYY-MM-DD' format
 * @param {String} endDate - The end date in 'YYYY-MM-DD' format
 * @returns 
 */
const fetchAsteroidsFromDB = async (pool, startDate, endDate) => {
  const query = `
    SELECT * FROM asteroids WHERE date_range_start >= $1 AND date_range_end <= $2
  `;
  return pool.query(query, [startDate, endDate]);
};

/**
 * Function to fetch asteroid data from NASA API
 * @param {String} startDate - The start date in 'YYYY-MM-DD' format 
 * @param {String} endDate - The end date in 'YYYY-MM-DD' format 
 * @returns 
 */
const fetchAsteroidDataFromNASA = async (startDate, endDate) => {
  try {
    const response = await axios.get(NASA_BASE_URL, {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: NASA_API_KEY,
      },
    });
    return response.data.near_earth_objects; // Returning the asteroid data
  } catch (error) {
    throw new Error('Error fetching data from NASA API: ' + error.message);
  }
};

/**
 * Function to process asteroid data
 * @param {Object} asteroid - The asteroid object from NASA API
 * @param {String} startDate - The start date in 'YYYY-MM-DD' format 
 * @param {String} endDate - The end date in 'YYYY-MM-DD' format  
 * @returns 
 */
const processAsteroid = (asteroid, startDate, endDate) => {
  const {
    neo_reference_id,
    name,
    estimated_diameter,
    is_potentially_hazardous_asteroid,
    close_approach_data,
    orbital_data,
    nasa_jpl_url,
  } = asteroid;

  // Extract diameter data
  const diameterMin = estimated_diameter.meters.estimated_diameter_min;
  const diameterMax = estimated_diameter.meters.estimated_diameter_max;
  const averageDiameter = (diameterMin + diameterMax) / 2;

  // Extract the closest approach data (use the first record)
  const closeApproach = close_approach_data?.[0] || {};
  const closeApproachDate = closeApproach.close_approach_date || '';
  const missDistanceKm = closeApproach.miss_distance?.kilometers || 0;
  const velocityKmh = closeApproach.relative_velocity?.kilometers_per_hour || 0;
  const orbitingBody = closeApproach.orbiting_body || '';

  // Extract orbital data
  const firstObservationDate = orbital_data?.first_observation_date || '';
  const lastObservationDate = orbital_data?.last_observation_date || '';
  const observationsUsed = orbital_data?.observations_used || 0;
  const orbitalPeriod = orbital_data?.orbital_period || 0;
  const eccentricity = orbital_data?.eccentricity || 0;
  const dataArcInDays = orbital_data?.data_arc_in_days || 0;

  // Return processed asteroid data for insertion
  return {
    neo_reference_id,
    name,
    estimated_diameter_min: diameterMin,
    estimated_diameter_max: diameterMax,
    average_diameter: averageDiameter,
    is_potentially_hazardous_asteroid,
    close_approach_date: closeApproachDate,
    miss_distance_km: missDistanceKm,
    velocity_kmh: velocityKmh,
    orbiting_body: orbitingBody,
    first_observation_date: firstObservationDate,
    last_observation_date: lastObservationDate,
    observations_used: observationsUsed,
    orbital_period: orbitalPeriod,
    eccentricity: eccentricity,
    data_arc_in_days: dataArcInDays,
    nasa_jpl_url,
    date_range_start: startDate,
    date_range_end: endDate,
  };
};

/**
 * Function to insert asteroid data into the database
 * @param {*} pool - The PostgreSQL connection pool
 * @param {Array<Object>} asteroids - The array of asteroid objects to be inserted
 * @returns 
 */
const insertAsteroidsToDB = async (pool, asteroids) => {
  const insertQuery = `
    INSERT INTO asteroids (
      neo_reference_id,
      name,
      estimated_diameter_min,
      estimated_diameter_max,
      average_diameter,
      is_potentially_hazardous_asteroid,
      close_approach_date,
      miss_distance_km,
      velocity_kmh,
      orbiting_body,
      first_observation_date,
      last_observation_date,
      observations_used,
      orbital_period,
      eccentricity,
      data_arc_in_days,
      nasa_jpl_url,
      date_range_start,
      date_range_end
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
 
    ON CONFLICT (neo_reference_id, date_range_start, date_range_end)
    DO UPDATE SET
      name = EXCLUDED.name, 
      estimated_diameter_min = EXCLUDED.estimated_diameter_min,
      estimated_diameter_max = EXCLUDED.estimated_diameter_max,
      average_diameter = EXCLUDED.average_diameter,
      is_potentially_hazardous_asteroid = EXCLUDED.is_potentially_hazardous_asteroid,
      close_approach_date = EXCLUDED.close_approach_date,
      miss_distance_km = EXCLUDED.miss_distance_km,
      velocity_kmh = EXCLUDED.velocity_kmh,
      orbiting_body = EXCLUDED.orbiting_body,
      first_observation_date = EXCLUDED.first_observation_date,
      last_observation_date = EXCLUDED.last_observation_date,
      observations_used = EXCLUDED.observations_used,
      orbital_period = EXCLUDED.orbital_period,
      eccentricity = EXCLUDED.eccentricity,
      data_arc_in_days = EXCLUDED.data_arc_in_days,
      nasa_jpl_url = EXCLUDED.nasa_jpl_url
    RETURNING *;
  `;

const results = [];
  for (const asteroid of asteroids) {
    const values = [
      asteroid.neo_reference_id,
      asteroid.name,
      asteroid.estimated_diameter_min,
      asteroid.estimated_diameter_max,
      asteroid.average_diameter,
      asteroid.is_potentially_hazardous_asteroid,
      asteroid.close_approach_date,
      asteroid.miss_distance_km,
      asteroid.velocity_kmh,
      asteroid.orbiting_body,
      asteroid.first_observation_date,
      asteroid.last_observation_date,
      asteroid.observations_used,
      asteroid.orbital_period,
      asteroid.eccentricity,
      asteroid.data_arc_in_days,
      asteroid.nasa_jpl_url,
      asteroid.date_range_start,
      asteroid.date_range_end,
    ];

    const result = await pool.query(insertQuery, values);
    results.push(result.rows[0]);
  }
  return results;
};

/**
 * Endpoint to get asteroid data (fetch from NASA and store it in DB if not available)
 */
app.get('/api/neos/list', async (req, res) => {
  const { startDate, endDate } = req.query; // Get the date range from query parameters

  // Validate date range
  const { error } = checkDate(startDate, endDate);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    // Check if data is already in the database
    const result = await fetchAsteroidsFromDB(pool, startDate, endDate);

    if (result.rows.length > 0) {
      // If data is found in DB, return it
      return res.json({ asteroids: result.rows });
    }

    // If data is not in DB, fetch from NASA API
    const asteroidsFromNASA = await fetchAsteroidDataFromNASA(startDate, endDate);

    // Process and format the asteroid data
    const processedAsteroids = asteroidsFromNASA.map(asteroid => processAsteroid(asteroid, startDate, endDate));

    // Insert new data into the database
    const insertedAsteroids = await insertAsteroidsToDB(pool, processedAsteroids);

    return res.json({ asteroids: insertedAsteroids });

  } catch (err) {
    console.error('Error processing asteroid data:', err);
    return res.status(500).json({ error: 'Failed to process asteroid data' });
  }
});

/**
 * Endpoint to retrieve asteroid data from the database
 */
app.get('/api/neos', async (req, res) => {
  const { startDate, endDate } = req.query; // Get the date range from query parameters

  // Validate date range
  const { error } = checkDate(startDate, endDate);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    //Select asteroid data from DB within the given date range
    const result = await fetchAsteroidsFromDB(pool, startDate, endDate);

    //If no data is found, return an appropriate message
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No asteroid data found for the given date range.' });
    }

    //If data is found, return it to the frontend
    return res.json({ asteroids: result.rows });

  } catch (err) {
    console.error('Error retrieving asteroid data:', err);
    return res.status(500).json({ error: 'Failed to retrieve asteroid data' });
  }
});

/**
 * Graceful shutdown handling
 */
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  pool.end(() => {
    console.log('PostgreSQL connection pool closed');
    process.exit();
  });
});

/**
 * Start the server
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
