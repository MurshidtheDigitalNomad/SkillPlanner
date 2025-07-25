/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        rubik:['Rubik', 'sans-serif'],
        poppins:['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

