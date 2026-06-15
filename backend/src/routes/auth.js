const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { query } = require('../../database/db');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role, picture: user.picture || null },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function safeUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, picture: u.picture || null };
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required' });
  if (!/\S+@\S+\.\S+/.test(email))
    return res.status(400).json({ error: 'Invalid email address' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const exists = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (exists.rows.length)
    return res.status(409).json({ error: 'An account with this email already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'customer')
     RETURNING *`,
    [name.trim(), email.toLowerCase(), passwordHash]
  );

  res.status(201).json({ user: safeUser(rows[0]), token: signToken(rows[0]) });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  const user = rows[0];
  if (!user || !user.password_hash)
    return res.status(401).json({ error: 'Invalid email or password' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid)
    return res.status(401).json({ error: 'Invalid email or password' });

  res.json({ user: safeUser(user), token: signToken(user) });
});

// ── POST /api/auth/google ─────────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential)
    return res.status(400).json({ error: 'Google credential is required' });

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential, audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ error: 'Invalid Google credential' });
  }

  const { sub: googleId, email, name, picture } = payload;

  // Find by google_id first, then by email
  let { rows } = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);
  let user = rows[0];

  if (!user) {
    const byEmail = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    user = byEmail.rows[0];

    if (user) {
      // Link existing account
      const upd = await query(
        'UPDATE users SET google_id = $1, picture = $2 WHERE id = $3 RETURNING *',
        [googleId, picture, user.id]
      );
      user = upd.rows[0];
    } else {
      // New user via Google
      const ins = await query(
        `INSERT INTO users (name, email, google_id, picture, role)
         VALUES ($1, $2, $3, $4, 'customer') RETURNING *`,
        [name, email.toLowerCase(), googleId, picture]
      );
      user = ins.rows[0];
    }
  }

  res.json({ user: safeUser(user), token: signToken(user) });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Not authenticated' });
  try {
    res.json({ user: jwt.verify(auth.slice(7), process.env.JWT_SECRET) });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
