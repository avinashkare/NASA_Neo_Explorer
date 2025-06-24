import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Search, Filter, Orbit, X } from 'lucide-react';
import { Asteroid } from '../../types/asteroid';
import { AnalyticsFilters as FiltersType } from './AnalyticsContainer';

interface AnalyticsFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: Partial<FiltersType>) => void;
  asteroids: Asteroid[];
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFiltersChange,
  asteroids
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const orbitingBodies = useMemo(() => {
    const bodies = new Set(
      asteroids
        .map(a => a.orbiting_body)
        .filter((body): body is string => typeof body === 'string' && !!body)
    );
    return Array.from(bodies).sort();
  }, [asteroids]);

  // Generate search suggestions
  const generateSuggestions = (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filteredNames = asteroids
      .map(a => a.name)
      .filter(name => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 8) // Limit to 8 suggestions
      .sort();

    setSuggestions(filteredNames);
    setShowSuggestions(filteredNames.length > 0);
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({ searchTerm: value });
    generateSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onFiltersChange({ searchTerm: suggestion });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: '',
      hazardFilter: 'all',
      sizeFilter: 'all',
      orbitingBodyFilter: [],
      magnitudeRange: { min: 0, max: 35 }
    });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const hasActiveFilters = filters.searchTerm || 
    filters.hazardFilter !== 'all' || 
    filters.sizeFilter !== 'all' || 
    filters.orbitingBodyFilter.length > 0;

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="text-purple-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Advanced Filters</h2>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
          >
            <X size={16} />
            Clear All Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Search with Auto-suggestions */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Search size={16} />
            Search Asteroids
          </label>
          <div className="relative">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search by name..."
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
            />
            
            {/* Auto-suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors text-sm border-b border-gray-700 last:border-b-0"
                  >
                    {suggestion.replace(/[()]/g, '')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hazard Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Hazard Level</label>
          <select
            value={filters.hazardFilter}
            onChange={(e) => onFiltersChange({ hazardFilter: e.target.value as any })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white"
          >
            <option value="all">All Asteroids</option>
            <option value="hazardous">Potentially Hazardous</option>
            <option value="safe">Safe</option>
          </select>
        </div>

        {/* Size Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Size Category</label>
          <select
            value={filters.sizeFilter}
            onChange={(e) => onFiltersChange({ sizeFilter: e.target.value as any })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white"
          >
            <option value="all">All Sizes</option>
            <option value="small">Small (&lt; 50m)</option>
            <option value="medium">Medium (50-200m)</option>
            <option value="large">Large (200-500m)</option>
            <option value="massive">Massive (&gt; 500m)</option>
          </select>
        </div>

        {/* Orbiting Bodies */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Orbit size={16} />
            Orbiting Bodies
          </label>
          <div className="max-h-24 overflow-y-auto bg-gray-700 border border-gray-600 rounded-lg p-2 space-y-1">
            {orbitingBodies.map(body => (
              <label key={body} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.orbitingBodyFilter.includes(body)}
                  onChange={(e) => {
                    const newBodies = e.target.checked
                      ? [...filters.orbitingBodyFilter, body]
                      : filters.orbitingBodyFilter.filter(b => b !== body);
                    onFiltersChange({ orbitingBodyFilter: newBodies });
                  }}
                  className="rounded bg-gray-600 border-gray-500 text-purple-500 focus:ring-purple-400"
                />
                <span className="text-gray-300">{body}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                Search: {filters.searchTerm}
                <button
                  onClick={() => onFiltersChange({ searchTerm: '' })}
                  className="hover:text-purple-200"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            
            {filters.hazardFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600/20 text-red-300 text-xs rounded-full border border-red-500/30">
                {filters.hazardFilter === 'hazardous' ? 'Hazardous' : 'Safe'}
                <button
                  onClick={() => onFiltersChange({ hazardFilter: 'all' })}
                  className="hover:text-red-200"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            
            {filters.orbitingBodyFilter.map(body => (
              <span key={body} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                Orbiting: {body}
                <button
                  onClick={() => onFiltersChange({ 
                    orbitingBodyFilter: filters.orbitingBodyFilter.filter(b => b !== body)
                  })}
                  className="hover:text-blue-200"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};