/** @type {import('tailwindcss').Config} */
export default {
  // content: [
  //   "./index.html",
  //   "./src/**/*.{js,ts,jsx,tsx}",
  // ],
  content: [
    "./index.html",,
    "./pages//*.{ts,tsx}", "./components//*.{ts,tsx}", "./app//*.{ts,tsx}", "./src//*.{ts,tsx}"
    ],
  theme: {
    extend: {},
  },
  plugins: [],
}
