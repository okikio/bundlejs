// This plugin lets you use web worker scripts the same way you do with Webpack's worker-loader.
// Based on https://github.com/endreymarcell/esbuild-plugin-webworker/
import path from "path";
import esbuild from "esbuild";

const { join, dirname, basename } = path;
export const WEB_WORKER = () => {
    /**
     * @type {import('esbuild').Plugin}
     */
    return {
        name: "web-worker",
        setup(build) {
            build.onResolve({ filter: /^worker\:/ }, (args) => {
                // Feel free to remove this logline once you verify that the plugin works for your setup
                console.debug(
                    `The web worker plugin matched an import to ${args.path} from ${args.importer}`
                );
                return {
                    path: args.path.replace(/^worker\:/, ""),
                    namespace: "web-worker",
                    pluginData: { importer: args.importer },
                };
            });

            build.onLoad(
                { filter: /.*/, namespace: "web-worker" },
                async (args) => {
                    const {
                        path: importPath,
                        pluginData: { importer },
                    } = args;

                    const workerWithFullPath = join(
                        dirname(importer),
                        importPath
                    );
                    const workerFileName = basename(workerWithFullPath);

                    // You only need this for TypeScript
                    // because the import will refer to a .ts file
                    // but the web worker will need to point to a .js file
                    const outFileName = workerFileName.replace(
                        /\.ts$/,
                        ".worker.js"
                    );

                    // This one depends on your file structure
                    const outFileWithRelativePath = join(
                        "docs",
                        "js",
                        outFileName
                    );

                    try {
                        const __dirname = path.resolve();
                        await Promise.allSettled([
                            /empty/.test(workerFileName) ? Promise.resolve() : esbuild.build({
                                target: ["chrome84"],
                                platform: "browser",

                                entryPoints: [workerWithFullPath],
                                outfile: outFileWithRelativePath,

                                sourcemap: true,
                                assetNames: "[name]",

                                // fix(#4): Firefox/Safari (below v15) do not support ESM workers
                                // This works around that by bundling everything to an iife!
                                format: "iife",

                                minify: true,
                                bundle: true,
                                treeShaking: true,

                                loader: {
                                    ".ttf": "file",
                                    ".wasm": "file",
                                },

                                define: {
                                    global: "globalThis"
                                },
                                inject: /esbuild/.test(workerFileName)
                                    ? ["./shims/node-shim.js"]
                                    : [],
                            }),

                            /esbuild|empty/.test(workerFileName) ? esbuild.build({
                                target: ["es2020"],
                                platform: "browser",

                                entryPoints: [workerWithFullPath],
                                outdir: "docs/js",

                                assetNames: "[name]",
                                entryNames: "[name].worker",
                                outExtension: { '.js': '.mjs' },

                                format: "esm",

                                minify: true,
                                bundle: true,
                                treeShaking: true,

                                color: true,
                                sourcemap: true,
                                splitting: true,

                                loader: {
                                    ".ttf": "file",
                                    ".wasm": "file",
                                },

                                define: {
                                    global: "globalThis"
                                },
                                inject: /esbuild/.test(workerFileName)
                                    ? ["./shims/node-shim.js"]
                                    : [],
                            }) : Promise.resolve() 
                        ]);

                        return {
                            contents: `
// This file is generated by esbuild to expose the worker script as a class, like Webpack's worker-loader
export default "./js/${outFileName}"`,
                        };
                    } catch (e) {
                        console.error("Could not build worker script:", e);
                    }
                }
            );
        },
    };
};
