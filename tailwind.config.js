/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1B2A4A',
          navyLight: '#2E4270',
          gold: '#A9812F',
          goldLight: '#C9A55C',
          cream: '#F4F1EA',
          ink: '#2B2B2B',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.45s ease-out both',
        scaleIn: 'scaleIn 0.3s ease-out both',
        pulseSoft: 'pulseSoft 1.6s ease-in-out infinite',
      },
      boxShadow: {
        card: '0 1px 2px rgba(27,42,74,0.06), 0 8px 24px -8px rgba(27,42,74,0.18)',
      },
    },
  },
  plugins: [],
}
