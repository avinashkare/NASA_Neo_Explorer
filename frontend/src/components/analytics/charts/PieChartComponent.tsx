import React from 'react';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartComponentProps {
  data: PieChartData[];
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data available
      </div>
    );
  }

  let cumulativePercentage = 0;

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage * 5.03} 502`;
            const strokeDashoffset = -cumulativePercentage * 5.03;
            cumulativePercentage += percentage;

            return (
              <circle
                key={index}
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={item.color}
                strokeWidth="20"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 hover:stroke-width-[25]"
              />
            );
          })}
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
        </div>
      </div>
      
      <div className="ml-6 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-300">{item.name}</span>
            <span className="text-sm text-white font-medium">({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};