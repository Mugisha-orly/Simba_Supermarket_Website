const express = require('express');
const { orders } = require('../../database/db');
const { requireAuth } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

const router = express.Router();

const DELIVERY_FEE = 2000;

const VALID_STATUSES = [
  'Pending', 'Processing', 'Ready for Pickup',
  'Out for Delivery', 'Delivered', 'Completed', 'Cancelled',
];

// POST /api/orders  — place a new order (auth required)
router.post('/', requireAuth, (req, res) => {
  const { items, type = 'Delivery', branch = null } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const customer = {
    id:      req.user.id,
    name:    req.user.name,
    email:   req.user.email,
    picture: req.user.picture || null,
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const total = subtotal + (type === 'Delivery' ? DELIVERY_FEE : 0);

  const order = orders.insert({
    id:        `ORD-${Date.now()}`,
    userId:    req.user.id,
    customer,
    items,
    type,
    branch,
    total,
    status:    'Pending',
    date:      new Date().toISOString(),
  });

  res.status(201).json(order);
});

// GET /api/orders
router.get('/', requireAuth, (req, res) => {
  let result;
  if (req.user.role === 'admin') {
    result = orders.all();
  } else {
    result = orders.where(o => o.userId === req.user.id);
  }
  // Most recent first
  result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(result);
});

// GET /api/orders/:id
router.get('/:id', requireAuth, (req, res) => {
  const order = orders.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json(order);
});

// PATCH /api/orders/:id/status  — admin only
router.patch('/:id/status', adminOnly, (req, res) => {
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const order = orders.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const updated = orders.updateById(req.params.id, { status });
  res.json(updated);
});

module.exports = router;
