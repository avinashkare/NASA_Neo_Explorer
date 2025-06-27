import React from 'react';

interface LineChartData {
  x: number;
  y: number;
  date?: string;
  name?: string;
}

interface LineChartComponentProps {
  data: LineChartData[];
}

export const LineChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data available
      </div>
    );
  }

  // Filter and validate data
  const validData = data.filter(d => 
    !isNaN(d.x) && !isNaN(d.y) && 
    isFinite(d.x) && isFinite(d.y) &&
    d.x !== null && d.y !== null &&
    d.x !== undefined && d.y !== undefined
  );

  if (validData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No valid data available for visualization
      </div>
    );
  }

  const maxY = Math.max(...validData.map(d => d.y));
  const minY = Math.min(...validData.map(d => d.y));
  const maxX = Math.max(...validData.map(d => d.x));
  const minX = Math.min(...validData.map(d => d.x));
  
  const width = 300;
  const height = 200;
  const padding = 40;

  const xRange = maxX - minX;
  const yRange = maxY - minY;

  const scaleX = (x: number) => {
    if (xRange === 0) return width / 2;
    return ((x - minX) / xRange) * (width - 2 * padding) + padding;
  };

  const scaleY = (y: number) => {
    if (yRange === 0) return height / 2;
    return height - padding - ((y - minY) / yRange) * (height - 2 * padding);
  };

  const pathData = validData.map((point, index) => {
    const x = scaleX(point.x);
    const y = scaleY(point.y);
    
    // Ensure coordinates are valid
    if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
      return '';
    }
    
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).filter(segment => segment !== '').join(' ');

  return (
    <div className="flex items-center justify-center h-full">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />
        
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#6b7280" strokeWidth="2" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#6b7280" strokeWidth="2" />
        
        {/* Line */}
        {pathData && (
          <path
            d={pathData}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-lg"
          />
        )}
        
        {/* Area under curve */}
        {pathData && validData.length > 1 && (
          <path
            d={`${pathData} L ${scaleX(validData[validData.length - 1].x)} ${height - padding} L ${scaleX(validData[0].x)} ${height - padding} Z`}
            fill="url(#gradient)"
            opacity="0.3"
          />
        )}
        
        {/* Data points */}
        {validData.map((point, index) => {
          const cx = scaleX(point.x);
          const cy = scaleY(point.y);
          
          if (isNaN(cx) || isNaN(cy) || !isFinite(cx) || !isFinite(cy)) {
            return null;
          }
          
          return (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r="4"
              fill="#06b6d4"
              stroke="#ffffff"
              strokeWidth="2"
              className="hover:r-6 transition-all duration-200 cursor-pointer"
            >
              <title>{`${point.name || 'Point'}: ${point.y.toLocaleString()}`}</title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
};