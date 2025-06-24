import React from 'react';

interface BarChartData {
  name: string;
  value: number;
  color: string;
}

interface BarChartComponentProps {
  data: BarChartData[];
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  if (maxValue === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="h-full flex items-end justify-center gap-4 p-4">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 180;
        
        return (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="text-xs text-white font-medium">{item.value}</div>
            <div
              className="w-12 rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
              style={{
                height: `${height}px`,
                backgroundColor: item.color,
                minHeight: '4px'
              }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.name}: {item.value}
              </div>
            </div>
            <div className="text-xs text-gray-400 text-center max-w-16 leading-tight">
              {item.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};