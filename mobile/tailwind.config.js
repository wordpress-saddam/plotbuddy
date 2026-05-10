/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#fb923c',
          DEFAULT: '#C2410C',
          dark: '#9a3412',
        },
      }
    },
  },
  plugins: [],
}
