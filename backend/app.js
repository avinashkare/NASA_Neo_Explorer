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
 * Check if the date range exists in the database
 * @param {Date} startDate - The start date in 'YYYY-MM-DD' format
 * @param {Date} endDate - The end date in 'YYYY-MM-DD' format
 * @returns 
 */
const checkDateRangeDatabase = (startDate, endDate) => {
  const query = `
    with astro_tmp as (
      select
        date_range_start
      from 
        asteroids
      where 
        date_range_start between $1 and $2
      group by 1
    )
    select
      ser::date start_date
    from
      generate_series($1::date, $2::date, '1 day') as ser
    left join astro_tmp a on a.date_range_start = ser::date
    where 
      a.date_range_start is null
  `
  return pool.query(query, [startDate, endDate]);
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
    SELECT * FROM asteroids WHERE date_range_start between $1 AND $2
  `;
  return pool.query(query, [startDate, endDate]);
};

/**
 * Function to flatten the NEO data from NASA API response
 * @param {JSON} neoData - The NEO data object from NASA API response
 * @returns 
 */
const flattenNEOData = (neoData) =>{
  const result = [];
  for (const date in neoData.near_earth_objects) {
    const neos = neoData.near_earth_objects[date];

    neos.forEach(neo => {
      const approach = neo.close_approach_data[0]; // Use the first approach data only

      result.push({
        id: neo.id,
        neo_reference_id: neo.neo_reference_id,
        name: neo.name,
        absolute_magnitude_h: neo.absolute_magnitude_h,
        estimated_diameter_km_min: neo.estimated_diameter.kilometers.estimated_diameter_min,
        estimated_diameter_km_max: neo.estimated_diameter.kilometers.estimated_diameter_max,
        estimated_diameter: neo.estimated_diameter,
        is_potentially_hazardous_asteroid: neo.is_potentially_hazardous_asteroid,
        close_approach_date: approach.close_approach_date,
        miss_distance_km: parseFloat(approach.miss_distance.kilometers),
        relative_velocity_kph: parseFloat(approach.relative_velocity.kilometers_per_hour),
        orbiting_body: approach.orbiting_body,
        query_date: date
      });
    });
  }
  return result;
}

/**
 * Function to fetch asteroid data from NASA API
 * @param {String} startDate - The start date in 'YYYY-MM-DD' format 
 * @param {String} endDate - The end date in 'YYYY-MM-DD' format 
 * @returns 
 */
const fetchAsteroidDataFromNASA = async (startDate, endDate) => {
  try {
    const response = await axios.get(process.env.NASA_BASE_URL + '/feed', {
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
};

/**
 * Function to process asteroid data
 * @param {Object} asteroid - The asteroid object from NASA API
 * @param {String} startDate - The start date in 'YYYY-MM-DD' format 
 * @param {String} endDate - The end date in 'YYYY-MM-DD' format  
 * @returns 
 */
const processAsteroid = (asteroid) => {
  const {
    neo_reference_id,
    name,
    estimated_diameter,
    is_potentially_hazardous_asteroid,
    close_approach_data,
    orbital_data,
    nasa_jpl_url,
    query_date,
  } = asteroid;

  // Extract diameter data
  const diameterMin = estimated_diameter.meters.estimated_diameter_min;
  const diameterMax = estimated_diameter.meters.estimated_diameter_max;
  const averageDiameter = (diameterMin + diameterMax) / 2;

  // Extract the closest approach data (use the first record)
  const closeApproach = close_approach_data?.[0] || {};
  const closeApproachDate = closeApproach.close_approach_date;
  const missDistanceKm = closeApproach.miss_distance?.kilometers || 0;
  const velocityKmh = closeApproach.relative_velocity?.kilometers_per_hour || 0;
  const orbitingBody = closeApproach.orbiting_body || '';

  // Extract orbital data
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
    observations_used: observationsUsed,
    orbital_period: orbitalPeriod,
    eccentricity: eccentricity,
    data_arc_in_days: dataArcInDays,
    nasa_jpl_url,
    date_range_start: query_date,
    date_range_end: query_date,
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
      observations_used,
      orbital_period,
      eccentricity,
      data_arc_in_days,
      nasa_jpl_url,
      date_range_start,
      date_range_end
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    ON CONFLICT (neo_reference_id) 
    DO 
    Update SET
      date_range_start = LEAST(asteroids.date_range_start, EXCLUDED.date_range_start),
      date_range_end = GREATEST(asteroids.date_range_end, EXCLUDED.date_range_end)
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
app.get('/neos/list', async (req, res) => {
  const { startDate, endDate } = req.query; // Get the date range from query parameters

  // Validate date range
  const { error } = checkDate(startDate, endDate);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const dateRangeCheck = await checkDateRangeDatabase(startDate, endDate);
    if (dateRangeCheck.rows.length > 0) {
      // call NASA API to fetch data for the missing dates
      for (const rec of dateRangeCheck.rows) {
        console.log('Data not found in db:', rec);
        // If data is not in DB, fetch from NASA API
        const asteroidsFromNASA = await fetchAsteroidDataFromNASA(rec.start_date, rec.start_date);
        // Process and format the asteroid data
        const processedAsteroids = asteroidsFromNASA.map(asteroid => processAsteroid(asteroid));
        // Insert new data into the database
        await insertAsteroidsToDB(pool, processedAsteroids);
      }
    }

    // Check if data is already in the database
    const result = await fetchAsteroidsFromDB(pool, startDate, endDate);

    if (result.rows.length > 0) {
      // If data is found in DB, return it
      return res.json({ asteroids: result.rows });
    }

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
