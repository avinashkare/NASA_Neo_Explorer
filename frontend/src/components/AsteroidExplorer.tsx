import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Info, Zap, Globe, Orbit, BarChart3, Calendar } from 'lucide-react';
import { Asteroid } from '../types/asteroid';
import { AsteroidService } from '../services/asteroidService';
import { EarthVisualization } from './EarthVisualization';
import { AsteroidVisual } from './AsteroidVisual';
import { AsteroidDetails } from './AsteroidDetails';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface AsteroidExplorerProps {
  onNavigateToAnalytics?: (asteroids: Asteroid[]) => void;
}

export const AsteroidExplorer: React.FC<AsteroidExplorerProps> = ({ onNavigateToAnalytics }) => {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHazardousOnly, setShowHazardousOnly] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);

    loadAsteroids(sevenDaysAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
  }, []);

  const loadAsteroids = async (start: string, end: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await AsteroidService.getBrowseData(start, end);
      setAsteroids(data.asteroids);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load asteroid data');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDates = () => {
    if (endDate < startDate) {
      alert('End date cannot be before start date');
      return;
    }
    loadAsteroids(startDate, endDate);
  };

  const filteredAsteroids = useMemo(() => {
    if (!asteroids || asteroids.length === 0) {
      return [];
    }

    return asteroids.filter(asteroid => {
      const matchesSearch = asteroid.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !showHazardousOnly || asteroid.is_potentially_hazardous_asteroid;
      return matchesSearch && matchesFilter;
    });
  }, [asteroids, searchTerm, showHazardousOnly]);

  const asteroidPositions = useMemo(() => {
    if (!filteredAsteroids || filteredAsteroids.length === 0) {
      return [];
    }

    return filteredAsteroids.map((_, index) => {
      const ringIndex = index % 4;
      const baseDistance = 180 + (ringIndex * 60);
      const distanceVariation = (Math.sin(index * 0.5) * 20);
      const distance = baseDistance + distanceVariation;

      const angleStep = 360 / Math.ceil(filteredAsteroids.length / 4);
      const baseAngle = (index * angleStep) % 360;

      const angleOffset = (Math.sin(index * 1.3) * 15);
      const angle = (baseAngle + angleOffset) % 360;

      const radians = (angle * Math.PI) / 180;
      const orbitalRadius = distance / 8;
      const x = 50 + Math.cos(radians) * orbitalRadius;
      const y = 50 + Math.sin(radians) * orbitalRadius;

      return {
        x: Math.max(10, Math.min(90, x)),
        y: Math.max(10, Math.min(90, y)),
        distance,
        angle
      };
    });
  }, [filteredAsteroids]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => loadAsteroids(startDate, endDate)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                NASA Asteroid Explorer
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Real-time orbital visualization of Near Earth Objects (NEOs)
              </p>
            </div>

            {/* Enhanced Date Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar size={18} className="text-cyan-400" />
                <span className="text-sm font-medium">Date Range:</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:border-gray-500"
                    max={today}
                  />
                </div>
                
                <span className="text-gray-400 text-sm">to</span>
                
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:border-gray-500"
                    max={today}
                  />
                </div>
                
                <button
                  onClick={handleApplyDates}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-sm font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Search, Filter, and Analytics Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search asteroids..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 text-sm"
                />
              </div>

              <button
                onClick={() => setShowHazardousOnly(!showHazardousOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${showHazardousOnly
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
              >
                <Filter size={16} />
                Hazardous Only
              </button>

              <button
                onClick={() => onNavigateToAnalytics?.(asteroids)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <BarChart3 size={16} />
                Analytics
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Enhanced Info Panel */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
          <div className="flex items-start gap-3">
            <Info className="text-cyan-400 mt-1 animate-pulse" size={20} />
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Live Orbital Asteroid Tracker</h2>
              <p className="text-gray-300 mb-3">
                Watch asteroids orbit Earth in real-time! Each asteroid follows its own orbital path with realistic physics.
                Hover to see detailed information and orbital data. Click for comprehensive analysis.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
                  Regular Asteroid
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  Potentially Hazardous
                </span>
                <span className="flex items-center gap-2">
                  <Orbit className="text-cyan-400" size={16} />
                  Live Orbital Motion
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="text-yellow-400" size={16} />
                  Hover to Track
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="text-blue-400" size={16} />
                  Click for Details
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Orbital Visualization Area */}
        <div className="relative bg-gradient-to-br from-blue-900/10 to-purple-900/10 rounded-2xl p-8 min-h-[700px] border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-500">
          {/* Enhanced background stars with twinkling effect */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 200 }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 bg-white rounded-full ${i % 3 === 0 ? 'animate-ping' : i % 2 === 0 ? 'animate-pulse' : ''
                  }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <EarthVisualization />
          </div>

          {/* Orbital grid lines */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5">
            {[180, 240, 300, 360].map((distance) => (
              <div
                key={distance}
                className="absolute rounded-full border border-gray-600/10"
                style={{
                  width: `${(distance / 8) * 2}px`,
                  height: `${(distance / 8) * 2}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>

          {/* Asteroids with orbital motion */}
          {filteredAsteroids.map((asteroid, index) => (
            <AsteroidVisual
              key={asteroid.id}
              asteroid={asteroid}
              position={asteroidPositions[index]}
              onClick={() => setSelectedAsteroid(asteroid)}
              isSelected={selectedAsteroid?.id === asteroid.id}
            />
          ))}

          {/* Stats Panel */}
          <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              Live Orbital Data
            </h3>
            <div className="text-xs text-gray-300 space-y-1">
              <p>Active Asteroids: <span className="text-cyan-400 font-semibold">{filteredAsteroids.length}</span></p>
              <p>
                Hazardous: <span className="text-red-400 font-semibold">
                  {filteredAsteroids.filter(a => a.is_potentially_hazardous_asteroid).length}
                </span>
              </p>
              <p>
                Safe: <span className="text-green-400 font-semibold">
                  {filteredAsteroids.filter(a => !a.is_potentially_hazardous_asteroid).length}
                </span>
              </p>
              <p className="text-yellow-400 text-xs mt-2">🌍 Real-time orbital motion</p>
            </div>
          </div>

          {/* Instructions Panel */}
          <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <h3 className="text-sm font-semibold text-white mb-2">Orbital Controls</h3>
            <div className="text-xs text-gray-300 space-y-1">
              <p>🔄 Watch: Live orbital motion</p>
              <p>🖱️ Hover: Track asteroid path</p>
              <p>👆 Click: Detailed analysis</p>
              <p>🔍 Search: Find specific objects</p>
              <p>⚠️ Filter: Show hazardous only</p>
            </div>
          </div>

          {/* Orbital Legend */}
          <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-white mb-2">Orbital Rings</h3>
            <div className="text-xs text-gray-300 space-y-1">
              <p>Ring 1: <span className="text-cyan-400">180km</span></p>
              <p>Ring 2: <span className="text-blue-400">240km</span></p>
              <p>Ring 3: <span className="text-purple-400">300km</span></p>
              <p>Ring 4: <span className="text-pink-400">360km</span></p>
            </div>
          </div>
        </div>
      </main>

      {/* Asteroid Details Modal */}
      {selectedAsteroid && (
        <AsteroidDetails
          asteroid={selectedAsteroid}
          onClose={() => setSelectedAsteroid(null)}
        />
      )}
    </div>
  );
};