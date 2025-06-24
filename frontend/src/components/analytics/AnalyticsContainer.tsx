import React, { useState } from 'react';
import { Asteroid } from '../../types/asteroid';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsFilters } from './AnalyticsFilters';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AnalyticsInsights } from './AnalyticsInsights';
import { AnalyticsExport } from './AnalyticsExport';
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
  const [showExportModal, setShowExportModal] = useState(false);

  const analyticsData = useAnalyticsData(asteroids, filters);

  const handleFilterChange = (newFilters: Partial<AnalyticsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExportData = (format: 'json' | 'csv' | 'pdf') => {
    // Export functionality implementation
    console.log(`Exporting data as ${format}`);
    setShowExportModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <AnalyticsHeader 
        onBack={onBack}
        totalAsteroids={asteroids.length}
        filteredCount={analyticsData.filteredAsteroids.length}
        onExport={() => setShowExportModal(true)}
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
      </main>

      {showExportModal && (
        <AnalyticsExport 
          data={analyticsData.filteredAsteroids}
          onExport={handleExportData}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};