const express = require('express');
const { query } = require('../../database/db');
const { adminOnly } = require('../middleware/adminOnly');

const router = express.Router();

const VALID_LANGS = ['en', 'fr', 'rw', 'sw'];

function dbRowToProduct(row) {
  return {
    id:            row.id,
    name:          row.name,          // JSONB returned as object by pg driver
    price:         Number(row.price),
    category:      row.category,      // JSONB
    subcategoryId: row.subcategory_id,
    inStock:       row.in_stock,
    image:         row.image,
    unit:          row.unit,
  };
}

// ── GET /api/products ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const { search, category, sort, lang = 'en', inStock } = req.query;
  const safeLang = VALID_LANGS.includes(lang) ? lang : 'en';

  const conditions = [];
  const params     = [];

  if (inStock === 'true') conditions.push('in_stock = TRUE');

  if (category && category !== 'All') {
    params.push(category);
    conditions.push(`category->>'${safeLang}' = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    const n = params.length;
    // Search across all four language fields
    conditions.push(`(
      name->>'en' ILIKE $${n} OR name->>'fr' ILIKE $${n} OR
      name->>'rw' ILIKE $${n} OR name->>'sw' ILIKE $${n} OR
      category->>'en' ILIKE $${n}
    )`);
  }

  const where  = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const order  = sort === 'PriceLow'  ? 'ORDER BY price ASC'
               : sort === 'PriceHigh' ? 'ORDER BY price DESC'
               : '';

  const { rows } = await query(`SELECT * FROM products ${where} ${order}`, params);
  const products  = rows.map(dbRowToProduct);

  res.json({ products, total: products.length });
});

// ── GET /api/products/categories ─────────────────────────────────────────────
router.get('/categories', async (req, res) => {
  const { lang = 'en' } = req.query;
  const safeLang = VALID_LANGS.includes(lang) ? lang : 'en';

  const { rows } = await query(
    `SELECT DISTINCT category->>'${safeLang}' AS cat FROM products ORDER BY cat`
  );
  const cats = rows.map(r => r.cat).filter(Boolean);
  res.json(['All', ...cats]);
});

// ── GET /api/products/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { rows } = await query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Product not found' });
  res.json(dbRowToProduct(rows[0]));
});

// ── PATCH /api/products/:id  (admin only) ─────────────────────────────────────
router.patch('/:id', adminOnly, async (req, res) => {
  const { rows: existing } = await query('SELECT id FROM products WHERE id = $1', [req.params.id]);
  if (!existing.length) return res.status(404).json({ error: 'Product not found' });

  const { inStock, price } = req.body;
  const setClauses = [];
  const params     = [];

  if (inStock !== undefined) { params.push(Boolean(inStock)); setClauses.push(`in_stock = $${params.length}`); }
  if (price   !== undefined) { params.push(Number(price));    setClauses.push(`price    = $${params.length}`); }

  if (!setClauses.length)
    return res.status(400).json({ error: 'No valid fields to update' });

  params.push(req.params.id);
  const { rows } = await query(
    `UPDATE products SET ${setClauses.join(', ')} WHERE id = $${params.length} RETURNING *`,
    params
  );
  res.json(dbRowToProduct(rows[0]));
});

module.exports = router;
