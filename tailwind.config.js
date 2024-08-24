/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          600: '#D9D9D9',
          100: '#020202',
          80: '#525252',
          60: '#919191',
          40: '#D1D1D1',
          20: '#F2F2F2',
          0: '#FFFFFF',
        },
        primary: {
          DEFAULT: '#E30681',
          800: '#EA5A91',
          600: '#FFAEBB',
        },
        secondary: {
          DEFAULT: '#3876B5',
          40: '#ABDAEA',
        },
        accent: '#FFF5D1',
      },
      fontFamily: {
        TC: ["Noto Sans TC", "sans-serif"],
      },
    },
  },
  variants: {

  },
  plugins: [],
};

