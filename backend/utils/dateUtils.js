/**
 * Utility functions for date operations
 */

/**
 * Function to check if the provided date range is valid
 * @param {String} startDate - The start date in 'YYYY-MM-DD' format
 * @param {String} endDate - The end date in 'YYYY-MM-DD' format
 * @returns {Object} - Object with error property
 */
const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { error: 'Please provide both startDate and endDate parameters.' };
  }
  return { error: null };
};

/**
 * Merge consecutive dates into intervals to optimize API calls
 * @param {Array} dates - Array of date objects with start_date property
 * @returns {Array} - Array of intervals with startDate and endDate
 */
const mergeDateIntervals = (dates) => {
  if (dates.length === 0) return [];
  
  // Convert dates to Date objects and sort
  const sortedDates = dates
    .map(d => new Date(d.start_date))
    .sort((a, b) => a.getTime() - b.getTime());
  
  const intervals = [];
  let currentStart = sortedDates[0];
  let currentEnd = sortedDates[0];
  
  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    const previousDate = sortedDates[i - 1];
    
    // Check if dates are consecutive (difference of 1 day)
    const diffInDays = (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diffInDays <= 1) {
      // Extend current interval
      currentEnd = currentDate;
    } else {
      // Close current interval and start new one
      intervals.push({
        startDate: currentStart.toISOString().split('T')[0],
        endDate: currentEnd.toISOString().split('T')[0]
      });
      currentStart = currentDate;
      currentEnd = currentDate;
    }
  }
  
  // Add the last interval
  intervals.push({
    startDate: currentStart.toISOString().split('T')[0],
    endDate: currentEnd.toISOString().split('T')[0]
  });
  
  return intervals;
};

module.exports = {
  validateDateRange,
  mergeDateIntervals
};