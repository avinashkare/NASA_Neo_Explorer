import React from 'react';

interface RadarChartData {
  subject: string;
  A: number;
  fullMark: number;
}

interface RadarChartComponentProps {
  data: RadarChartData[];
}

export const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data available
      </div>
    );
  }

  const size = 180;
  const center = size / 2;
  const maxRadius = center - 40;
  const levels = 5;

  const angleSlice = (Math.PI * 2) / data.length;

  const getPointCoordinates = (value: number, index: number) => {
    const radius = (value / 100) * maxRadius;
    const angle = angleSlice * index - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  const pathData = data.map((item, index) => {
    const point = getPointCoordinates(item.A, index);
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ') + ' Z';

  return (
    <div className="flex items-center justify-center h-full">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <radialGradient id="radarGradient">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1"/>
          </radialGradient>
        </defs>
        
        {/* Grid circles */}
        {Array.from({ length: levels }, (_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(maxRadius / levels) * (i + 1)}
            fill="none"
            stroke="#374151"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
        
        {/* Grid lines */}
        {data.map((_, index) => {
          const angle = angleSlice * index - Math.PI / 2;
          const x = center + maxRadius * Math.cos(angle);
          const y = center + maxRadius * Math.sin(angle);
          
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#374151"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}
        
        {/* Data area */}
        <path
          d={pathData}
          fill="url(#radarGradient)"
          stroke="#8b5cf6"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const point = getPointCoordinates(item.A, index);
          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#8b5cf6"
              stroke="#ffffff"
              strokeWidth="2"
              className="hover:r-6 transition-all duration-200"
            >
              <title>{`${item.subject}: ${item.A.toFixed(1)}`}</title>
            </circle>
          );
        })}
        
        {/* Labels */}
        {data.map((item, index) => {
          const angle = angleSlice * index - Math.PI / 2;
          const labelRadius = maxRadius + 20;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-300 text-xs"
            >
              {item.subject}
            </text>
          );
        })}
      </svg>
    </div>
  );
};