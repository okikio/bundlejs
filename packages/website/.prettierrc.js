module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro',
      options: {
        astroAllowShorthand: true,
        parser: 'astro',
      },
    },
  ],
};