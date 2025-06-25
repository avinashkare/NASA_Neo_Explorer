import React from 'react';
import { Asteroid } from '../types/asteroid';
import { AnalyticsContainer } from './analytics/AnalyticsContainer';

interface AsteroidAnalyticsProps {
  asteroids: Asteroid[];
  onBack: () => void;
}

export const AsteroidAnalytics: React.FC<AsteroidAnalyticsProps> = ({
  asteroids,
  onBack
}) => {
  return <AnalyticsContainer asteroids={asteroids} onBack={onBack} />;
};