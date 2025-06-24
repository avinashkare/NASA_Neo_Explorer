export interface Asteroid {
  id: string;
  neo_reference_id: string;
  name: string;
  designation: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;

  estimated_diameter_min: number;
  estimated_diameter_max: number;

  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  orbital_data: OrbitalData;
  is_sentry_object: boolean;

  // Additional fields from your database
  average_diameter?: number;
  close_approach_date?: string;
  miss_distance_km?: string;
  velocity_kmh?: string;
  orbiting_body?: string;
  first_observation_date?: string;
  last_observation_date?: string;
  observations_used?: string;
  orbital_period?: string;
  eccentricity?: string;
  data_arc_in_days?: number;
  date_range_start?: string;
  date_range_end?: string;
}

export interface CloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

export interface OrbitalData {
  orbit_id: string;
  orbit_determination_date: string;
  first_observation_date: string;
  last_observation_date: string;
  data_arc_in_days: number;
  observations_used: number;
  orbit_uncertainty: string;
  minimum_orbit_intersection: string;
  jupiter_tisserand_invariant: string;
  epoch_osculation: string;
  eccentricity: string;
  semi_major_axis: string;
  inclination: string;
  ascending_node_longitude: string;
  orbital_period: string;
  perihelion_distance: string;
  perihelion_argument: string;
  aphelion_distance: string;
  perihelion_time: string;
  mean_anomaly: string;
  mean_motion: string;
}

export interface ApiResponse {
  links: {
    next: string;
    prev: string;
    self: string;
  };
  page: {
    size: number;
    total_elements: number;
    total_pages: number;
    number: number;
  };
  asteroids: Asteroid[];
}

export interface SizeComparison {
  name: string;
  height: number; // in meters
  description: string;
}