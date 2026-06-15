require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const path = require('path');
const fs   = require('fs');
const { initDb, products } = require('./db');

function seed() {
  initDb();

  const existing = products.count();
  if (existing > 0) {
    console.log(`Products already seeded (${existing} records). Skipping.`);
    console.log('To re-seed, delete database/data/products.json and run again.');
    return;
  }

  const dataPath = path.join(__dirname, 'simba_products.json');
  if (!fs.existsSync(dataPath)) {
    console.error('simba_products.json not found at', dataPath);
    process.exit(1);
  }

  const raw  = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw);
  const prods = data.products || [];

  for (const p of prods) {
    products.insert({
      id:            p.id,
      name:          p.name,
      price:         p.price,
      category:      p.category,
      subcategoryId: p.subcategoryId || null,
      inStock:       p.inStock !== false,
      image:         p.image || null,
      unit:          p.unit  || null,
    });
  }

  console.log(`Seeded ${prods.length} products into database/data/products.json`);
}

seed();
