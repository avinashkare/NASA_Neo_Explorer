import React from 'react';
import { Search, Filter, Layers } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showHazardousOnly: boolean;
  onHazardousToggle: (show: boolean) => void;
  sizeFilter: 'all' | 'small' | 'medium' | 'large';
  onSizeFilterChange: (filter: 'all' | 'small' | 'medium' | 'large') => void;
  totalCount: number;
  filteredCount: number;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  showHazardousOnly,
  onHazardousToggle,
  sizeFilter,
  onSizeFilterChange,
  totalCount,
  filteredCount
}) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search asteroids by name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
            />
          </div>

          {/* Hazard Filter */}
          <button
            onClick={() => onHazardousToggle(!showHazardousOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
              showHazardousOnly
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
            }`}
          >
            <Filter size={16} />
            Hazardous Only
          </button>

          {/* Size Filter */}
          <div className="flex items-center gap-2">
            <Layers className="text-gray-400" size={16} />
            <select
              value={sizeFilter}
              onChange={(e) => onSizeFilterChange(e.target.value as any)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
            >
              <option value="all">All Sizes</option>
              <option value="small">Small (&lt; 50m)</option>
              <option value="medium">Medium (50-200m)</option>
              <option value="large">Large (&gt; 200m)</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-sm text-gray-400 bg-gray-700/50 px-4 py-2 rounded-lg">
          Showing <span className="text-purple-400 font-semibold">{filteredCount}</span> of{' '}
          <span className="text-white font-semibold">{totalCount}</span> asteroids
        </div>
      </div>
    </div>
  );
};