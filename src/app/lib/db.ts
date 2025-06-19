import { Pool } from "pg";

const isProduction = process.env.NODE_ENV === "production";

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