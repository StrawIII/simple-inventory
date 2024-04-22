/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-light": "#0065bd",
        "primary-dark": "#0c345f",
      },
    },
  },
  plugins: [],
};
