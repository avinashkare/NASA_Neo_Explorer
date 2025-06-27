# NASA Asteroid Explorer 🌌

A modern, interactive web application for exploring Near Earth Objects (NEOs) from NASA's database. Built with React, TypeScript, and Express.js, featuring real-time orbital visualizations and comprehensive analytics.

![NASA Asteroid Explorer](https://img.shields.io/badge/NASA-Asteroid%20Explorer-blue?style=for-the-badge&logo=nasa)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)

## ✨ Features

### 🌍 Interactive Orbital Visualization
- **Real-time orbital motion**: Watch asteroids orbit Earth with realistic physics
- **Dynamic positioning**: Asteroids move in multiple orbital rings with varying speeds
- **Interactive elements**: Hover for tracking, click for detailed analysis
- **Visual indicators**: Hazardous asteroids highlighted with special effects

### 📊 Advanced Analytics Dashboard
- **Multi-dimensional analysis**: 4 comprehensive analysis categories
- **Interactive charts**: Pie charts, bar charts, scatter plots, radar charts
- **Real-time filtering**: Search, hazard level, size categories, orbiting bodies
- **Statistical insights**: Key metrics and trend analysis

### 🔍 Data Management
- **Optimized API calls**: Intelligent interval merging reduces NASA API requests
- **Local caching**: PostgreSQL database for offline access and performance
- **Date range validation**: Maximum 7-day ranges with user-friendly validation
- **Error handling**: Graceful fallbacks and user feedback

### 📱 UI/UX
- **Responsive design**: Optimized for mobile, tablet, and desktop
- **Glassmorphism effects**: Backdrop blur and transparency
- **Animations**: 60fps orbital motion and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- NASA API Key (free from [NASA API Portal](https://api.nasa.gov/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/avinashkare/NASA_Neo_Explorer.git
   cd nasa-asteroid-explorer
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies (if separate)
   cd backend
   npm install
   ```

3. **Database setup**
   ```sql
   -- Create PostgreSQL database
   CREATE DATABASE asteroid_db;

   -- Run the schema (from root directory)
   psql -d asteroid_db -f database/schema.sql

   -- Create asteroids table
   CREATE TABLE asteroids (
     id SERIAL,
     neo_reference_id VARCHAR(255) PRIMARY KEY,
     name VARCHAR(255),
     estimated_diameter_min FLOAT,
     estimated_diameter_max FLOAT,
     average_diameter FLOAT,
     is_potentially_hazardous_asteroid BOOLEAN,
     close_approach_date DATE,
     miss_distance_km FLOAT,
     velocity_kmh FLOAT,
     orbiting_body VARCHAR(255),
     first_observation_date DATE,
     last_observation_date DATE,
     observations_used INT,
     orbital_period FLOAT,
     eccentricity FLOAT,
     data_arc_in_days INT,
     nasa_jpl_url VARCHAR(255),
     date_range_start DATE,
     date_range_end DATE,
     CONSTRAINT unique_neo_reference UNIQUE (neo_reference_id)
   );
   ```


4. **Environment configuration**
   Create `.env` file in the backend directory:
   ```env
   # NASA API Configuration
   NASA_API_KEY=your_nasa_api_key_here
   NASA_BASE_URL=https://api.nasa.gov/neo/rest/v1
   
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/asteroid_db
   
   # Server Configuration
   PORT=5000
   
   # Frontend URL (for development)
   VITE_BASE_URL=http://localhost:5000
   ```

5. **Start the application**
   ```bash
   # Start backend server
   cd backend
   node app.js
   
   # Start frontend (in new terminal)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 🏗️ Architecture

### Backend (Express.js + PostgreSQL)

## 📡 API Endpoints

### GET `/api/neos/list`
Fetch asteroid data with automatic NASA API integration
- **Parameters**: `startDate`, `endDate` (YYYY-MM-DD format)
- **Features**: Automatic data fetching, interval optimization, local caching
- **Response**: Array of asteroid objects with orbital data

### GET `/api/neos`
Retrieve cached asteroid data from local database
- **Parameters**: `startDate`, `endDate`
- **Response**: Cached asteroid data for faster access

## 🎯 Analytics Features

### 1. Overview Dashboard
- Hazard distribution visualization
- Size category breakdown
- Approach timeline analysis
- Size vs velocity correlation

### 2. Hazard Analysis
- Risk assessment metrics
- Hazardous object classification
- Miss distance analysis
- Multi-dimensional risk radar

### 3. Velocity & Motion Analysis
- Speed distribution patterns
- Size-velocity correlations
- Magnitude classifications
- Approach frequency patterns

### 4. Temporal Analysis
- Time-based approach patterns
- Seasonal frequency analysis
- Distance trend analysis
- Comprehensive risk matrix

## 🔧 Configuration

### NASA API Rate Limits
- Default: 50 requests/hour
- Optimized with interval merging
- Automatic retry logic
- Graceful error handling

## 🎨 Customization

### Themes
Modify color schemes in `src/index.css`:
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --accent-color: #f59e0b;
  --danger-color: #ef4444;
}
```

### Orbital Animation
Adjust orbital speeds in `AsteroidVisual.tsx`:
```typescript
const baseSpeed = 0.5; // degrees per frame
const speed = baseSpeed * (300 / position.distance);
```


## 📦 Deployment

### Frontend (Render)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Render)
```bash
# Add Procfile
echo "web: node app.js" > Procfile

# Set environment variables
NASA_API_KEY=your_key_here
DATABASE_URL=your_postgres_url
```

## 📚 Data Sources

- **NASA NEO Web Service**: Real-time asteroid data
- **JPL Small-Body Database**: Detailed orbital parameters
- **NASA CNEOS**: Risk assessment data


*Explore the cosmos, understand our celestial neighbors, and appreciate the vastness of space through data and visualization.*