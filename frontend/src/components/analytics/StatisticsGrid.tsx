import React from 'react';
import { AlertTriangle, Ruler, Globe, Activity} from 'lucide-react';
import { AnalyticsStatistics } from '../../hooks/useAnalyticsData';

interface StatisticsGridProps {
  statistics: AnalyticsStatistics;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = ({ statistics }) => {
  const stats = [
    {
      label: 'Total Asteroids',
      value: statistics.totalAsteroids.toLocaleString(),
      icon: <Activity className="text-cyan-400" size={20} />,
      color: 'cyan'
    },
    {
      label: 'Hazardous Objects',
      value: statistics.hazardousCount.toLocaleString(),
      icon: <AlertTriangle className="text-red-400" size={20} />,
      color: 'red'
    },
    {
      label: 'Average Size',
      value: `${statistics.averageSize.toFixed(1)}m`,
      icon: <Ruler className="text-blue-400" size={20} />,
      color: 'blue'
    },
  
    {
      label: 'Largest Asteroid',
      value: `${statistics.largestAsteroid.toFixed(0)}m`,
      icon: <Globe className="text-purple-400" size={20} />,
      color: 'purple'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-2">
            {stat.icon}
            <span className="text-sm text-gray-400">{stat.label}</span>
          </div>
          <div className="text-xl font-bold text-white">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};