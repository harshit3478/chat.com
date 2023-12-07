/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: ["./html/*.html" ,"./javascript/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      width:{
        74 : '74%',
        26 : '26%',
        27 : '27%',
        28 : '28%',
        29 : '29%',
      },
      minWidth:{
        700 : '700px',
      }
    },
  },
  plugins: [],
}

