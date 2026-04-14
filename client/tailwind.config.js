/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
};
