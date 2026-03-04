/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pipeline: {
          idea: '#8b5cf6',
          research: '#3b82f6',
          outline: '#06b6d4',
          draft: '#f59e0b',
          media: '#ec4899',
          review: '#f97316',
          approved: '#22c55e',
          published: '#10b981',
        }
      }
    },
  },
  plugins: [],
}
