module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      primary: 'Open Sans',
      secondary: 'sans-serif',
      primary: ["Playfair Display", "serif"],
      secondary: ["Open Sans", "sans-serif"],
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        lg: '0',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1170px',
    },
    extend: {
      colors: {
        primary: '#EE5C29',
        secondary: '#000000',
        tertiary: '#242526',
        background:'#ffffff',
        onBackground:'#000000',
        // onBackground:'#ffffff',
        // background:'#000000',
        accent: {
          primary: '#EE5C29',
          primary_hover: '#EE5C29',
          secondary: '#000000',
          secondary_hover: '#ffffff',
          tertiary: '#242526',
        },
      },
      // backgroundImage: {
      //   hero: "url('../src/assets/img/hero_bg.png')",
      // },
      dropShadow: {
        primary: ' 0px 5px 5px rgba(75, 93, 104, 0.1)',
      },
    },
  },
  plugins: [],
};
