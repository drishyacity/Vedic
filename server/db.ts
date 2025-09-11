import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure neon for development environment - optimized for speed
neonConfig.poolQueryViaFetch = true; // Use HTTP instead of WebSocket
neonConfig.fetchConnectionCache = true; // Cache connections

// Check if database is configured
export const hasDatabase = !!process.env.DATABASE_URL;

// Only set up database connection if DATABASE_URL is provided
export const pool = hasDatabase ? new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 5, // Max connections
  idleTimeoutMillis: 30000, // 30 second idle timeout
  connectionTimeoutMillis: 10000 // 10 second connection timeout
}) : null;

export const db = hasDatabase ? drizzle({ client: pool!, schema }) : null;

if (!hasDatabase) {
  console.warn("⚠️  DATABASE_URL not found - running with in-memory storage. Add DATABASE_URL to Replit Secrets to use persistent database.");
}