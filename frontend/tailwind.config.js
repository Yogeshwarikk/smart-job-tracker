/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f0f0f5',
          100: '#e0e0eb',
          200: '#c2c2d6',
          300: '#9494ba',
          400: '#6b6b9e',
          500: '#4d4d82',
          600: '#3c3c6b',
          700: '#2d2d54',
          800: '#1e1e3d',
          900: '#0f0f26',
          950: '#07071a',
        },
        electric: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        lime: {
          400: '#a3e635',
          500: '#84cc16',
        },
        coral: '#f87171',
        amber: '#fbbf24',
      },
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
