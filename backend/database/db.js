/**
 * PostgreSQL connection pool (node-postgres / pg).
 * Requires PostgreSQL 16 or newer.
 *
 * Set DATABASE_URL in backend/.env, e.g.:
 *   postgresql://postgres:password@localhost:5432/simba_supermarket
 */
const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Uncomment for Render / Railway / Supabase (SSL required):
      // ssl: { rejectUnauthorized: false },
    });

    pool.on('error', (err) => {
      console.error('PostgreSQL pool error:', err.message);
    });
  }
  return pool;
}

/**
 * Run a parameterised SQL query.
 * @param {string} text  SQL with $1, $2, … placeholders
 * @param {any[]}  [params]
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params) {
  const client = await getPool().connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

/**
 * Create all tables (idempotent – safe to run on every startup).
 * Requires PostgreSQL 16+.
 */
async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(255)  NOT NULL,
      email         VARCHAR(255)  UNIQUE NOT NULL,
      password_hash TEXT,
      google_id     VARCHAR(255)  UNIQUE,
      role          VARCHAR(50)   NOT NULL DEFAULT 'customer',
      picture       TEXT,
      created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id              INTEGER       PRIMARY KEY,
      name            JSONB         NOT NULL,
      price           NUMERIC(12,2) NOT NULL,
      category        JSONB         NOT NULL,
      subcategory_id  INTEGER,
      in_stock        BOOLEAN       NOT NULL DEFAULT TRUE,
      image           TEXT,
      unit            VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id          VARCHAR(60)   PRIMARY KEY,
      user_id     INTEGER       REFERENCES users(id) ON DELETE SET NULL,
      customer    JSONB         NOT NULL,
      items       JSONB         NOT NULL,
      type        VARCHAR(50)   NOT NULL DEFAULT 'Delivery',
      branch      JSONB,
      total       NUMERIC(12,2) NOT NULL,
      status      VARCHAR(100)  NOT NULL DEFAULT 'Pending',
      created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_orders_user_id  ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status   ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_products_stock  ON products(in_stock);
  `);

  console.log('PostgreSQL tables ready.');
}

module.exports = { query, initDb, getPool };
