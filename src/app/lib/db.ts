import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on("error", (err: Error) => {
  console.error(`An an unexpected error occurred with the database connection: ${err}`);
});

export default pool;