import React from 'react';
import { 
  PieChart, 
  BarChart3, 
  Activity, 
  Target,
  Zap,
  TrendingUp,
  Calendar,
  Gauge
} from 'lucide-react';
import { AnalyticsCard } from './AnalyticsCard';
import { PieChartComponent } from './charts/PieChartComponent';
import { BarChartComponent } from './charts/BarChartComponent';
import { RadarChartComponent } from './charts/RadarChartComponent';
import { ScatterPlotComponent } from './charts/ScatterPlotComponent';
import { AreaChartComponent } from './charts/AreaChartComponent';
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

          <AnalyticsCard
            title="Approach Timeline"
            icon={<TrendingUp className="text-green-400" size={20} />}
            description="Asteroid approaches over time"
          >
            <AreaChartComponent data={data.timeSeriesData} />
          </AnalyticsCard>

          <AnalyticsCard
            title="Size vs Velocity"
            icon={<Zap className="text-yellow-400" size={20} />}
            description="Correlation between size and velocity"
          >
            <ScatterPlotComponent data={data.sizeVsVelocityData} />
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

          <AnalyticsCard
            title="Risk Assessment"
            icon={<Gauge className="text-red-400" size={20} />}
            description="Multi-dimensional risk analysis"
          >
            <RadarChartComponent data={data.riskAssessmentData} />
          </AnalyticsCard>

          <AnalyticsCard
            title="Miss Distance Distribution"
            icon={<Target className="text-purple-400" size={20} />}
            description="How close asteroids come to Earth"
          >
            <PieChartComponent data={data.missDistanceDistribution} />
          </AnalyticsCard>
        </div>
      )
    },
    {
      id: 'velocity-analysis',
      title: 'Velocity & Motion Analysis',
      description: 'Speed and trajectory characteristics',
      icon: Zap,
      component: () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsCard
            title="Velocity Distribution"
            icon={<Zap className="text-yellow-400" size={20} />}
            description="Speed categories of asteroids"
          >
            <BarChartComponent data={data.velocityDistribution} />
          </AnalyticsCard>
          
          <AnalyticsCard
            title="Size vs Velocity Correlation"
            icon={<Activity className="text-cyan-400" size={20} />}
            description="Relationship between size and speed"
          >
            <ScatterPlotComponent data={data.sizeVsVelocityData} />
          </AnalyticsCard>

          <AnalyticsCard
            title="Magnitude Distribution"
            icon={<BarChart3 className="text-purple-400" size={20} />}
            description="Brightness classification"
          >
            <BarChartComponent data={data.magnitudeDistribution} />
          </AnalyticsCard>

          <AnalyticsCard
            title="Approach Frequency"
            icon={<Calendar className="text-green-400" size={20} />}
            description="Monthly approach patterns"
          >
            <PieChartComponent data={data.approachFrequencyData} />
          </AnalyticsCard>
        </div>
      )
    },
    {
      id: 'temporal-analysis',
      title: 'Temporal Analysis',
      description: 'Time-based patterns and trends',
      icon: Calendar,
      component: () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsCard
            title="Approach Timeline"
            icon={<TrendingUp className="text-blue-400" size={20} />}
            description="Asteroid approaches over time"
          >
            <AreaChartComponent data={data.timeSeriesData} />
          </AnalyticsCard>
          
          <AnalyticsCard
            title="Monthly Frequency"
            icon={<Calendar className="text-green-400" size={20} />}
            description="Seasonal approach patterns"
          >
            <PieChartComponent data={data.approachFrequencyData} />
          </AnalyticsCard>

          <AnalyticsCard
            title="Miss Distance Trends"
            icon={<Activity className="text-purple-400" size={20} />}
            description="Distance distribution analysis"
          >
            <BarChartComponent data={data.missDistanceDistribution} />
          </AnalyticsCard>

          <AnalyticsCard
            title="Risk Assessment Matrix"
            icon={<Gauge className="text-red-400" size={20} />}
            description="Comprehensive risk evaluation"
          >
            <RadarChartComponent data={data.riskAssessmentData} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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