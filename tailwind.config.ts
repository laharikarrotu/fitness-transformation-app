// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
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
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: '#22c55e', // use energetic green as primary
          secondary: '#2563eb', // blue as secondary
          accent: '#f97316', // orange as accent
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          fitness: {
            green: '#22c55e', // energetic green
            blue: '#2563eb',  // vibrant blue
            orange: '#f97316', // energetic orange
            dark: '#101820',   // deep background
            light: '#f8fafc',  // clean white
            accent: '#38bdf8', // accent blue
          },
        },
        backgroundImage: {
          'fitness-gradient': 'linear-gradient(135deg, #22c55e 0%, #2563eb 100%)',
          'fitness-radial': 'radial-gradient(circle at 20% 20%, #22c55e 0%, #2563eb 100%)',
        },
        boxShadow: {
          fitness: '0 4px 24px 0 rgba(34,197,94,0.15), 0 1.5px 6px 0 rgba(37,99,235,0.10)',
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
    plugins: [require("tailwindcss-animate")],
  }