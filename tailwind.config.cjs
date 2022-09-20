let weights = Array.from(Array(9), (_, i) => (i + 1) * 100);
let fontWeight = {};
weights.forEach((val) => {
  fontWeight[val] = val;
});

module.exports = {
  darkMode: "media",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],

  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      screens: {
        "3xl": "1633px",
        "1.5xl": "1333px",
        "lt-2xl": { max: "1535px" },

        "lt-xl": { max: "1279px" },

        "lt-lg": { max: "1023px" },

        "lt-md": { max: "767px" },

        "lt-sm": { max: "639px" },

        "xsm": "439px",
        "lt-xsm": { max: "439px" },

        "xxsm": "339px",
        "lt-xxsm": { max: "339px" },

        'coarse': { 'raw': '(pointer: coarse)' },
        'fine': { 'raw': '(pointer: fine)' },
      },
      fontWeight,
      fontFamily: {
        manrope: [
          "Manrope",
          "Manrope-fallback",
          "Century Gothic",
          "sans-serif",
        ],
      },
      colors: {
        "primary": "#60a5fa",
        "secondary": "#1d4ed8",
        "elevated": "#1C1C1E",
        "elevated-2": "#262628",
        "label": "#ddd",
        "tertiary": "#555",
        "quaternary": "#333",
        "center-container-dark": "#121212",
      },
      container: {
        center: "true",
      }
    },
  },
  plugins: [],
};