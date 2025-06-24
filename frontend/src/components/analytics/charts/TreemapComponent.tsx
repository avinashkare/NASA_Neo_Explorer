import React from 'react';

interface TreemapData {
  name: string;
  value: number;
  color: string;
  children?: TreemapData[];
}

interface TreemapComponentProps {
  data: TreemapData[];
}

export const TreemapComponent: React.FC<TreemapComponentProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data available
      </div>
    );
  }

  const width = 300;
  const height = 200;
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  let currentX = 0;
  let currentY = 0;
  let rowHeight = 0;
  const rectangles: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    data: TreemapData;
  }> = [];

  data.forEach((item) => {
    const area = (item.value / totalValue) * (width * height);
    const rectWidth = Math.sqrt(area * (width / height));
    const rectHeight = area / rectWidth;

    if (currentX + rectWidth > width) {
      currentY += rowHeight;
      currentX = 0;
      rowHeight = 0;
    }

    rectangles.push({
      x: currentX,
      y: currentY,
      width: Math.min(rectWidth, width - currentX),
      height: Math.min(rectHeight, height - currentY),
      data: item
    });

    currentX += rectWidth;
    rowHeight = Math.max(rowHeight, rectHeight);
  });

  return (
    <div className="flex items-center justify-center h-full">
      <svg width={width} height={height} className="border border-gray-600 rounded">
        {rectangles.map((rect, index) => (
          <g key={index}>
            <rect
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill={rect.data.color}
              stroke="#374151"
              strokeWidth="1"
              className="hover:opacity-80 transition-opacity cursor-pointer"
              opacity="0.8"
            >
              <title>{`${rect.data.name}: ${rect.data.value}`}</title>
            </rect>
            
            {rect.width > 50 && rect.height > 25 && (
              <>
                <text
                  x={rect.x + rect.width / 2}
                  y={rect.y + rect.height / 2 - 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-xs font-medium pointer-events-none"
                >
                  {rect.data.name}
                </text>
                <text
                  x={rect.x + rect.width / 2}
                  y={rect.y + rect.height / 2 + 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-xs pointer-events-none"
                >
                  {rect.data.value}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};