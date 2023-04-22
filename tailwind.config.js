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
      sm: '640px',
      md: '1024px',
    },
    container: {
      center: true,
    },
  },
  plugins: [],
};
