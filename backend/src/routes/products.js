const express = require('express');
const { products } = require('../../database/db');
const { adminOnly } = require('../middleware/adminOnly');

const router = express.Router();

function resolveLocale(obj, lang) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || Object.values(obj)[0] || '';
}

// GET /api/products
router.get('/', (req, res) => {
  const { search, category, sort, lang = 'en', inStock } = req.query;

  let result = products.all();

  if (inStock === 'true') {
    result = result.filter(p => p.inStock);
  }

  if (category && category !== 'All') {
    result = result.filter(p => resolveLocale(p.category, lang) === category);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      resolveLocale(p.name, lang).toLowerCase().includes(q) ||
      resolveLocale(p.category, lang).toLowerCase().includes(q)
    );
  }

  if (sort === 'PriceLow')  result.sort((a, b) => a.price - b.price);
  if (sort === 'PriceHigh') result.sort((a, b) => b.price - a.price);

  res.json({ products: result, total: result.length });
});

// GET /api/products/categories
router.get('/categories', (req, res) => {
  const { lang = 'en' } = req.query;
  const all = products.all();
  const cats = [...new Set(all.map(p => resolveLocale(p.category, lang)).filter(Boolean))];
  res.json(['All', ...cats]);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = products.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// PATCH /api/products/:id  — admin only
router.patch('/:id', adminOnly, (req, res) => {
  const product = products.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const { inStock, price } = req.body;
  const updates = {};
  if (inStock !== undefined) updates.inStock = Boolean(inStock);
  if (price   !== undefined) updates.price   = Number(price);

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const updated = products.updateById(req.params.id, updates);
  res.json(updated);
});

module.exports = router;
