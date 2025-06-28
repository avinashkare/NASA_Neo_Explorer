/**
 * Flatten NASA NEO data into a simpler structure
 * @param {Object} data - NASA API response data
 * @returns {Array} Flattened array of asteroid objects
 */
const flattenNEOData = (data) => {
  const asteroids = [];
  for (const date in data.near_earth_objects) {
    for (const asteroid of data.near_earth_objects[date]) {
      asteroids.push({
        name: asteroid.name,
        nasa_jpl_url: asteroid.nasa_jpl_url,
        absolute_magnitude_h: asteroid.absolute_magnitude_h,
        estimated_diameter_min: asteroid.estimated_diameter.kilometers.estimated_diameter_min,
        estimated_diameter_max: asteroid.estimated_diameter.kilometers.estimated_diameter_max,
        is_potentially_hazardous: asteroid.is_potentially_hazardous_asteroid,
        close_approach_date: asteroid.close_approach_data[0]?.close_approach_date,
        relative_velocity: asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_hour,
        miss_distance: asteroid.close_approach_data[0]?.miss_distance.kilometers,
        orbiting_body: asteroid.close_approach_data[0]?.orbiting_body,
        date
      });
    }
  }
  return asteroids;
};

/**
 * Process asteroid data, calculating derived values
 * @param {Object} asteroid - Raw asteroid data
 * @returns {Object} Processed asteroid data
 */
const processAsteroid = (asteroid) => {
  return {
    ...asteroid,
    estimated_diameter_avg: (asteroid.estimated_diameter_min + asteroid.estimated_diameter_max) / 2
  };
};

/**
 * Merge consecutive dates into intervals
 * @param {Array} dates - Array of dates
 * @returns {Array} Array of date intervals
 */
const mergeDateIntervals = (dates) => {
  if (!dates.length) return [];
  dates.sort();
  const intervals = [];
  let start = dates[0];
  let end = dates[0];

  for (let i = 1; i < dates.length; i++) {
    const nextDate = new Date(dates[i]);
    const prevDate = new Date(end);
    prevDate.setDate(prevDate.getDate() + 1);

    if (nextDate.getTime() === prevDate.getTime()) {
      end = dates[i];
    } else {
      intervals.push({ start, end });
      start = dates[i];
      end = dates[i];
    }
  }
  intervals.push({ start, end });
  return intervals;
};

module.exports = { flattenNEOData, processAsteroid, mergeDateIntervals };