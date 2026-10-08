/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#1A1A1D",
        secondary: "#C8C8C8",
        tertiary: "#4E4E50",
        "black-100": "#202022",
        "black-200": "#151516",
        "white-100": "#F5F5F2",
        brandOrange: "#C3073F",
        brandOrangeLight: "#950740",
      },
      boxShadow: {
        card: "0px 24px 80px -28px rgba(0, 0, 0, 0.8)",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
    },
  },
  plugins: [],
};
