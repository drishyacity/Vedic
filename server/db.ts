import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure neon for development environment - optimized for speed
neonConfig.poolQueryViaFetch = true; // Use HTTP instead of WebSocket
neonConfig.fetchConnectionCache = true; // Cache connections

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure the pool for development with timeouts
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 5, // Max connections
  idleTimeoutMillis: 30000, // 30 second idle timeout
  connectionTimeoutMillis: 10000 // 10 second connection timeout
});
export const db = drizzle({ client: pool, schema });