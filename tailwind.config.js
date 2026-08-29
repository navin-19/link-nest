/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f9ff',
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
      },
      boxShadow: {
        'xs':          '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft':        '0 2px 8px -1px rgba(0, 0, 0, 0.06), 0 1px 3px -1px rgba(0, 0, 0, 0.04)',
        'card':        '0 4px 16px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover':  '0 12px 24px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'btn':         '0 2px 6px -1px rgba(15, 23, 42, 0.12), 0 1px 3px 0 rgba(15, 23, 42, 0.08)',
        'btn-hover':   '0 6px 16px -2px rgba(15, 23, 42, 0.16), 0 2px 6px -1px rgba(15, 23, 42, 0.08)',
        'btn-primary': '0 4px 14px 0 rgba(15, 23, 42, 0.25)',
        'btn-brand':   '0 4px 14px 0 rgba(2, 132, 199, 0.35)',
        'glass':       '0 8px 30px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in':       'fadeIn 0.3s ease-in-out',
        'slide-up':      'slideUp 0.3s ease-out',
        'slide-down':    'slideDown 0.25s ease-out',
        'scale-in':      'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
