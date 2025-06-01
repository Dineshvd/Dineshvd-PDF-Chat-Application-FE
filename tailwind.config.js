/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          50: '#EBF2FF',
          100: '#D6E4FF',
          200: '#A9C9FF',
          300: '#7CABFF',
          400: '#4F8EFC',
          500: '#3B82F6',
          600: '#0B5CEA',
          700: '#0747B8',
          800: '#053285',
          900: '#021D53',
        },
        destructive: {
          DEFAULT: '#FF4D4D',
          foreground: '#FFFFFF',
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};