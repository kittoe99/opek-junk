/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#520f96',
          50: '#faf7ff',
          100: '#eee5f8',
          400: '#7b28c4',
          500: '#520f96',
          600: '#3a0a6b',
          700: '#30095a',
        },
        secondary: {
          DEFAULT: '#2b2236',
          50: '#faf7ff',
          100: '#e6ddec',
          200: '#d5c7e3',
          300: '#9784a6',
          400: '#72617e',
          500: '#2b2236',
          600: '#241a30',
          700: '#140a1f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
