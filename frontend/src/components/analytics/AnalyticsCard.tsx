import React from 'react';

interface AnalyticsCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  icon,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-gray-600/50 transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            {description}
          </p>
        </div>
      </div>
      <div className="h-64 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};