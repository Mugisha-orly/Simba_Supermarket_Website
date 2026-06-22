# Simba Supermarket — Full-Stack Application

> **Rwanda's #1 premium online supermarket** — React + Vite frontend, Node.js + Express backend, PostgreSQL 16+

---

## ✅ Feature Checklist

| Feature | Status | Evidence |
|---------|--------|----------|
| **Product Catalog** | ✅ | 789 seeded products, browsable on homepage |
| **Search & Filtering** | ✅ | Search bar (desktop + mobile), category filter, sort by price |
| **Cart & Checkout** | ✅ | Add to cart, qty controls, delivery/pickup toggle, branch selector |
| **User Registration** | ✅ | Click "Sign In" → Register tab → form with name/email/password |
| **User Login** | ✅ | Click "Sign In" → Login tab or Google OAuth one-tap |
| **Order Placement** | ✅ | Authenticated checkout → order saved to PostgreSQL |
| **Order Tracking** | ✅ | "My Account" → My Orders dashboard with status tracking |
| **Mobile-First Design** | ✅ | Sticky search bar, slide-out menu, all features work at 320px |
| **Language Switcher** | ✅ | Globe icon in top bar + mobile menu — switches EN/FR/RW/SW |
| **EN Translations** | ✅ | All UI strings fully translated |
| **FR Translations** | ✅ | All UI strings fully translated in French |
| **RW Translations** | ✅ | All UI strings fully translated in Kinyarwanda |
| **SW Translations** | ✅ | All UI strings fully translated in Kiswahili |
| **Dark Mode** | ✅ | Toggle in top bar and mobile menu |
| **Google OAuth** | ✅ | Sign in with Google (one-tap + redirect) |
| **Admin Dashboard** | ✅ | Admin role → manage products, toggle stock, update order status |
| **AI Product Search** | ✅ | Gemini-powered floating AI assistant |
| **Wishlist** | ✅ | Save items, add-all-to-cart |
| **Branch Map** | ✅ | Leaflet map with all Simba branches |
| **Env Vars Secured** | ✅ | `.env.example` provided, secrets not in repo |

---

## 🚀 Quick Start for Graders

### Test the Live Demo

> **Frontend URL:** [Insert your deployed URL here]

**Grader Demo Credentials** (if DB is seeded):

| Role | Email | Password |
|------|-------|----------|
| Customer | `demo@simba.rw` | `demo123` |
| Admin | `admin@simba.rw` | `admin123` |

To make a user admin via SQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### How to test key flows:

1. **Login/Register**: Click **"Sign In"** in the navbar → Login or Register tab
2. **Language switch**: Click the 🌐 globe icon in the top bar → pick EN/FR/RW/SW
3. **Search**: Type in the search bar (desktop) or the sticky bar on mobile
4. **Filter by category**: Click **"All Categories"** dropdown or the category pills
5. **Sort by price**: Use the "Sort by" dropdown on the products section
6. **Cart**: Click any **"Add to Cart"** button → open cart icon → Place Order
7. **Mobile**: Resize to ≤768px → tap hamburger → full menu with language + auth
8. **Admin panel**: Login as admin → Admin button appears in navbar

---

## 📦 Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 16+

### 1. Database

```bash
psql -U postgres
CREATE DATABASE simba_supermarket;
\q
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, GOOGLE_CLIENT_ID
npm install
npm run migrate    # creates tables: users, products, orders
npm run seed       # inserts 789 products with 4-language names
npm run dev        # http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env: set VITE_GOOGLE_CLIENT_ID
npm install
npm run dev        # http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend automatically.

---

## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| GET | `/api/products` | — | List products (`?lang=en&category=&search=&sort=PriceLow`) |
| GET | `/api/products/categories` | — | Category list |
| GET | `/api/products/:id` | — | Single product |
| PATCH | `/api/products/:id` | Admin JWT | Toggle stock / update price |
| POST | `/api/auth/register` | — | Register (name, email, password) |
| POST | `/api/auth/login` | — | Login → JWT |
| POST | `/api/auth/google` | — | Google OAuth → JWT |
| GET | `/api/auth/me` | JWT | Verify token |
| POST | `/api/orders` | JWT | Place order |
| GET | `/api/orders` | JWT | List orders (admin: all; customer: own) |
| GET | `/api/orders/:id` | JWT | Single order |
| PATCH | `/api/orders/:id/status` | Admin JWT | Update order status |
| POST | `/api/ai/recommend` | — | Gemini AI recommendations |

---

## 🌍 Internationalization (i18n)

Supported languages — switch using the 🌐 globe icon or mobile menu:

| Language | Code | Coverage |
|----------|------|----------|
| English | `en` | 100% |
| Français | `fr` | 100% |
| Kinyarwanda | `rw` | 100% |
| Kiswahili | `sw` | 100% |

Product names and categories are stored as JSONB in PostgreSQL with all 4 languages.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Framer Motion, i18next |
| **Styling** | Tailwind CSS 3 + Vanilla CSS design system |
| **Auth** | JWT + Google OAuth 2.0 (`@react-oauth/google`) |
| **Backend** | Node.js, Express 4 |
| **Database** | PostgreSQL 16+ (`pg` / node-postgres) |
| **AI** | Google Gemini (`@google/generative-ai`) |
| **Maps** | Leaflet + React-Leaflet |

---

## 🔐 Environment Variables

### `backend/.env`

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/simba_supermarket
JWT_SECRET=your-super-secret-key-change-in-production
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env`

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_URL=
```

---

## 📁 Project Structure

```
Simba_Supermarket_Website/
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Hero, ProductGrid, CartDrawer, AuthModal, ...
│   │   ├── locales/          # EN, FR, RW, SW translation JSONs
│   │   ├── data/             # Branch data
│   │   ├── utils/            # Helpers
│   │   ├── App.jsx           # Root component with all state
│   │   ├── i18n.js           # i18next configuration
│   │   └── index.css         # Premium design system (CSS variables)
│   └── vite.config.js
└── backend/
    ├── src/
    │   ├── routes/           # auth.js, products.js, orders.js, ai.js
    │   └── middleware/       # adminOnly.js, auth.js
    ├── database/
    │   ├── db.js             # PostgreSQL connection pool
    │   ├── migrate.js        # Schema creation
    │   ├── seed.js           # 789 products seeder
    │   └── simba_products.json
    └── server.js
```
