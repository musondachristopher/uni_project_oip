/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')


export default {
  content: [
    "./src/**/*.{html,js,jsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
    	fontFamily: {
    		sans: ["Nunito", "sans", "sans-serif"]
    	},
      colors: {
        primary: {...colors.orange}
      }
    },
  },
  plugins: [require("flowbite/plugin")],
};

