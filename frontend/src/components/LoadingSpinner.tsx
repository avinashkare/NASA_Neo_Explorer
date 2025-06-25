import React from 'react';

/**
 * LoadingSpinner component displays a loading spinner with a gradient effect and a message.
 * @returns 
 */
export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin"></div>
        {/* Inner ring */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-gray-700 border-t-blue-400 rounded-full animate-spin animate-reverse"></div>
        {/* Center dot */}
        <div className="absolute top-6 left-6 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
      </div>
      <p className="mt-4 text-gray-400 animate-pulse">Loading asteroid data...</p>
    </div>
  );
};