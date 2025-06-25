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

/**
 * Finds the best size comparison for a given asteroid size.
 * @param asteroidSize - The size of the asteroid in meters.
 * @returns - The closest size comparison object.
 */
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

/**
 * Formats a size comparison string for an asteroid against a given comparison.
 * @param asteroidSize - The size of the asteroid in meters.
 * @param comparison - The size comparison object to compare against.
 * @returns - A formatted string indicating the size comparison.
 */
export function formatSizeComparison(asteroidSize: number, comparison: SizeComparison): string {
  const ratio = asteroidSize / comparison.height;

  if (ratio > 1.5) {
    return `${ratio.toFixed(1)}x larger than ${comparison.name}`;
  } else if (ratio < 0.7) {
    return `${(1 / ratio).toFixed(1)}x smaller than ${comparison.name}`;
  } else {
    return `Similar in size to ${comparison.name}`;
  }
}