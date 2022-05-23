// ./postcss.config.js
const { postcssFontGrabber } = require("postcss-font-grabber");
const { outDir } = require("./shared.config.js");

let cssFolder = `${outDir}/assets`;
module.exports = {
    plugins: [ 
        postcssFontGrabber({
            // postcss-font-grabber needs to know the CSS output
            // directory in order to calculate the new font URL.
            cssDest: `${cssFolder}/`,
            fontDest: `${cssFolder}/fonts/`,
        }),
    ],
  };