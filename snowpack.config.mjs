// Example: Using Snowpack's built-in bundling support

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
    optimize: {
        bundle: true,
        minify: true,
        color: true,
        define: {
            esbuildVer: `\"${esbuildVer}\"`,
        },
        entryNames: "[name].min",
        target: "es2018",
        loader: { ".ttf": "file" },
    },
    packageOptions: {
        polyfillNode: true,
    },
};
