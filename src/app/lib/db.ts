import { Pool } from "pg";
import { neon } from "@neondatabase/serverless"

const isProduction = process.env.NODE_ENV === "production";
neon("postgres://neondb_owner:D8Amknrls7BR@ep-royal-firefly-a4ost6fl-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require", {
  fullResults: true
});

const pool = new Pool({
  host: process.env.DATABASE_PGHOST,
  user: process.env.DATABASE_PGUSER,
  password: process.env.DATABASE_PGPASSWORD,
  database: process.env.DATABASE_PGDATABASE,
  port: process.env.DATABASE_PGPORT ? parseInt(process.env.DATABASE_PGPORT) : 5432,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

export default pool;