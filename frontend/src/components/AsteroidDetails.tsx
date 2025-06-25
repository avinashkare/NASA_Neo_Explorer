import React from 'react';
import { X, AlertTriangle, Calendar, Ruler, Zap, Globe } from 'lucide-react';
import { Asteroid } from '../types/asteroid';
import { findBestComparison, formatSizeComparison } from '../utils/sizeComparisons';

interface AsteroidDetailsProps {
  asteroid: Asteroid;
  onClose: () => void;
}

export const AsteroidDetails: React.FC<AsteroidDetailsProps> = ({ asteroid, onClose }) => {
  const avgDiameter = (
    asteroid.estimated_diameter_min +
    asteroid.estimated_diameter_max
  ) / 2;

  const bestComparison = findBestComparison(avgDiameter);
  const comparisonText = formatSizeComparison(avgDiameter, bestComparison);

  const nextApproach = asteroid.close_approach_data?.[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{asteroid.name}</h2>
            <p className="text-gray-400">NEO Reference ID: {asteroid.neo_reference_id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Hazard Warning */}
        {asteroid.is_potentially_hazardous_asteroid && (
          <div className="bg-red-900/50 border border-red-600 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="text-red-400" size={24} />
            <div>
              <h3 className="text-red-400 font-semibold">Potentially Hazardous Asteroid</h3>
              <p className="text-red-300 text-sm">This asteroid is classified as potentially hazardous to Earth</p>
            </div>
          </div>
        )}

        {/* Size Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Ruler className="text-cyan-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Size</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="text-white font-medium">Diameter:</span> {' '}
                {asteroid.estimated_diameter_min.toFixed(0)} - {' '}
                {asteroid.estimated_diameter_max.toFixed(0)} meters
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Average:</span> {avgDiameter.toFixed(0)} meters
              </p>
              <div className="bg-cyan-900/30 rounded p-2 mt-3">
                <p className="text-cyan-300 font-medium">{comparisonText}</p>
                <p className="text-cyan-400 text-sm">{bestComparison.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="text-yellow-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Magnitude</h3>
            </div>
            <p className="text-gray-300">
              <span className="text-white font-medium">Absolute Magnitude:</span> {' '}
              {asteroid.absolute_magnitude_h}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Lower values indicate brighter objects
            </p>
          </div>
        </div>

        {/* Next Close Approach */}
        {nextApproach && (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="text-green-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Next Close Approach</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300">
                  <span className="text-white font-medium">Date:</span> {' '}
                  {new Date(nextApproach.close_approach_date).toLocaleDateString()}
                </p>
                <p className="text-gray-300">
                  <span className="text-white font-medium">Miss Distance:</span> {' '}
                  {parseFloat(nextApproach.miss_distance.kilometers).toLocaleString()} km
                </p>
              </div>
              <div>
                <p className="text-gray-300">
                  <span className="text-white font-medium">Velocity:</span> {' '}
                  {parseFloat(nextApproach.relative_velocity.kilometers_per_hour).toLocaleString()} km/h
                </p>
                <p className="text-gray-300">
                  <span className="text-white font-medium">Orbiting:</span> {nextApproach.orbiting_body}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Orbital Data */}
        {asteroid.orbital_data && (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="text-purple-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Orbital Information</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300">
                  <span className="text-white font-medium">First Observed:</span> {' '}
                  {asteroid.orbital_data.first_observation_date}
                </p>
                <p className="text-gray-300">
                  <span className="text-white font-medium">Last Observed:</span> {' '}
                  {asteroid.orbital_data.last_observation_date}
                </p>
                <p className="text-gray-300">
                  <span className="text-white font-medium">Observations Used:</span> {' '}
                  {asteroid.orbital_data.observations_used}
                </p>
              </div>
              <div>
                <p className="text-gray-300">
                  <span className="text-white font-medium">Orbital Period:</span> {' '}
                  {parseFloat(asteroid.orbital_data.orbital_period).toFixed(2)} days
                </p>
                <p className="text-gray-300">
                  <span className="text-white font-medium">Eccentricity:</span> {' '}
                  {parseFloat(asteroid.orbital_data.eccentricity).toFixed(4)}
                </p>
                <p className="text-gray-300">
                  <span className="text-white font-medium">Data Arc:</span> {' '}
                  {asteroid.orbital_data.data_arc_in_days} days
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NASA JPL Link */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <a
            href={asteroid.nasa_jpl_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View on NASA JPL →
          </a>
        </div>
      </div>
    </div>
  );
};