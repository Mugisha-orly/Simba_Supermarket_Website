/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        'primary-light': 'var(--primary-light)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        'text-dark': 'var(--text-dark)',
        'text-muted': 'var(--text-muted)',
        'bg-soft': 'var(--bg-soft)',
        'orange-soft': '#FFF3E0',
        'orange-50': '#FFF8F5',
        'orange-100': '#FFE0B2',
        'orange-200': '#FFCC80',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        premium: '0 25px 50px -12px rgba(255, 87, 34, 0.1)',
        card: '0 10px 30px -5px rgba(0, 0, 0, 0.04)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
}
