# Simba Supermarket — Full-Stack Application

Rwanda's online supermarket, built with React (Vite) on the frontend and Node.js (Express) on the backend.

```
Simba_Supermarket_Website/
├── frontend/   — React 19 + Vite + Tailwind + i18next
└── backend/    — Node.js + Express REST API
```

---

## Quick Start

### 1. PostgreSQL (required — version 16 or newer)

```bash
# macOS
brew install postgresql@16 && brew services start postgresql@16

# Ubuntu / Debian
sudo apt install postgresql-16

# Windows — download installer from https://www.postgresql.org/download/windows/
```

Create the database:
```sql
psql -U postgres
CREATE DATABASE simba_supermarket;
\q
```

### 2. Backend

```bash
cd backend
cp .env.example .env      # set DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, GOOGLE_CLIENT_ID
npm install
npm run migrate           # creates tables (users, products, orders)
npm run seed              # inserts 789 products
npm run dev               # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # fill in VITE_GOOGLE_CLIENT_ID
npm install
npm run dev               # starts on http://localhost:5173
```

The Vite dev server automatically proxies `/api/*` requests to the backend at `localhost:5000`.

---

## Backend API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products (`?lang=en&category=&search=&sort=PriceLow`) |
| GET | `/api/products/categories` | Unique category list |
| GET | `/api/products/:id` | Single product |
| PATCH | `/api/products/:id` | Toggle stock — admin only |
| POST | `/api/auth/register` | Register with email & password |
| POST | `/api/auth/login` | Login → returns JWT |
| POST | `/api/auth/google` | Google OAuth → returns JWT |
| GET | `/api/auth/me` | Verify JWT |
| POST | `/api/orders` | Place order (JWT required) |
| GET | `/api/orders` | List orders (admin: all; customer: own) |
| GET | `/api/orders/:id` | Single order |
| PATCH | `/api/orders/:id/status` | Update status — admin only |
| POST | `/api/ai/recommend` | Gemini AI product recommendations |

---

## Environment Variables

### `backend/.env`
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5000`) |
| `FRONTEND_URL` | Allowed CORS origin (default `http://localhost:5173`) |
| `JWT_SECRET` | Secret for signing JWTs — **change in production** |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GEMINI_API_KEY` | Google AI Studio API key |

### `frontend/.env`
| Variable | Description |
|----------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID (same as backend) |

---

## Tech Stack

**Frontend:** React 19, Vite 8, Tailwind CSS 3, Framer Motion, i18next (EN/FR/RW/SW), Lucide icons

**Backend:** Node.js, Express 4, **PostgreSQL 16+** (via `pg` / node-postgres), bcryptjs, jsonwebtoken, Google Auth Library, Google Generative AI (Gemini)

---

## Making a User Admin

```sql
psql -U postgres -d simba_supermarket
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

The user's JWT will carry the `admin` role on next login.
