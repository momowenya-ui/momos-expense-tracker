/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-pink': {
          50: '#fef9f5',
          100: '#fef0eb',
          200: '#fdd9cc',
          300: '#fcc4b0',
          400: '#fbae94',
          500: '#f99878',
          600: '#f5845f',
          700: '#e97047',
          800: '#c65a38',
          900: '#a3482d',
        },
        'soft-pink': '#ffc9e3',
        'light-pink': '#ffe0f0',
        'cream': '#fffbf7',
      },
      fontFamily: {
        sans: ['Segoe UI', 'HarmonyOS', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
