import { useMemo } from 'react';
import { Asteroid } from '../types/asteroid';
import { AnalyticsFilters } from '../components/analytics/AnalyticsContainer';

export interface AnalyticsStatistics {
  totalAsteroids: number;
  hazardousCount: number;
  averageSize: number;
  largestAsteroid: number;
  averageMagnitude: number;
  averageVelocity: number;
  averageMissDistance: number;
  totalApproaches: number;
}

export interface AnalyticsData {
  filteredAsteroids: Asteroid[];
  statistics: AnalyticsStatistics;
  hazardDistribution: Array<{ name: string; value: number; color: string }>;
  sizeDistribution: Array<{ name: string; value: number; color: string }>;
  hazardousSizeDistribution: Array<{ name: string; value: number; color: string }>;
  velocityDistribution: Array<{ name: string; value: number; color: string }>;
  missDistanceDistribution: Array<{ name: string; value: number; color: string }>;
  magnitudeDistribution: Array<{ name: string; value: number; color: string }>;
  sizeVsVelocityData: Array<{ x: number; y: number; name: string; hazardous: boolean; color: string }>;
  timeSeriesData: Array<{ date: string; count: number; x: string; y: number }>;
  riskAssessmentData: Array<{ subject: string; A: number; fullMark: number }>;
  approachFrequencyData: Array<{ name: string; value: number; color: string }>;
}

/**
 * Applies filters to the list of asteroids based on the provided filters.
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
      const orbitingBody = asteroid.orbiting_body || 
                          asteroid.close_approach_data?.[0]?.orbiting_body;
      if (!orbitingBody || !filters.orbitingBodyFilter.includes(orbitingBody)) {
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
 * Safely extracts numeric values with fallbacks
 */
const safeNumeric = (value: any, fallback: number = 0): number => {
  const num = parseFloat(value);
  return isNaN(num) || !isFinite(num) ? fallback : num;
};

/**
 * Fetches and processes analytics data based on the provided asteroid list and filters.
 */
