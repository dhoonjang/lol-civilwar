module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        roman: ['var(--font-roman)'],
      },
    },
    screens: {
      xs: '480px',
      sm: '720px',
      md: '1080px',
    },
    container: {
      center: true,
    },
  },
  plugins: [],
};
