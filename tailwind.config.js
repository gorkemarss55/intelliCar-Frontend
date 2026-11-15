/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EAF4F7', 100: '#D3E8EE', 200: '#A9D0DC', 300: '#78B3C5', 400: '#3F90A8',
          500: '#1B7A94', 600: '#0F6078', 700: '#0E4D64', 800: '#0B3B4D', 900: '#082B39',
        },
        accent: { 300: '#F9D36B', 400: '#F5B921', 500: '#E8A600', 600: '#C98A00' },
        ink: '#18212B',
        muted: '#5B6773',
        line: '#E3E7EB',
        surface: '#F3F5F7',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Public Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(24,33,43,.06), 0 8px 24px -12px rgba(24,33,43,.18)',
      },
    },
  },
  plugins: [],
}
