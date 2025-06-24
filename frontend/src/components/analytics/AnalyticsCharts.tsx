import React from 'react';
import { 
  PieChart, 
  BarChart3, 
  Activity, 
  Target,
  Orbit
} from 'lucide-react';
import { AnalyticsCard } from './AnalyticsCard';
import { PieChartComponent } from './charts/PieChartComponent';
import { BarChartComponent } from './charts/BarChartComponent';
import { RadarChartComponent } from './charts/RadarChartComponent';
import { AnalyticsData } from '../../hooks/useAnalyticsData';

interface AnalyticsChartsProps {
  data: AnalyticsData;
  selectedChart: string;
  onChartChange: (chartId: string) => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  data,
  selectedChart,
  onChartChange
}) => {
  const chartConfigs = [
    {
      id: 'overview',
      title: 'Overview Dashboard',
      description: 'Key metrics and distributions',
      icon: Activity,
      component: () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsCard
            title="Hazard Distribution"
            icon={<Target className="text-red-400" size={20} />}
            description="Potentially hazardous vs safe asteroids"
          >
            <PieChartComponent data={data.hazardDistribution} />
          </AnalyticsCard>
          
          <AnalyticsCard
            title="Size Categories"
            icon={<BarChart3 className="text-blue-400" size={20} />}
            description="Distribution by diameter ranges"
          >
            <BarChartComponent data={data.sizeDistribution} />
          </AnalyticsCard>
        </div>
      )
    },
    {
      id: 'hazard-analysis',
      title: 'Hazard Analysis',
      description: 'Detailed potentially hazardous object analysis',
      icon: Target,
      component: () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsCard
            title="Hazard Distribution"
            icon={<PieChart className="text-red-400" size={20} />}
            description="Hazardous vs safe classification"
          >
            <PieChartComponent data={data.hazardDistribution} />
          </AnalyticsCard>
          
          <AnalyticsCard
            title="Hazard by Size"
            icon={<BarChart3 className="text-orange-400" size={20} />}
            description="Size distribution of hazardous objects"
          >
            <BarChartComponent data={data.hazardousSizeDistribution} />
          </AnalyticsCard>
        </div>
      )
    },
    {
      id: 'orbital-analysis',
      title: 'Orbital Analysis',
      description: 'Orbital mechanics and characteristics',
      icon: Orbit,
      component: () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsCard
            title="Orbital Characteristics"
            icon={<Activity className="text-purple-400" size={20} />}
            description="Multi-dimensional orbital analysis"
          >
            <RadarChartComponent data={data.orbitalData} />
          </AnalyticsCard>
          
          <AnalyticsCard
            title="Orbiting Bodies"
            icon={<PieChart className="text-blue-400" size={20} />}
            description="Distribution by orbiting body"
          >
            <PieChartComponent data={data.orbitingBodiesData} />
          </AnalyticsCard>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Chart Selection */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="text-purple-400" size={24} />
          Analysis Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chartConfigs.map((config) => (
            <button
              key={config.id}
              onClick={() => onChartChange(config.id)}
              className={`p-4 rounded-lg border transition-all duration-300 text-left group ${
                selectedChart === config.id
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <config.icon 
                  size={20} 
                  className={`${
                    selectedChart === config.id 
                      ? 'text-purple-400' 
                      : 'text-gray-400 group-hover:text-gray-300'
                  } transition-colors`} 
                />
                <span className="font-medium">{config.title}</span>
              </div>
              <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                {config.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Chart Content */}
      <div className="min-h-[600px]">
        {chartConfigs.find(c => c.id === selectedChart)?.component()}
      </div>
    </div>
  );
};