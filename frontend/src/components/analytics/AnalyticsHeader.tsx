import React from 'react';
import { ArrowLeft, Download, Database } from 'lucide-react';

interface AnalyticsHeaderProps {
  onBack: () => void;
  totalAsteroids: number;
  filteredCount: number;
  onExport: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  onBack,
  totalAsteroids,
  filteredCount,
  onExport
}) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 border border-gray-700 hover:border-gray-600"
            >
              <ArrowLeft size={18} />
              Back to Explorer
            </button>
            
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Advanced Analytics Dashboard
              </h1>
              <p className="text-gray-400 text-sm">
                Comprehensive asteroid data analysis and insights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
              <Database className="text-purple-400" size={18} />
              <div className="text-sm">
                <span className="text-gray-400">Showing </span>
                <span className="text-purple-400 font-semibold">{filteredCount}</span>
                <span className="text-gray-400"> of </span>
                <span className="text-white font-semibold">{totalAsteroids}</span>
                <span className="text-gray-400"> asteroids</span>
              </div>
            </div>

            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};