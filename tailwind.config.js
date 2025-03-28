/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  theme: {
    screens: {
      xs: '200px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      //p-desktop-padding
      spacing: {
        'desktop-padding': '40px',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        sub: ['Roboto', 'sans-serif'],
      },
      colors: {
        white: ' #FFFFFF',
        black: '#000000',
        primary: '#f0d0b3',
        secondary: '#4b2e1e',
        price: '#E8E8E8',
        del: '#D84315',
        //
        'gray-50': '#ababab',
        'gray-100': '#969696',
        'gray-200': '#828282',
        'gray-300': '#6f6f6f',
      },
      boxShadow: {
        //shadow
        sideBar: '10px 0 30px -2px #D9D9D9',
        mainMenu: '0px 4px 12.100000381469727px 0px #00000040',
        tableItem: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        headerMenu: 'rgba(0, 0, 0, 0.1) 0px 2px 1px 0px',
      },
      borderRadius: {
        //rounded
        modal: '16px',
      },
      animation: {
        //animate
      },
    },
  },
  corePlugins: {
    animation: true,
  },
  plugins: [require('tailwind-scrollbar'), require('tailwind-scrollbar-hide')],
};
