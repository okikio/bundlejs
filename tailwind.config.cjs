module.exports = {
  darkMode: 'class',
  purge: [
    './src/pug/**/*.pug'
  ],
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        "manrope": ["Manrope", "Century Gothic", "sans-serif"]
      },
      colors: {
        "elevated": "#1C1C1E",
        "elevated-2": "#262628",
        "label": "#ddd",
        "secondary": "#bbb",
        "tertiary": "#555",
        "quaternary": "#333",
        "center-container-dark": "#121212"
      },
      screens: {
        'lt-2xl': { 'max': '1536px' },
        // => @media (max-width: 1536px) { ... }

        'lt-xl': { 'max': '1280px' },
        // => @media (max-width: 1280px) { ... }

        'lt-lg': { 'max': '1024px' },
        // => @media (max-width: 1024px) { ... }

        'lt-md': { 'max': '768px' },
        // => @media (max-width: 768px) { ... }

        'lt-sm': { 'max': '640px' },
        // => @media (max-width: 640px) { ... }
      },
      container: {
        center: 'true',
      },
    },
  },
  /* ... */
}