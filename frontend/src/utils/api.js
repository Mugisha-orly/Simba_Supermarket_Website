// Base URL for all API calls.
// In production (Vercel), set VITE_API_URL to your Render backend URL.
// e.g. https://your-backend.onrender.com
// Locally it falls back to empty string (uses Vite proxy).
const API_BASE = import.meta.env.VITE_API_URL || '';

export default API_BASE;
