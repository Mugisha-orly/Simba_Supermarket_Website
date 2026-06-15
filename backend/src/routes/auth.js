const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { users } = require('../../database/db');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role, picture: user.picture || null },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function safeUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, picture: user.picture || null };
}

function nextUserId() {
  const all = users.all();
  return all.length === 0 ? 1 : Math.max(...all.map(u => u.id)) + 1;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = users.findOne(u => u.email === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = users.insert({
    id:           nextUserId(),
    name:         name.trim(),
    email:        email.toLowerCase(),
    passwordHash,
    googleId:     null,
    role:         'customer',
    picture:      null,
    createdAt:    new Date().toISOString(),
  });

  res.status(201).json({ user: safeUser(user), token: signToken(user) });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.findOne(u => u.email === email.toLowerCase());
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({ user: safeUser(user), token: signToken(user) });
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Google credential is required' });
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken:  credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ error: 'Invalid Google credential' });
  }

  const { sub: googleId, email, name, picture } = payload;

  let user = users.findOne(u => u.googleId === googleId);

  if (!user) {
    user = users.findOne(u => u.email === email.toLowerCase());
    if (user) {
      user = users.updateById(user.id, { googleId, picture });
    } else {
      user = users.insert({
        id:        nextUserId(),
        name,
        email:     email.toLowerCase(),
        passwordHash: null,
        googleId,
        role:      'customer',
        picture,
        createdAt: new Date().toISOString(),
      });
    }
  }

  res.json({ user: safeUser(user), token: signToken(user) });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
