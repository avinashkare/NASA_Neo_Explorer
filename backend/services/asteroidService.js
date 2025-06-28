const pool = require('../db');

/**
 * Service for asteroid database operations
 */
class AsteroidService {
  /**
   * Check if the date range exists in the database and return missing date intervals
   * @param {String} startDate - The start date in 'YYYY-MM-DD' format
   * @param {String} endDate - The end date in 'YYYY-MM-DD' format
   * @returns {Promise} - Database query result
   */
  static async checkMissingDateRanges(startDate, endDate) {
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
      order by ser
    `;
    return pool.query(query, [startDate, endDate]);
  }

  /**
   * Function to fetch asteroid data from the database
   * @param {String} startDate - The start date in 'YYYY-MM-DD' format
   * @param {String} endDate - The end date in 'YYYY-MM-DD' format
   * @returns {Promise} - Database query result
   */
  static async fetchFromDatabase(startDate, endDate) {
    const query = `
      SELECT * FROM asteroids WHERE date_range_start between $1 AND $2
    `;
    return pool.query(query, [startDate, endDate]);
  }

  /**
   * Function to insert asteroid data into the database
   * @param {Array<Object>} asteroids - The array of asteroid objects to be inserted
   * @returns {Array} - Array of inserted asteroid records
   */
  static async insertToDatabase(asteroids) {
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
  }
}

module.exports = AsteroidService;