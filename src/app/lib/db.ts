import { Pool } from "pg";
import { neon } from "@neondatabase/serverless";

const isProduction = process.env.NODE_ENV === "production";
neon(process.env.DATABASE_URL!, {
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