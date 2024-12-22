/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    sm: '480px',
    md: '768px',
    lg: '976px',
    xl: '1440px',
    extend: {
      colors: {
          'classicGreen': '#45ba7e',
          'classicPurple': '#6370f0',
          'classicRed': '#BA4581',
          'classicBlue': '#4547BA',
          'classicYellow': '#E1C16E',
          'classicWhite': '#f5f5f5',
          'classicGrey': '#858383',
          'classicBackground': '#333',
          'hoverGrey': '#464545',
        },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'spacing': 'margin, padding',
      },
      fontFamily: {
        'news': ['"Newsreader"', 'serif'],
      },
      gridTemplateColumns: {
        '2': 'repeat(2, minmax(0, 405px))',
        '3': 'repeat(3, minmax(0, 1fr))',
      },
    },
    plugins: [],
  },
};
