import React, { useState } from 'react';
import { Asteroid } from '../../types/asteroid';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsFilters } from './AnalyticsFilters';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AnalyticsInsights } from './AnalyticsInsights';
import { AsteroidTable } from './AsteroidTable';
import { useAnalyticsData } from '../../hooks/useAnalyticsData';

export interface AnalyticsFilters {
  searchTerm: string;
  hazardFilter: 'all' | 'hazardous' | 'safe';
  sizeFilter: 'all' | 'small' | 'medium' | 'large' | 'massive';
  orbitingBodyFilter: string[];
  magnitudeRange: {
    min: number;
    max: number;
  };
}

interface AnalyticsContainerProps {
  asteroids: Asteroid[];
  onBack: () => void;
}

export const AnalyticsContainer: React.FC<AnalyticsContainerProps> = ({ 
  asteroids, 
  onBack 
}) => {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    searchTerm: '',
    hazardFilter: 'all',
    sizeFilter: 'all',
    orbitingBodyFilter: [],
    magnitudeRange: {
      min: 0,
      max: 35
    }
  });

  const [selectedChart, setSelectedChart] = useState<string>('overview');
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);

  const analyticsData = useAnalyticsData(asteroids, filters);

  const handleFilterChange = (newFilters: Partial<AnalyticsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Show table when there's a search term or other filters applied
  const showTable = filters.searchTerm || 
                   filters.hazardFilter !== 'all' || 
                   filters.sizeFilter !== 'all' || 
                   filters.orbitingBodyFilter.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <AnalyticsHeader 
        onBack={onBack}
        totalAsteroids={asteroids.length}
        filteredCount={analyticsData.filteredAsteroids.length}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <AnalyticsFilters 
          filters={filters}
          onFiltersChange={handleFilterChange}
          asteroids={asteroids}
        />

        <AnalyticsInsights 
          statistics={analyticsData.statistics}
          filteredAsteroids={analyticsData.filteredAsteroids}
        />

        <AnalyticsCharts 
          data={analyticsData}
          selectedChart={selectedChart}
          onChartChange={setSelectedChart}
        />

        {/* Show filtered asteroid table when search/filters are applied */}
        {showTable && (
          <AsteroidTable 
            asteroids={analyticsData.filteredAsteroids}
            selectedAsteroid={selectedAsteroid}
            onAsteroidSelect={setSelectedAsteroid}
          />
        )}
      </main>
    </div>
  );
};