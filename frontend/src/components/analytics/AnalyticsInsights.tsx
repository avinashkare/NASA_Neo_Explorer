import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Ruler, 
  Globe, 
  Database,
  Zap,
  Target
} from 'lucide-react';
import { AnalyticsStatistics } from '../../hooks/useAnalyticsData';
import { Asteroid } from '../../types/asteroid';

interface AnalyticsInsightsProps {
  statistics: AnalyticsStatistics;
  filteredAsteroids: Asteroid[];
}

export const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({ 
  statistics
}) => {
  const insights = [
    {
      title: 'Total Asteroids',
      value: statistics.totalAsteroids.toLocaleString(),
      icon: <Database className="text-cyan-400" size={24} />,
      color: 'cyan',
      change: null,
      description: 'Objects in current dataset'
    },
    {
      title: 'Hazardous Objects',
      value: statistics.hazardousCount.toLocaleString(),
      icon: <AlertTriangle className="text-red-400" size={24} />,
      color: 'red',
      change: `${((statistics.hazardousCount / Math.max(statistics.totalAsteroids, 1)) * 100).toFixed(1)}%`,
      description: 'Potentially hazardous asteroids'
    },
    {
      title: 'Average Size',
      value: `${statistics.averageSize.toFixed(1)}m`,
      icon: <Ruler className="text-blue-400" size={24} />,
      color: 'blue',
      change: null,
      description: 'Mean diameter across dataset'
    },
    {
      title: 'Largest Asteroid',
      value: `${statistics.largestAsteroid.toFixed(0)}m`,
      icon: <Globe className="text-purple-400" size={24} />,
      color: 'purple',
      change: null,
      description: 'Maximum diameter found'
    },
    {
      title: 'Average Velocity',
      value: `${(statistics.averageVelocity / 1000).toFixed(1)}k km/h`,
      icon: <Zap className="text-yellow-400" size={24} />,
      color: 'yellow',
      change: null,
      description: 'Mean approach velocity'
    },
    {
      title: 'Average Miss Distance',
      value: `${(statistics.averageMissDistance / 1000000).toFixed(1)}M km`,
      icon: <Target className="text-green-400" size={24} />,
      color: 'green',
      change: null,
      description: 'Mean distance from Earth'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      cyan: 'from-cyan-600/20 to-cyan-800/20 border-cyan-500/30',
      red: 'from-red-600/20 to-red-800/20 border-red-500/30',
      blue: 'from-blue-600/20 to-blue-800/20 border-blue-500/30',
      purple: 'from-purple-600/20 to-purple-800/20 border-purple-500/30',
      yellow: 'from-yellow-600/20 to-yellow-800/20 border-yellow-500/30',
      green: 'from-green-600/20 to-green-800/20 border-green-500/30'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.cyan;
  };

  // Enhanced key insights based on data
  const keyInsights = [
    {
      title: 'Risk Assessment',
      description: `${((statistics.hazardousCount / Math.max(statistics.totalAsteroids, 1)) * 100).toFixed(1)}% of tracked asteroids are potentially hazardous`,
      type: statistics.hazardousCount > statistics.totalAsteroids * 0.1 ? 'warning' : 'info',
      icon: <AlertTriangle size={20} />
    },
    {
      title: 'Size Analysis',
      description: statistics.averageSize > 100 ? 
        `Large objects detected - average size ${statistics.averageSize.toFixed(0)}m indicates significant objects` : 
        `Mostly small to medium objects - average size ${statistics.averageSize.toFixed(0)}m`,
      type: 'info',
      icon: <Ruler size={20} />
    },
    {
      title: 'Velocity Patterns',
      description: statistics.averageVelocity > 50000 ? 
        'High-speed objects detected - enhanced monitoring recommended' : 
        'Normal velocity range observed across the dataset',
      type: statistics.averageVelocity > 75000 ? 'warning' : 'info',
      icon: <Zap size={20} />
    },
    {
      title: 'Proximity Analysis',
      description: statistics.averageMissDistance < 10000000 ? 
        'Close approaches detected - objects passing within 10M km of Earth' : 
        'Safe distances maintained - most objects pass at comfortable distances',
      type: statistics.averageMissDistance < 5000000 ? 'warning' : 'info',
      icon: <Target size={20} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${getColorClasses(insight.color)} rounded-xl p-4 border hover:border-opacity-60 transition-all duration-300 group`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-gray-700/50 transition-colors">
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  {insight.title}
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">
                {insight.value}
              </div>
              {insight.change && (
                <div className="text-sm text-gray-300">
                  {insight.change} of total
                </div>
              )}
              <div className="text-xs text-gray-400">
                {insight.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="text-purple-400" size={20} />
          Advanced Analytics Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyInsights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                insight.type === 'warning'
                  ? 'bg-red-900/20 border-red-600/30 hover:border-red-500/50'
                  : 'bg-blue-900/20 border-blue-600/30 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  insight.type === 'warning' ? 'bg-red-600/20' : 'bg-blue-600/20'
                }`}>
                  <div className={insight.type === 'warning' ? 'text-red-400' : 'text-blue-400'}>
                    {insight.icon}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Metrics */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">{statistics.totalApproaches}</div>
              <div className="text-sm text-gray-400">Total Approaches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{statistics.averageMagnitude.toFixed(1)}</div>
              <div className="text-sm text-gray-400">Avg Magnitude</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{(statistics.averageVelocity / 1000).toFixed(0)}k</div>
              <div className="text-sm text-gray-400">Avg Speed (km/h)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{(statistics.averageMissDistance / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-400">Avg Distance (km)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};