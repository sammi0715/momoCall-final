/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E30681",
          800: "#EA5A91",
          600: "#FFAEBB",
        },
        secondary: {
          DEFAULT: "#3876B5",
          400: "#ABDAEA",
        },
        accent: "#FFF5D1",
        black: {
          DEFAULT: "#020202",
          800: "#525252",
          600: "#919191",
          400: "#D1D1D1",
          200: "#F2F2F2",
          0: "#FFFFFF",
        },
      },
      width: {
        container: "375px",
        chatBox: "206px",
        uploadImage: "198px",
        large: "70px",
        middle: "60px",
        small: "36px",
        notice: "21px",
      },
      height: {
        uploadImage: "136px",
        large: "70px",
        middle: "60px",
        small: "36px",
        notice: "21px",
      },
      borderRadius: {
        large: "20px",
      },
      borderWidth: {
        1: "1px",
      },
      fontFamily: {
        TC: ["Noto Sans TC", "sans-serif"],
      },
    },
  },
  plugins: [],
};
