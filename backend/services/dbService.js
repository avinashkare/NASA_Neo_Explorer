const pool = require('../db');

/**
 * Check for missing dates in the database
 * @param {string} start_date - Start date in YYYY-MM-DD format
 * @param {string} end_date - End date in YYYY-MM-DD format
 * @returns {Array} Array of missing dates
 */
const checkDateRangeDatabase = async (start_date, end_date) => {
  const query = `
    SELECT generate_series($1::date, $2::date, '1 day'::interval) AS date
    EXCEPT
    SELECT DISTINCT date FROM asteroids WHERE date BETWEEN $1 AND $2
  `;
  const res = await pool.query(query, [start_date, end_date]);
  return res.rows.map(row => row.date);
};

/**
 * Fetch asteroid data from database
 * @param {string} start_date - Start date in YYYY-MM-DD format
 * @param {string} end_date - End date in YYYY-MM-DD format
 * @returns {Array} Array of asteroid objects
 */
const fetchAsteroidsFromDB = async (start_date, end_date) => {
  const query = 'SELECT * FROM asteroids WHERE date BETWEEN $1 AND $2';
  const res = await pool.query(query, [start_date, end_date]);
  return res.rows;
};

/**
 * Insert or update asteroid data in database
 * @param {Array} asteroids - Array of asteroid objects
 */
const insertAsteroidsToDB = async (asteroids) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const asteroid of asteroids) {
      const query = `
        INSERT INTO asteroids (name, nasa_jpl_url, absolute_magnitude_h, estimated_diameter_min, estimated_diameter_max, is_potentially_hazardous, close_approach_date, relative_velocity, miss_distance, orbiting_body, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (name, date) DO UPDATE SET
          nasa_jpl_url = EXCLUDED.nasa_jpl_url,
          absolute_magnitude_h = EXCLUDED.absolute_magnitude_h,
          estimated_diameter_min = EXCLUDED.estimated_diameter_min,
          estimated_diameter_max = EXCLUDED.estimated_diameter_max,
          is_potentially_hazardous = EXCLUDED.is_potentially_hazardous,
          close_approach_date = EXCLUDED.close_approach_date,
          relative_velocity = EXCLUDED.relative_velocity,
          miss_distance = EXCLUDED.miss_distance,
          orbiting_body = EXCLUDED.orbiting_body
      `;
      await client.query(query, [
        asteroid.name,
        asteroid.nasa_jpl_url,
        asteroid.absolute_magnitude_h,
        asteroid.estimated_diameter_min,
        asteroid.estimated_diameter_max,
        asteroid.is_potentially_hazardous,
        asteroid.close_approach_date,
        asteroid.relative_velocity,
        asteroid.miss_distance,
        asteroid.orbiting_body,
        asteroid.date
      ]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { checkDateRangeDatabase, fetchAsteroidsFromDB, insertAsteroidsToDB };