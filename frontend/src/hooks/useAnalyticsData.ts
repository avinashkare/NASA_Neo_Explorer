import { useMemo } from 'react';
import { Asteroid } from '../types/asteroid';
import { AnalyticsFilters } from '../components/analytics/AnalyticsContainer';

export interface AnalyticsStatistics {
  totalAsteroids: number;
  hazardousCount: number;
  averageSize: number;
  largestAsteroid: number;
  averageMagnitude: number;
}

export interface AnalyticsData {
  filteredAsteroids: Asteroid[];
  statistics: AnalyticsStatistics;
  hazardDistribution: Array<{ name: string; value: number; color: string }>;
  sizeDistribution: Array<{ name: string; value: number; color: string }>;
  hazardousSizeDistribution: Array<{ name: string; value: number; color: string }>;
  orbitalData: Array<{ subject: string; A: number; fullMark: number }>;
  orbitingBodiesData: Array<{ name: string; value: number; color: string }>;
}

/**
 * Applies filters to the list of asteroids based on the provided filters.
 * @param asteroids - The list of asteroids to filter.
 * @param filters - The filters to apply.
 * @return The filtered list of asteroids.
 */
const applyFilters = (asteroids: Asteroid[], filters: AnalyticsFilters): Asteroid[] => {
  return asteroids.filter(asteroid => {
    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      if (!asteroid.name.toLowerCase().includes(searchLower) && 
          !asteroid.neo_reference_id.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Hazard filter
    if (filters.hazardFilter !== 'all') {
      if (filters.hazardFilter === 'hazardous' && !asteroid.is_potentially_hazardous_asteroid) {
        return false;
      }
      if (filters.hazardFilter === 'safe' && asteroid.is_potentially_hazardous_asteroid) {
        return false;
      }
    }

    // Size filter
    if (filters.sizeFilter !== 'all') {
      const avgSize = (asteroid.estimated_diameter_min + asteroid.estimated_diameter_max) / 2;
      switch (filters.sizeFilter) {
        case 'small':
          if (avgSize >= 50) return false;
          break;
        case 'medium':
          if (avgSize < 50 || avgSize >= 200) return false;
          break;
        case 'large':
          if (avgSize < 200 || avgSize >= 500) return false;
          break;
        case 'massive':
          if (avgSize < 500) return false;
          break;
      }
    }

    // Orbiting body filter
    if (filters.orbitingBodyFilter.length > 0) {
      if (!asteroid.orbiting_body || !filters.orbitingBodyFilter.includes(asteroid.orbiting_body)) {
        return false;
      }
    }

    // Magnitude range filter
    if (asteroid.absolute_magnitude_h < filters.magnitudeRange.min || 
        asteroid.absolute_magnitude_h > filters.magnitudeRange.max) {
      return false;
    }

    return true;
  });
};

/**
 * Fetches and processes analytics data based on the provided asteroid list and filters.
 * @param asteroids - The list of asteroids to analyze.
 * @param filters - The filters to apply to the asteroid data.
 * @returns - An object containing the filtered asteroids and various analytics statistics.
 */
export const useAnalyticsData = (
  asteroids: Asteroid[], 
  filters: AnalyticsFilters
): AnalyticsData => {
  return useMemo(() => {
    const filteredAsteroids = applyFilters(asteroids, filters);

    // Statistics
    const hazardousCount = filteredAsteroids.filter(a => a.is_potentially_hazardous_asteroid).length;
    const sizes = filteredAsteroids.map(a => (a.estimated_diameter_min + a.estimated_diameter_max) / 2);
    const magnitudes = filteredAsteroids.map(a => a.absolute_magnitude_h);

    const statistics: AnalyticsStatistics = {
      totalAsteroids: filteredAsteroids.length,
      hazardousCount,
      averageSize: sizes.length > 0 ? sizes.reduce((a, b) => a + b, 0) / sizes.length : 0,
      largestAsteroid: sizes.length > 0 ? Math.max(...sizes) : 0,
      averageMagnitude: magnitudes.length > 0 ? magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length : 0
    };

    // Hazard Distribution
    const hazardDistribution = [
      { name: 'Potentially Hazardous', value: hazardousCount, color: '#ef4444' },
      { name: 'Safe', value: filteredAsteroids.length - hazardousCount, color: '#22c55e' }
    ];

    // Size Distribution
    const sizeRanges = [
      { name: '< 50m', min: 0, max: 50, color: '#06b6d4' },
      { name: '50-200m', min: 50, max: 200, color: '#3b82f6' },
      { name: '200-500m', min: 200, max: 500, color: '#8b5cf6' },
      { name: '> 500m', min: 500, max: Infinity, color: '#ef4444' }
    ];

    const sizeDistribution = sizeRanges.map(range => ({
      name: range.name,
      value: filteredAsteroids.filter(asteroid => {
        const avgSize = (asteroid.estimated_diameter_min + asteroid.estimated_diameter_max) / 2;
        return avgSize >= range.min && avgSize < range.max;
      }).length,
      color: range.color
    }));

    // Hazardous Size Distribution
    const hazardousAsteroids = filteredAsteroids.filter(a => a.is_potentially_hazardous_asteroid);
    const hazardousSizeDistribution = sizeRanges.map(range => ({
      name: range.name,
      value: hazardousAsteroids.filter(asteroid => {
        const avgSize = (asteroid.estimated_diameter_min + asteroid.estimated_diameter_max) / 2;
        return avgSize >= range.min && avgSize < range.max;
      }).length,
      color: range.color
    }));

    // Orbital Data (Radar Chart)
    const orbitalData = [
      { subject: 'Size', A: Math.min(statistics.averageSize / 5, 100), fullMark: 100 },
      { subject: 'Magnitude', A: Math.min(statistics.averageMagnitude * 5, 100), fullMark: 100 },
      { subject: 'Hazard Rate', A: (hazardousCount / filteredAsteroids.length) * 100, fullMark: 100 },
      { subject: 'Data Quality', A: 85, fullMark: 100 },
      { subject: 'Coverage', A: Math.min((filteredAsteroids.length / 100) * 10, 100), fullMark: 100 }
    ];

    // Orbiting Bodies Data
    const orbitingBodiesMap = new Map<string, number>();
    filteredAsteroids.forEach(asteroid => {
      const body = asteroid.orbiting_body || 'Unknown';
      orbitingBodiesMap.set(body, (orbitingBodiesMap.get(body) || 0) + 1);
    });

    const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#f97316'];
    const orbitingBodiesData = Array.from(orbitingBodiesMap.entries()).map(([body, count], index) => ({
      name: body,
      value: count,
      color: colors[index % colors.length]
    }));

    return {
      filteredAsteroids,
      statistics,
      hazardDistribution,
      sizeDistribution,
      hazardousSizeDistribution,
      orbitalData,
      orbitingBodiesData
    };
  }, [asteroids, filters]);
};