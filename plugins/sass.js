import * as sass from "sass";

export const SASS = () => {
    /**
     * @type {import('esbuild').Plugin}
     */
    return {
        name: "sass",
        setup(build) {
            build.onLoad({ filter: /\.scss$/ }, async (args) => {
                const result = await sass.compileAsync(args.path, { style: "compressed" });
                return {
                    contents: result.css.toString("utf-8"),
                    loader: "css",
                };
            });
        },
    };
};
