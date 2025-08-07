// tailwind.config.ts
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'fitness-green': {
          DEFAULT: '#22c55e', // vibrant green
          dark: '#15803d',
        },
        'fitness-blue': {
          DEFAULT: '#2563eb', // strong blue
          dark: '#1e40af',
        },
        'fitness-orange': {
          DEFAULT: '#f97316', // energetic orange
          dark: '#c2410c',
        },
        'fitness-dark': {
          DEFAULT: '#18181b', // deep dark
          light: '#23272f',
        },
        'fitness-light': {
          DEFAULT: '#f8fafc', // very light
          dark: '#e5e7eb',
        },
        'fitness-bg': {
          DEFAULT: '#f4f6fa', // soft background
          dark: '#101112',
        },
        'fitness-card': {
          DEFAULT: '#fff',
          dark: '#23272f',
        },
        'fitness-border': {
          DEFAULT: '#e5e7eb',
          dark: '#23272f',
        },
        'fitness-accent': {
          DEFAULT: '#06b6d4', // cyan accent
          dark: '#0e7490',
        },
        // Add a generic 'border' color for border-border utility
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#23272f',
        },
      },
      boxShadow: {
        fitness: '0 2px 16px 0 rgba(34,197,94,0.08)',
      },
      backgroundImage: {
        'fitness-gradient': 'linear-gradient(135deg, #f4f6fa 0%, #e0f7fa 100%)',
        'fitness-gradient-dark': 'linear-gradient(135deg, #18181b 0%, #23272f 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar')],
};