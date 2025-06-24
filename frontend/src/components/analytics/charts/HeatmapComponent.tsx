import React from 'react';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
  color: string;
}

interface HeatmapComponentProps {
  data: HeatmapData[];
}

export const HeatmapComponent: React.FC<HeatmapComponentProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data available
      </div>
    );
  }

  const xValues = [...new Set(data.map(d => d.x))];
  const yValues = [...new Set(data.map(d => d.y))];
  const maxValue = Math.max(...data.map(d => d.value));

  const cellWidth = 40;
  const cellHeight = 30;
  const margin = 60;

  const width = xValues.length * cellWidth + margin * 2;
  const height = yValues.length * cellHeight + margin * 2;

  const getCellData = (x: string, y: string) => {
    return data.find(d => d.x === x && d.y === y);
  };

  const getIntensity = (value: number) => {
    return Math.min(value / maxValue, 1);
  };

  return (
    <div className="flex items-center justify-center h-full overflow-auto">
      <svg width={width} height={height} className="text-xs">
        <defs>
          <linearGradient id="heatmapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1"/>
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9"/>
          </linearGradient>
        </defs>

        {/* Grid */}
        {yValues.map((y, yIndex) => (
          xValues.map((x, xIndex) => {
            const cellData = getCellData(x, y);
            const intensity = cellData ? getIntensity(cellData.value) : 0;
            
            return (
              <g key={`${x}-${y}`}>
                <rect
                  x={margin + xIndex * cellWidth}
                  y={margin + yIndex * cellHeight}
                  width={cellWidth - 1}
                  height={cellHeight - 1}
                  fill={cellData ? cellData.color : '#374151'}
                  opacity={0.2 + intensity * 0.8}
                  className="hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <title>{`${x} × ${y}: ${cellData?.value || 0}`}</title>
                </rect>
                
                {cellData && cellData.value > 0 && (
                  <text
                    x={margin + xIndex * cellWidth + cellWidth / 2}
                    y={margin + yIndex * cellHeight + cellHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-xs font-medium pointer-events-none"
                  >
                    {cellData.value}
                  </text>
                )}
              </g>
            );
          })
        ))}

        {/* X-axis labels */}
        {xValues.map((x, index) => (
          <text
            key={x}
            x={margin + index * cellWidth + cellWidth / 2}
            y={margin - 10}
            textAnchor="middle"
            className="fill-gray-400 text-xs"
          >
            {x}
          </text>
        ))}

        {/* Y-axis labels */}
        {yValues.map((y, index) => (
          <text
            key={y}
            x={margin - 10}
            y={margin + index * cellHeight + cellHeight / 2}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-gray-400 text-xs"
          >
            {y}
          </text>
        ))}

        {/* Legend */}
        <g transform={`translate(${width - 100}, ${margin})`}>
          <text x="0" y="-10" className="fill-gray-300 text-xs font-medium">Intensity</text>
          <rect x="0" y="0" width="80" height="10" fill="url(#heatmapGradient)" />
          <text x="0" y="25" className="fill-gray-400 text-xs">Low</text>
          <text x="60" y="25" className="fill-gray-400 text-xs">High</text>
        </g>
      </svg>
    </div>
  );
};