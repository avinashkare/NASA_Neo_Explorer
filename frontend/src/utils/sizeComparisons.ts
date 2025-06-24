import { SizeComparison } from '../types/asteroid';

export const sizeComparisons: SizeComparison[] = [
  {
    name: 'Mount Everest',
    height: 8848.86,
    description: 'World\'s highest mountain peak'
  },
  {
    name: 'Burj Khalifa',
    height: 828,
    description: 'World\'s tallest building'
  },
  {
    name: 'Empire State Building',
    height: 443.2,
    description: 'Iconic New York skyscraper'
  },
  {
    name: 'Eiffel Tower',
    height: 330,
    description: 'Famous Paris landmark'
  },
  {
    name: 'Statue of Liberty',
    height: 93,
    description: 'Including pedestal'
  },
  {
    name: 'Football Field',
    height: 109.7,
    description: 'American football field length'
  },
  {
    name: 'Basketball Court',
    height: 28.7,
    description: 'NBA regulation court length'
  },
  {
    name: 'School Bus',
    height: 12.2,
    description: 'Standard US school bus'
  }
];

export function findBestComparison(asteroidSize: number): SizeComparison {
  // Find the closest size comparison
  const sortedComparisons = sizeComparisons
    .map(comp => ({
      ...comp,
      difference: Math.abs(comp.height - asteroidSize)
    }))
    .sort((a, b) => a.difference - b.difference);

  return sortedComparisons[0];
}

export function formatSizeComparison(asteroidSize: number, comparison: SizeComparison): string {
  const ratio = asteroidSize / comparison.height;
  
  if (ratio > 1.5) {
    return `${ratio.toFixed(1)}x larger than ${comparison.name}`;
  } else if (ratio < 0.7) {
    return `${(1/ratio).toFixed(1)}x smaller than ${comparison.name}`;
  } else {
    return `Similar in size to ${comparison.name}`;
  }
}