export const useAnalyticsData = (
  asteroids: Asteroid[], 
  filters: AnalyticsFilters
): AnalyticsData => {
  return useMemo(() => {
    const filteredAsteroids = applyFilters(asteroids, filters);

    // Calculate statistics with proper data extraction
    const hazardousCount = filteredAsteroids.filter(a => a.is_potentially_hazardous_asteroid).length;
    
    const sizes = filteredAsteroids.map(a => 
      safeNumeric((a.estimated_diameter_min + a.estimated_diameter_max) / 2)
    ).filter(size => size > 0);
    
    const magnitudes = filteredAsteroids.map(a => 
      safeNumeric(a.absolute_magnitude_h)
    ).filter(mag => mag > 0);

    const velocities = filteredAsteroids.map(a => {
      const vel = a.velocity_kmh || 
                  a.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour;
      return safeNumeric(vel);
    }).filter(vel => vel > 0);

    const missDistances = filteredAsteroids.map(a => {
      const distance = a.miss_distance_km || 
                      a.close_approach_data?.[0]?.miss_distance?.kilometers;
      return safeNumeric(distance);
    }).filter(dist => dist > 0);

    const statistics: AnalyticsStatistics = {
      totalAsteroids: filteredAsteroids.length,
      hazardousCount,
      averageSize: sizes.length > 0 ? sizes.reduce((a, b) => a + b, 0) / sizes.length : 0,
      largestAsteroid: sizes.length > 0 ? Math.max(...sizes) : 0,
      averageMagnitude: magnitudes.length > 0 ? magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length : 0,
      averageVelocity: velocities.length > 0 ? velocities.reduce((a, b) => a + b, 0) / velocities.length : 0,
      averageMissDistance: missDistances.length > 0 ? missDistances.reduce((a, b) => a + b, 0) / missDistances.length : 0,
      totalApproaches: filteredAsteroids.reduce((total, asteroid) => 
        total + (asteroid.close_approach_data?.length || 0), 0)
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
        const avgSize = safeNumeric((asteroid.estimated_diameter_min + asteroid.estimated_diameter_max) / 2);
        return avgSize >= range.min && avgSize < range.max;
      }).length,
      color: range.color
    }));

    // Hazardous Size Distribution
    const hazardousAsteroids = filteredAsteroids.filter(a => a.is_potentially_hazardous_asteroid);
    const hazardousSizeDistribution = sizeRanges.map(range => ({
      name: range.name,
      value: hazardousAsteroids.filter(asteroid => {
        const avgSize = safeNumeric((asteroid.estimated_diameter_min + asteroid.estimated_diameter_max) / 2);
        return avgSize >= range.min && avgSize < range.max;
      }).length,
      color: range.color
    }));

    // Velocity Distribution
    const velocityRanges = [
      { name: '< 20,000 km/h', min: 0, max: 20000, color: '#10b981' },
      { name: '20-50k km/h', min: 20000, max: 50000, color: '#06b6d4' },
      { name: '50-100k km/h', min: 50000, max: 100000, color: '#f59e0b' },
      { name: '> 100k km/h', min: 100000, max: Infinity, color: '#ef4444' }
    ];

    const velocityDistribution = velocityRanges.map(range => ({
      name: range.name,
      value: filteredAsteroids.filter(asteroid => {
        const vel = asteroid.velocity_kmh || 
                   asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour;
        const velocity = safeNumeric(vel);
        return velocity >= range.min && velocity < range.max;
      }).length,
      color: range.color
    }));

    // Miss Distance Distribution
    const distanceRanges = [
      { name: '< 1M km', min: 0, max: 1000000, color: '#ef4444' },
      { name: '1-10M km', min: 1000000, max: 10000000, color: '#f59e0b' },
      { name: '10-50M km', min: 10000000, max: 50000000, color: '#06b6d4' },
      { name: '> 50M km', min: 50000000, max: Infinity, color: '#10b981' }
    ];

    const missDistanceDistribution = distanceRanges.map(range => ({
      name: range.name,
      value: filteredAsteroids.filter(asteroid => {
        const dist = asteroid.miss_distance_km || 
                    asteroid.close_approach_data?.[0]?.miss_distance?.kilometers;
        const distance = safeNumeric(dist);
        return distance >= range.min && distance < range.max;
      }).length,
      color: range.color
    }));

    // Magnitude Distribution
    const magnitudeRanges = [
      { name: '< 15', min: 0, max: 15, color: '#ef4444' },
      { name: '15-20', min: 15, max: 20, color: '#f59e0b' },
      { name: '20-25', min: 20, max: 25, color: '#06b6d4' },
      { name: '25-30', min: 25, max: 30, color: '#10b981' },
      { name: '> 30', min: 30, max: Infinity, color: '#6b7280' }
    ];

    const magnitudeDistribution = magnitudeRanges.map(range => ({
      name: range.name,
      value: filteredAsteroids.filter(asteroid => {
        const mag = safeNumeric(asteroid.absolute_magnitude_h);
        return mag >= range.min && mag < range.max;
      }).length,
      color: range.color
    }));

    // Size vs Velocity Scatter Plot Data
    const sizeVsVelocityData = filteredAsteroids.map(asteroid => {
      const size = safeNumeric((asteroid.estimated_diameter_min + asteroid.estimated_diameter_max) / 2);
      const vel = asteroid.velocity_kmh || 
                 asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour;
      const velocity = safeNumeric(vel);
      
      return {
        x: size,
        y: velocity,
        name: asteroid.name,
        hazardous: asteroid.is_potentially_hazardous_asteroid,
        color: asteroid.is_potentially_hazardous_asteroid ? '#ef4444' : '#06b6d4'
      };
    }).filter(d => d.x > 0 && d.y > 0);

    // Time Series Data (by approach date)
    const dateMap = new Map<string, number>();
    filteredAsteroids.forEach(asteroid => {
      const date = asteroid.close_approach_date || 
                  asteroid.close_approach_data?.[0]?.close_approach_date;
      if (date) {
        const dateKey = new Date(date).toISOString().split('T')[0];
        dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
      }
    });

    const timeSeriesData = Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date,
        count,
        x: date,
        y: count
      }));

    // Risk Assessment Radar Data
    const avgHazardRatio = hazardousCount / Math.max(filteredAsteroids.length, 1);
    const avgSizeNormalized = Math.min((statistics.averageSize / 1000) * 100, 100);
    const avgVelocityNormalized = Math.min((statistics.averageVelocity / 100000) * 100, 100);
    const avgDistanceScore = Math.max(0, 100 - (statistics.averageMissDistance / 100000000) * 100);
    const dataQualityScore = filteredAsteroids.filter(a => 
      a.close_approach_data && a.close_approach_data.length > 0
    ).length / Math.max(filteredAsteroids.length, 1) * 100;

    const riskAssessmentData = [
      { subject: 'Hazard Ratio', A: avgHazardRatio * 100, fullMark: 100 },
      { subject: 'Average Size', A: avgSizeNormalized, fullMark: 100 },
      { subject: 'Velocity Risk', A: avgVelocityNormalized, fullMark: 100 },
      { subject: 'Proximity Risk', A: avgDistanceScore, fullMark: 100 },
      { subject: 'Data Quality', A: dataQualityScore, fullMark: 100 }
    ];

    // Approach Frequency Data
    const monthMap = new Map<string, number>();
    filteredAsteroids.forEach(asteroid => {
      const date = asteroid.close_approach_date || 
                  asteroid.close_approach_data?.[0]?.close_approach_date;
      if (date) {
        const month = new Date(date).toLocaleDateString('en-US', { month: 'short' });
        monthMap.set(month, (monthMap.get(month) || 0) + 1);
      }
    });

    const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#f97316', '#ec4899', '#06b6d4', '#84cc16', '#6366f1', '#14b8a6', '#f43f5e'];
    const approachFrequencyData = Array.from(monthMap.entries()).map(([month, count], index) => ({
      name: month,
      value: count,
      color: colors[index % colors.length]
    }));

    return {
      filteredAsteroids,
      statistics,
      hazardDistribution,
      sizeDistribution,
      hazardousSizeDistribution,
      velocityDistribution,
      missDistanceDistribution,
      magnitudeDistribution,
      sizeVsVelocityData,
      timeSeriesData,
      riskAssessmentData,
      approachFrequencyData
    };
  }, [asteroids, filters]);
};