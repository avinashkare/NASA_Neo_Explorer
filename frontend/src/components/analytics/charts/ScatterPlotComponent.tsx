import React from 'react';

interface ScatterPlotData {
  x: number;
  y: number;
  name: string;
  hazardous: boolean;
  color: string;
}

interface ScatterPlotComponentProps {
  data: ScatterPlotData[];
}

export const ScatterPlotComponent: React.FC<ScatterPlotComponentProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data available
      </div>
    );
  }

  const maxX = Math.max(...data.map(d => d.x));
  const maxY = Math.max(...data.map(d => d.y));
  const minX = Math.min(...data.map(d => d.x));
  const minY = Math.min(...data.map(d => d.y));

  const width = 300;
  const height = 200;
  const padding = 40;

  // Protect against division by zero if all points have the same x or y
  const scaleX = (x: number) => {
    if (maxX === minX) return padding;  // Handle edge case where all x values are the same
    return ((x - minX) / (maxX - minX)) * (width - 2 * padding) + padding;
  };

  const scaleY = (y: number) => {
    if (maxY === minY) return height - padding;  // Handle edge case where all y values are the same
    return height - padding - ((y - minY) / (maxY - minY)) * (height - 2 * padding);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid */}
        <defs>
          <pattern id="scatterGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#scatterGrid)" />
        
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#6b7280" strokeWidth="2" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#6b7280" strokeWidth="2" />
        
        {/* Axis labels */}
        <text x={width / 2} y={height - 5} textAnchor="middle" className="fill-gray-400 text-xs">
          Size (meters)
        </text>
        <text x={15} y={height / 2} textAnchor="middle" className="fill-gray-400 text-xs" transform={`rotate(-90, 15, ${height / 2})`}>
          Velocity (km/h)
        </text>
        
        {/* Data points */}
        {data.map((point, index) => (
          <circle
            key={index}
            cx={scaleX(point.x)}
            cy={scaleY(point.y)}
            r={point.hazardous ? "6" : "4"}
            fill={point.color}
            stroke={point.hazardous ? "#ffffff" : "none"}
            strokeWidth={point.hazardous ? "2" : "0"}
            opacity="0.8"
            className="hover:opacity-100 hover:r-8 transition-all duration-200 cursor-pointer"
          >
            <title>{`${point.name}: ${point.x.toFixed(1)}m, ${point.y.toLocaleString()} km/h`}</title>
          </circle>
        ))}
        
        {/* Legend */}
        <g transform={`translate(${width - 100}, 20)`}>
          <circle cx="10" cy="10" r="4" fill="#06b6d4" />
          <text x="20" y="15" className="fill-gray-300 text-xs">Safe</text>
          <circle cx="10" cy="30" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <text x="20" y="35" className="fill-gray-300 text-xs">Hazardous</text>
        </g>
      </svg>
    </div>
  );
};
