import { Pool, neonConfig } from '@neondatabase/serverless';
import { Pool as PgPool } from 'pg';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use external Neon database URL (for Vercel deployment compatibility)
const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "NEON_DATABASE_URL or DATABASE_URL must be set. Please configure your Neon database connection.",
  );
}

// Neon pool for Drizzle ORM operations
export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });

// Standard pg pool for session store (connect-pg-simple requires standard pg Pool)
// Optimized pool settings for better performance
export const sessionPool = new PgPool({ 
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 10, // Maximum connections in pool
  min: 2,  // Minimum connections to keep ready
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Timeout for new connections
});
