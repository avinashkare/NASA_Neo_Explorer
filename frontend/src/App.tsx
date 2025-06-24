import { useState } from 'react';
import { AsteroidExplorer } from './components/AsteroidExplorer';
import { AsteroidAnalytics } from './components/AsteroidAnalytics';
import { Asteroid } from './types/asteroid';

type AppView = 'explorer' | 'analytics';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('explorer');
  const [analyticsData, setAnalyticsData] = useState<Asteroid[]>([]);

  const handleNavigateToAnalytics = (asteroids: Asteroid[]) => {
    setAnalyticsData(asteroids);
    setCurrentView('analytics');
  };

  const handleBackToExplorer = () => {
    setCurrentView('explorer');
  };

  return (
    <>
      {currentView === 'explorer' && (
        <AsteroidExplorer onNavigateToAnalytics={handleNavigateToAnalytics} />
      )}
      {currentView === 'analytics' && (
        <AsteroidAnalytics 
          asteroids={analyticsData} 
          onBack={handleBackToExplorer} 
        />
      )}
    </>
  );
}

export default App;