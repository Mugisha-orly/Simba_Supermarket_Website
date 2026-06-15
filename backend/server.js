require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const { initDb } = require('./database/db');
const authRoutes    = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const orderRoutes   = require('./src/routes/orders');
const aiRoutes      = require('./src/routes/ai');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/ai',       aiRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Simba Supermarket API', db: 'PostgreSQL 16+', timestamp: new Date().toISOString() });
});

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start — wait for DB before accepting traffic ──────────────────────────────
async function start() {
  try {
    await initDb();

    const server = app.listen(PORT, () => {
      console.log(`\n  Simba Supermarket Backend  (PostgreSQL 16+)`);
      console.log(`  Running at  http://localhost:${PORT}`);
      console.log(`  Health:     http://localhost:${PORT}/api/health`);
      console.log(`  Press Ctrl+C to stop\n`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n  ERROR: Port ${PORT} is already in use.`);
        console.error(`  Stop the other process or change PORT in backend/.env\n`);
      } else {
        console.error('Server error:', err.message);
      }
      process.exit(1);
    });

  } catch (err) {
    console.error('\n  Failed to connect to PostgreSQL:', err.message);
    console.error('  Check that DATABASE_URL is set correctly in backend/.env\n');
    process.exit(1);
  }
}

start();
