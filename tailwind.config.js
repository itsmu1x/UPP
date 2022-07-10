/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '**/*.ejs'
  ],
  theme: {
    extend: {
      screens: {
        sm: '360px',
        md: '720px'
      }
    },
  },
  plugins: [],
}
