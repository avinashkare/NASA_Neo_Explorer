import React from 'react';

interface AreaChartData {
  date: string;
  count: number;
  x: string;
  y: number;
}

interface AreaChartComponentProps {
  data: AreaChartData[];
}

export const AreaChartComponent: React.FC<AreaChartComponentProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data available
      </div>
    );
  }

  // Filter and validate data
  const validData = data.filter(d => 
    !isNaN(d.count) && isFinite(d.count) &&
    d.count !== null && d.count !== undefined
  );

  if (validData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No valid data available for visualization
      </div>
    );
  }

  const maxY = Math.max(...validData.map(d => d.count));
  const width = 300;
  const height = 200;
  const padding = 40;

  const scaleX = (index: number) => {
    if (validData.length <= 1) return width / 2;
    return (index / (validData.length - 1)) * (width - 2 * padding) + padding;
  };
  
  const scaleY = (y: number) => {
    if (maxY === 0) return height - padding;
    return height - padding - (y / maxY) * (height - 2 * padding);
  };

  const pathData = validData.map((point, index) => {
    const x = scaleX(index);
    const y = scaleY(point.count);
    
    if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
      return '';
    }
    
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).filter(segment => segment !== '').join(' ');

  const areaData = pathData ? 
    `${pathData} L ${scaleX(validData.length - 1)} ${height - padding} L ${scaleX(0)} ${height - padding} Z` : 
    '';

  return (
    <div className="flex items-center justify-center h-full">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid */}
        <defs>
          <pattern id="areaGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        <rect width={width} height={height} fill="url(#areaGrid)" />
        
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#6b7280" strokeWidth="2" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#6b7280" strokeWidth="2" />
        
        {/* Area */}
        {areaData && (
          <path
            d={areaData}
            fill="url(#areaGradient)"
          />
        )}
        
        {/* Line */}
        {pathData && (
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        
        {/* Data points */}
        {validData.map((point, index) => {
          const cx = scaleX(index);
          const cy = scaleY(point.count);
          
          if (isNaN(cx) || isNaN(cy) || !isFinite(cx) || !isFinite(cy)) {
            return null;
          }
          
          return (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r="4"
              fill="#3b82f6"
              stroke="#ffffff"
              strokeWidth="2"
              className="hover:r-6 transition-all duration-200 cursor-pointer"
            >
              <title>{`${point.date}: ${point.count} asteroids`}</title>
            </circle>
          );
        })}
        
        {/* Axis labels */}
        <text x={width / 2} y={height - 5} textAnchor="middle" className="fill-gray-400 text-xs">
          Time
        </text>
        <text x={15} y={height / 2} textAnchor="middle" className="fill-gray-400 text-xs" transform={`rotate(-90, 15, ${height / 2})`}>
          Count
        </text>
      </svg>
    </div>
  );
};