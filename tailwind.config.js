/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cinnabar: {
          DEFAULT: '#ef3e36',
          hover: '#d9342c',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#ef3e36',
          500: '#ef3e36',
          600: '#d9342c',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        'shadow-grey': {
          DEFAULT: '#2e282a',
          dark: '#1e191b',
          light: '#3d3538',
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#44403c',
          700: '#3d3538',
          800: '#2e282a',
          900: '#1e191b',
          950: '#1e191b',
        },
      },
    },
  },
  plugins: [],
}
