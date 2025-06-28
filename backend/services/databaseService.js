const pool = require('../db');
const fs = require('fs');
const path = require('path');

/**
 * Service for database operations and initialization
 */
class DatabaseService {
  /**
   * Check if database tables exist
   */
  static async checkTablesExist() {
    try {
      const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'asteroids'
      `);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking table existence:', error);
      return false;
    }
  }

  /**
   * Initialize database if tables don't exist
   */
  static async initializeIfNeeded() {
    try {
      const tablesExist = await this.checkTablesExist();
      
      if (!tablesExist) {
        console.log('Database tables not found. Initializing...');
        await this.runMigrations();
        console.log('Database initialization completed');
      } else {
        console.log('Database tables already exist');
      }
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Run database migrations
   */
  static async runMigrations() {
    try {
      const migrationsDir = path.join(__dirname, '../migrations');
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();

      for (const file of migrationFiles) {
        console.log(`Running migration: ${file}`);
        const migrationPath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        await pool.query(migrationSQL);
        console.log(`✓ Migration ${file} completed`);
      }
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  /**
   * Test database connection
   */
  static async testConnection() {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      console.log('Database connection test successful:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}

module.exports = DatabaseService;