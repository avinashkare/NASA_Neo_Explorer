const { Pool } = require('pg');

// Use the DATABASE_URL environment variable for PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required
  },
});

module.exports = pool;
