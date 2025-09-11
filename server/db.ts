import { Pool, neonConfig, type PoolClient } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure neon for development environment - optimized for speed
neonConfig.poolQueryViaFetch = true; // Use HTTP instead of WebSocket
neonConfig.fetchConnectionCache = true; // Cache connections

// Check if database is configured and attempt connection
let pool: Pool | null = null;
let db: any = null;
let hasDatabase = false;

if (process.env.DATABASE_URL) {
  try {
    // Test if the DATABASE_URL is valid by creating a minimal pool
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 1, // Minimal connection for testing
      idleTimeoutMillis: 5000, // Short timeout for testing
      connectionTimeoutMillis: 5000 // Short timeout for testing
    });
    
    // Create drizzle instance
    db = drizzle({ client: pool, schema });
    hasDatabase = true;
    
    console.log("✅ Database connection configured successfully");
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