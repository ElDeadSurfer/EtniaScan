/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        oscuro: {
          DEFAULT: '#1C1612',
          50: '#2A231E',
          100: '#15100D',
          200: '#0F0C0A',
        },
        cobre: {
          DEFAULT: '#B87333',
          light: '#D4925A',
          dark: '#8B5A2B',
          muted: 'rgba(184, 115, 51, 0.2)',
        },
        arena: {
          DEFAULT: '#E8DCC8',
          light: '#F5EFE6',
          dark: '#C4B59A',
          muted: 'rgba(232, 220, 200, 0.6)',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
