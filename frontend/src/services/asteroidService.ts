import { ApiResponse, Asteroid } from '../types/asteroid';

// Base URL for your backend API
const BASE_URL = import.meta.env.VITE_BASE_URL + '/api'; // Change this if your API is deployed elsewhere
// const BASE_URL = 'http://localhost:5000/api'; // Change this if your API is deployed elsewhere

export class AsteroidService {
  // Fetch asteroid data for a specific date range (startDate, endDate)
  static async getBrowseData(startDate: string, endDate: string): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${BASE_URL}/neos/list?startDate=${startDate}&endDate=${endDate}` // Call to your backend API
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching asteroid data:', error);
      throw error;
    }
  }

  // Fetch detailed asteroid information by asteroid ID
  static async getAsteroidById(id: string): Promise<Asteroid> {
    try {
      const response = await fetch(`${BASE_URL}/neo/${id}`); // Call to your backend API

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Asteroid = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching asteroid details:', error);
      throw error;
    }
  }
}