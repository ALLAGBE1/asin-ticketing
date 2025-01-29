/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          customGreen: '#014E13', // Ajoute ta couleur ici
          customYellow: '#FFED00',
          customWhite: '#FFFFFF',
          customGray: '#F8F7F7',
          customGrayLight: '#837F7F',
          customGrayLightOpacity: '#EBEAEA',
          customGrayLightOpacityOne: '#C4C4C4',
          customGrayLightOpacityTwo: '#A39D9D',
          customBlack: '#000000',
          customDarkGreen: '#014E13',
          customLightGray: '#CDCDCD',
          customBlue: '#51259B'
          
          
        },
        keyframes: {
          blink: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0 },
          },
        },
        animation: {
          blink: 'blink 1s infinite',
        },
      },
    },
    plugins: [],
  }
  
  