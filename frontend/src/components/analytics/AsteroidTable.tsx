import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Asteroid } from '../../types/asteroid';

interface AsteroidTableProps {
  asteroids: Asteroid[];
  selectedAsteroid: Asteroid | null;
  onAsteroidSelect: (asteroid: Asteroid) => void;
}

export const AsteroidTable: React.FC<AsteroidTableProps> = ({
  asteroids,
  selectedAsteroid,
  onAsteroidSelect
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-2">Detailed Asteroid Data</h3>
        <p className="text-gray-400">Click on any asteroid for detailed analysis</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Size (m)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Velocity (km/h)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Miss Distance (km)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Approach Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {asteroids.slice(0, 50).map((asteroid) => {
              const avgSize = (asteroid.estimated_diameter_min + asteroid.estimated_diameter_max) / 2;
              const approach = asteroid.close_approach_data?.[0];
              const isSelected = selectedAsteroid?.id === asteroid.id;
              
              return (
                <tr
                  key={asteroid.id}
                  className={`hover:bg-gray-700/30 cursor-pointer transition-colors ${
                    isSelected ? 'bg-purple-900/20 border-l-4 border-purple-400' : ''
                  }`}
                  onClick={() => onAsteroidSelect(asteroid)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {asteroid.is_potentially_hazardous_asteroid && (
                        <AlertTriangle className="text-red-400" size={16} />
                      )}
                      <span className="text-white font-medium">
                        {asteroid.name.replace(/[()]/g, '')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {avgSize.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {approach ? parseFloat(approach.relative_velocity.kilometers_per_hour).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {approach ? parseFloat(approach.miss_distance.kilometers).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {approach ? new Date(approach.close_approach_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      asteroid.is_potentially_hazardous_asteroid
                        ? 'bg-red-900/50 text-red-300 border border-red-600/30'
                        : 'bg-green-900/50 text-green-300 border border-green-600/30'
                    }`}>
                      {asteroid.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Safe'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={asteroid.nasa_jpl_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={16} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {asteroids.length > 50 && (
        <div className="p-4 text-center text-gray-400 border-t border-gray-700">
          Showing first 50 results. Use search and filters to narrow down the data.
        </div>
      )}
    </div>
  );
};