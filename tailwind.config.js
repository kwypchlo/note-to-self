module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./src/**/*.html", "./src/**/*.jsx", "./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Metropolis", "sans-serif"],
        body: ["Metropolis", "sans-serif"],
      },
      colors: {
        primary: "#5c6ac4",
        background: "#282c34",
      },
    },
  },
  variants: {},
  plugins: [],
};
