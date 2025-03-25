import { Pool } from "pg";

const pool = new Pool({
  connectionString: Bun.env.DATABASE_URL,
});

export default pool;
