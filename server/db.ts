import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Check if database is configured and attempt connection
let pool: Pool | null = null;
let db: any = null;
let hasDatabase = false;

if (process.env.DATABASE_URL) {
  try {
    // Configure database connection for development environment  
    let connectionString = process.env.DATABASE_URL;
    
    console.log("📍 Using connection string:", connectionString.replace(/\/\/[^:]+:[^@]+@/, '//*****:*****@'));
    
    // Create pool with proper SSL configuration for development
    pool = new Pool({ 
      connectionString: connectionString,
      max: 5, // Connection pool size
      idleTimeoutMillis: 60000, // Timeout for idle connections
      connectionTimeoutMillis: 15000, // Timeout for new connections
      ssl: false, // Disable SSL for development - no more certificate issues!
      application_name: 'vedic-learning-dev' // Application identifier
    });
    
    // Create drizzle instance
    db = drizzle(pool, { schema });
    hasDatabase = true;
    
    console.log("✅ Database connection configured successfully using node-postgres (SSL disabled)");
  } catch (error) {
    console.warn("⚠️  DATABASE_URL found but connection failed:", (error as Error).message);
    console.warn("⚠️  Falling back to in-memory storage. Fix DATABASE_URL or remove it to use in-memory storage.");
    pool = null;
    db = null;
    hasDatabase = false;
  }
} else {
  console.warn("⚠️  DATABASE_URL not found - running with in-memory storage. Add DATABASE_URL to Replit Secrets to use persistent database.");
}

export { pool, db, hasDatabase };