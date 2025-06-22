import { Pool } from "pg";
import { neon } from "@neondatabase/serverless";

const isProduction = process.env.NODE_ENV === "production";
neon("postgres://neondb_owner:D8Amknrls7BR@ep-royal-firefly-a4ost6fl-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require", {
  fullResults: true
});

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

export default pool;