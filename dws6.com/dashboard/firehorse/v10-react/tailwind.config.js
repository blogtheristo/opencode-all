/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        nordic: {
          blue: '#003f5c',
          light: '#58508d',
          purple: '#bc5090',
          pink: '#ff6361',
          orange: '#ffa600',
        }
      },
    },
  },
  plugins: [],
}
