import React from 'react';

interface EarthVisualizationProps {
  className?: string;
}

export const EarthVisualization: React.FC<EarthVisualizationProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Earth with enhanced rotation animation */}
      <div className="relative w-40 h-40 mx-auto">
        {/* Earth's gravitational field visualization */}
        <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-blue-500/5 to-cyan-500/5 animate-pulse"></div>
        <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-400/10 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-300/15 to-cyan-300/15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-2xl animate-spin-slow">
          {/* Earth surface details with rotation */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-400 via-blue-500 to-blue-600 opacity-70 overflow-hidden">
            {/* Animated continents representation */}
            <div className="absolute top-6 left-8 w-10 h-8 bg-green-500 rounded-full opacity-60 animate-float"></div>
            <div className="absolute bottom-8 right-6 w-8 h-10 bg-green-500 rounded-full opacity-60 animate-float-delayed"></div>
            <div className="absolute top-10 right-8 w-6 h-6 bg-green-500 rounded-full opacity-60 animate-float"></div>
            <div className="absolute bottom-12 left-10 w-4 h-6 bg-green-600 rounded-full opacity-50 animate-float-delayed"></div>
            
            {/* Cloud layer animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-spin-reverse opacity-30"></div>
            <div className="absolute inset-1 rounded-full bg-gradient-to-l from-white/5 via-transparent to-white/5 animate-spin-slow opacity-20"></div>
          </div>
          
          {/* Enhanced atmosphere glow with pulsing effect */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-300 to-cyan-300 opacity-20 blur-sm animate-pulse"></div>
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 opacity-10 blur-md animate-pulse"></div>
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 opacity-5 blur-lg animate-pulse"></div>
        </div>
        
        {/* Magnetic field lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gradient-to-t from-cyan-400/30 to-transparent transform -translate-x-1/2 -translate-y-full"></div>
          <div className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-gradient-to-b from-cyan-400/30 to-transparent transform -translate-x-1/2 translate-y-full"></div>
        </div>
      </div>
      
      {/* Enhanced Earth label with orbital information */}
      <div className="text-center mt-6 animate-fade-in">
        <h3 className="text-xl font-semibold text-blue-300 animate-pulse">Earth</h3>
        <p className="text-sm text-gray-400">Gravitational Center</p>
        <div className="mt-2 text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
            <span>Orbital Tracking Active</span>
          </div>
          <div className="text-cyan-400">
            Mass: 5.97 × 10²⁴ kg
          </div>
          <div className="text-cyan-400">
            Radius: 6,371 km
          </div>
        </div>
      </div>
    </div>
  );
};