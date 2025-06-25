import React, { useState, useEffect } from 'react';
import { Asteroid } from '../types/asteroid';

interface AsteroidVisualProps {
  asteroid: Asteroid;
  position: { x: number; y: number; distance: number; angle: number };
  onClick: () => void;
  isSelected: boolean;
}

export const AsteroidVisual: React.FC<AsteroidVisualProps> = ({
  asteroid,
  position,
  onClick,
  isSelected
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(position.angle);

  const size = Math.max(
    8,
    Math.min(24, asteroid.estimated_diameter_max / 50)
  );

  const isHazardous = asteroid.is_potentially_hazardous_asteroid;

  // Calculate zoom level based on hover state
  const zoomScale = isHovered ? 2.5 : isSelected ? 2 : 1;

  // Orbital animation - different speeds based on distance
  useEffect(() => {
    const baseSpeed = 0.5; // degrees per frame
    const speed = baseSpeed * (300 / position.distance); // Closer asteroids move faster

    const interval = setInterval(() => {
      setCurrentAngle(prev => (prev + speed) % 360);
    }, 50); // 20 FPS for smooth animation

    return () => clearInterval(interval);
  }, [position.distance]);

  // Calculate orbital position
  const radians = (currentAngle * Math.PI) / 180;
  const centerX = 50; // Earth center X
  const centerY = 50; // Earth center Y
  const orbitalRadius = position.distance / 8; // Scale for screen

  const orbitalX = centerX + Math.cos(radians) * orbitalRadius;
  const orbitalY = centerY + Math.sin(radians) * orbitalRadius;

  // Ensure position stays within bounds
  const finalX = Math.max(5, Math.min(95, orbitalX));
  const finalY = Math.max(5, Math.min(95, orbitalY));

  return (
    <>
      {/* Orbital path visualization */}
      <div
        className={`absolute rounded-full border transition-all duration-1000 pointer-events-none ${isHovered || isSelected
            ? 'border-cyan-400/40 border-2'
            : 'border-gray-600/20 border-1'
          }`}
        style={{
          left: `${centerX}%`,
          top: `${centerY}%`,
          width: `${orbitalRadius * 2}px`,
          height: `${orbitalRadius * 2}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }}
      />

      {/* Asteroid */}
      <div
        className={`absolute cursor-pointer transition-all duration-500 ease-out transform ${isSelected ? 'z-30' : isHovered ? 'z-20' : 'z-10'
          }`}
        style={{
          left: `${finalX}%`,
          top: `${finalY}%`,
          transform: `translate(-50%, -50%) scale(${zoomScale})`
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Orbital trail effect */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${isHazardous ? 'bg-red-500' : 'bg-cyan-400'
            } ${isHovered || isSelected ? 'opacity-30 animate-pulse' : 'opacity-10'}`}
          style={{
            width: `${size + (isHovered ? 20 : 10)}px`,
            height: `${size + (isHovered ? 20 : 10)}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Enhanced asteroid body with rotation */}
        <div
          className={`rounded-full transition-all duration-500 relative overflow-hidden ${isHazardous
              ? 'bg-gradient-to-br from-red-400 via-red-500 to-red-700 shadow-red-500/50'
              : 'bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700 shadow-gray-500/50'
            } shadow-lg ${isSelected ? 'animate-pulse' : ''}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            boxShadow: isHovered
              ? `0 0 ${size * 2}px ${isHazardous ? 'rgba(239, 68, 68, 0.8)' : 'rgba(34, 211, 238, 0.8)'}`
              : `0 4px 8px ${isHazardous ? 'rgba(239, 68, 68, 0.3)' : 'rgba(156, 163, 175, 0.3)'}`
          }}
        >
          {/* Enhanced surface texture with crater-like details */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
          <div className="absolute top-1 left-1 w-1 h-1 bg-black/30 rounded-full"></div>
          <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-black/20 rounded-full"></div>

          {/* Velocity indicator */}
          {isHovered && (
            <div
              className={`absolute w-6 h-0.5 ${isHazardous ? 'bg-red-300' : 'bg-cyan-300'} opacity-70`}
              style={{
                left: `${size + 5}px`,
                top: '50%',
                transform: 'translateY(-50%)',
                transformOrigin: 'left center'
              }}
            />
          )}
        </div>

        {/* Enhanced glow effect for hazardous asteroids */}
        {isHazardous && (
          <div
            className={`absolute inset-0 rounded-full bg-red-500 blur-sm transition-all duration-500 ${isHovered ? 'opacity-60 animate-pulse' : 'opacity-30'
              }`}
            style={{
              width: `${size + (isHovered ? 12 : 6)}px`,
              height: `${size + (isHovered ? 12 : 6)}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}

        {/* Selection indicator with enhanced animation */}
        {isSelected && (
          <>
            <div className="absolute -inset-4 rounded-full border-2 border-cyan-400 animate-ping"></div>
            <div className="absolute -inset-3 rounded-full border border-cyan-300 animate-pulse"></div>
          </>
        )}

        {/* Hover tooltip with asteroid name and orbital info */}
        {isHovered && !isSelected && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900/95 text-white text-xs rounded-lg whitespace-nowrap backdrop-blur-sm border border-gray-700 animate-fade-in">
            <div className="font-semibold">{asteroid.name.replace(/[()]/g, '')}</div>
            <div className="text-gray-300 text-xs">
              Orbital Distance: {Math.round(position.distance)}km
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
          </div>
        )}
      </div>
    </>
  );
};