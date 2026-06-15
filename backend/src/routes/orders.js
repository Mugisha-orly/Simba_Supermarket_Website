const express = require('express');
const { query } = require('../../database/db');
const { requireAuth } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

const router = express.Router();

const DELIVERY_FEE = 2000;

const VALID_STATUSES = [
  'Pending', 'Processing', 'Ready for Pickup',
  'Out for Delivery', 'Delivered', 'Completed', 'Cancelled',
];

function dbRowToOrder(row) {
  return {
    id:       row.id,
    userId:   row.user_id,
    customer: row.customer,   // JSONB
    items:    row.items,      // JSONB
    type:     row.type,
    branch:   row.branch,     // JSONB
    total:    Number(row.total),
    status:   row.status,
    date:     row.created_at,
  };
}

// ── POST /api/orders  (auth required) ────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  const { items, type = 'Delivery', branch = null } = req.body;

  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'Order must contain at least one item' });

  const customer = {
    id: req.user.id, name: req.user.name,
    email: req.user.email, picture: req.user.picture || null,
  };

  const subtotal = items.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const total    = subtotal + (type === 'Delivery' ? DELIVERY_FEE : 0);
  const orderId  = `ORD-${Date.now()}`;

  const { rows } = await query(
    `INSERT INTO orders (id, user_id, customer, items, type, branch, total, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending')
     RETURNING *`,
    [
      orderId,
      req.user.id,
      JSON.stringify(customer),
      JSON.stringify(items),
      type,
      branch ? JSON.stringify(branch) : null,
      total,
    ]
  );

  res.status(201).json(dbRowToOrder(rows[0]));
});

// ── GET /api/orders ───────────────────────────────────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  let result;
  if (req.user.role === 'admin') {
    result = await query('SELECT * FROM orders ORDER BY created_at DESC');
  } else {
    result = await query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
  }
  res.json(result.rows.map(dbRowToOrder));
});

// ── GET /api/orders/:id ───────────────────────────────────────────────────────
router.get('/:id', requireAuth, async (req, res) => {
  const { rows } = await query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Order not found' });

  const order = dbRowToOrder(rows[0]);
  if (req.user.role !== 'admin' && order.userId !== req.user.id)
    return res.status(403).json({ error: 'Access denied' });

  res.json(order);
});

// ── PATCH /api/orders/:id/status  (admin only) ───────────────────────────────
router.patch('/:id/status', adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status))
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });

  const { rows } = await query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
    [status, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Order not found' });
  res.json(dbRowToOrder(rows[0]));
});

module.exports = router;
