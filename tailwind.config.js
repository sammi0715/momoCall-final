/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: {
          900: "#020202",
          600: "#D9D9D9",
          300: "#eeeeee",
          60: "#919191",
          20: "F2F2F2",
        },
        primary: {
          DEFAULT: "#E30681",
          800: "#EA5A91",
          600: "#FFAEBB",
        },
        secondary: {
          DEFAULT: "#3876B5",
          40: "#ABDAEA",
        },
        accent: "#FFF5D1",
      },
      fontFamily: {
        TC: ["Noto Sans TC", "sans-serif"],
      },
    },
  },
  plugins: [],
};
