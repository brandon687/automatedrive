/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'luxury-charcoal': '#1a1a1f',
        'luxury-charcoal-light': '#2a2a35',
        'luxury-platinum': '#e8e8f0',
        'luxury-silver': '#a8a8b8',
        'luxury-gold': '#d4af37',
        'luxury-gold-light': '#e5c158',
        'luxury-gold-dark': '#b8962f',
      },
    },
  },
  plugins: [],
}
