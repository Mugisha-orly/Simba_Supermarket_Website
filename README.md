# Simba Supermarket — Full-Stack Application

Rwanda's online supermarket, built with React (Vite) on the frontend and Node.js (Express) on the backend.

```
Simba_Supermarket_Website/
├── frontend/   — React 19 + Vite + Tailwind + i18next
└── backend/    — Node.js + Express REST API
```

---

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env      # fill in JWT_SECRET, GEMINI_API_KEY, GOOGLE_CLIENT_ID
npm install
npm run seed              # seeds 789 products into database/data/products.json
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

**Backend:** Node.js, Express 4, JSON file store (no native deps), bcryptjs, jsonwebtoken, Google Auth Library, Google Generative AI (Gemini)

---

## Making a User Admin

The `database/data/users.json` file stores all users. To grant admin access, open the file and change `"role": "customer"` to `"role": "admin"` for the desired user, then restart the backend.
