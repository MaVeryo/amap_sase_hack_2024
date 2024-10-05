/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#16151c',
        'dashboard': '#151321',
        'table': '#1f1e21'
      }
    },
  },
  plugins: [],
}

