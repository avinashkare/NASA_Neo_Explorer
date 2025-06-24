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

  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const maxX = Math.max(...data.map(d => d.x));
  
  const width = 300;
  const height = 200;
  const padding = 40;

  const scaleX = (x: number) => (x / maxX) * (width - 2 * padding) + padding;
  const scaleY = (y: number) => height - padding - ((y - minY) / (maxY - minY)) * (height - 2 * padding);

  const pathData = data.map((point, index) => {
    const x = scaleX(point.x);
    const y = scaleY(point.y);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="flex items-center justify-center h-full">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />
        
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#6b7280" strokeWidth="2" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#6b7280" strokeWidth="2" />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-lg"
        />
        
        {/* Area under curve */}
        <path
          d={`${pathData} L ${scaleX(data[data.length - 1].x)} ${height - padding} L ${scaleX(data[0].x)} ${height - padding} Z`}
          fill="url(#gradient)"
          opacity="0.3"
        />
        
        {/* Data points */}
        {data.map((point, index) => (
          <circle
            key={index}
            cx={scaleX(point.x)}
            cy={scaleY(point.y)}
            r="4"
            fill="#06b6d4"
            stroke="#ffffff"
            strokeWidth="2"
            className="hover:r-6 transition-all duration-200 cursor-pointer"
          >
            <title>{`${point.name || 'Point'}: ${point.y.toLocaleString()}`}</title>
          </circle>
        ))}
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};