/**
 * Seeds the PostgreSQL products table from simba_products.json.
 * Run: npm run seed
 * Safe to run multiple times — uses ON CONFLICT DO NOTHING.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const path = require('path');
const fs   = require('fs');
const { query, initDb, getPool } = require('./db');

const BATCH_SIZE = 100;

async function seed() {
  await initDb();

  const { rows } = await query('SELECT COUNT(*)::int AS count FROM products');
  if (rows[0].count > 0) {
    console.log(`Products already seeded (${rows[0].count} rows). Skipping.`);
    console.log('To re-seed, run: DELETE FROM products; then npm run seed');
    return;
  }

  const dataPath = path.join(__dirname, 'simba_products.json');
  if (!fs.existsSync(dataPath)) {
    console.error('simba_products.json not found at', dataPath);
    process.exit(1);
  }

  const { products } = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`Inserting ${products.length} products in batches of ${BATCH_SIZE}…`);

  let inserted = 0;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch  = products.slice(i, i + BATCH_SIZE);
    const values = batch.map((_, j) => {
      const base = j * 7;
      return `($${base+1}, $${base+2}, $${base+3}, $${base+4}, $${base+5}, $${base+6}, $${base+7})`;
    }).join(', ');

    const params = batch.flatMap(p => [
      p.id,
      JSON.stringify(p.name),
      p.price,
      JSON.stringify(p.category),
      p.subcategoryId ?? null,
      p.inStock !== false,
      p.image ?? null,
    ]);

    await query(
      `INSERT INTO products (id, name, price, category, subcategory_id, in_stock, image)
       VALUES ${values}
       ON CONFLICT (id) DO NOTHING`,
      params
    );
    inserted += batch.length;
    process.stdout.write(`\r  ${inserted} / ${products.length}`);
  }

  console.log(`\nSeeded ${inserted} products successfully.`);
}

seed()
  .catch(err => { console.error('Seed failed:', err.message); process.exit(1); })
  .finally(() => getPool().end());
