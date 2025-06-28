/**
 * Utility functions for processing asteroid data
 */

/**
 * Function to flatten the NEO data from NASA API response
 * @param {Object} neoData - The NEO data object from NASA API response
 * @returns {Array} - Flattened array of asteroid objects
 */
const flattenNEOData = (neoData) => {
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
        nasa_jpl_url: neo.nasa_jpl_url,
        query_date: date
      });
    });
  }
  return result;
};

/**
 * Function to process asteroid data
 * @param {Object} asteroid - The asteroid object from NASA API
 * @returns {Object} - Processed asteroid object
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
    close_approach_date,
    miss_distance_km,
    relative_velocity_kph,
    orbiting_body,
  } = asteroid;

  // Extract diameter data
  const diameterMin = estimated_diameter?.meters?.estimated_diameter_min
    ?? asteroid.estimated_diameter_km_min * 1000
    ?? 0;
  const diameterMax = estimated_diameter?.meters?.estimated_diameter_max
    ?? asteroid.estimated_diameter_km_max * 1000
    ?? 0;
  const averageDiameter = (diameterMin + diameterMax) / 2;

  // fallback to nested if flattened data is not available
  const closeApproachDate = close_approach_date
    || close_approach_data?.[0]?.close_approach_date
    || '';
  const missDistanceKm = miss_distance_km
    || close_approach_data?.[0]?.miss_distance?.kilometers
    || 0;
  const velocityKmh = relative_velocity_kph
    || close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour
    || 0;
  const orbitingBody = orbiting_body
    || close_approach_data?.[0]?.orbiting_body
    || '';

  // Extract orbital data
  const observationsUsed = orbital_data?.observations_used || 0;
  const orbitalPeriod = orbital_data?.orbital_period || 0;
  const eccentricity = orbital_data?.eccentricity || 0;
  const dataArcInDays = orbital_data?.data_arc_in_days || 0;

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

module.exports = {
  flattenNEOData,
  processAsteroid
};