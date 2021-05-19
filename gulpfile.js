// Import external modules
const mode = process.argv.includes("--watch") ? "watch" : "build";

// Gulp utilities
import { watch, task, series, parallel, stream, streamList } from "./util.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { dependencies } = require('./package.json');
const esbuildVer = dependencies["esbuild-wasm"].replace(/\^/, "");

// Origin folders (source and destination folders)
const srcFolder = `src`;
const destFolder = `docs`;

// Source file folders
const tsFolder = `${srcFolder}/ts`;
const cssSrcFolder = `${srcFolder}/css`;
const pugFolder = `${srcFolder}/pug`;
const assetsFolder = `${srcFolder}/assets`;

// Destination file folders
const jsFolder = `${destFolder}/js`;
const cssFolder = `${destFolder}/css`;
const htmlFolder = `${destFolder}`;

let browserSync;

// HTML Tasks
task("html", async () => {
    const [{ default: pug }, { default: plumber }] = await Promise.all([
        import("gulp-pug"),
        import("gulp-plumber"),
    ]);
    return stream(`${pugFolder}/*.pug`, {
        pipes: [
            plumber(),
            pug({
                data: { esbuildVer },
                basedir: pugFolder,
                self: true,
            }),
        ],
        dest: htmlFolder,
    });
});

// CSS Tasks
task("css", async () => {
    const [
        { default: postcss },
        { default: tailwind },

        { default: _import },

        { default: scss },
        { default: sass },
    ] = await Promise.all([
        import("gulp-postcss"),
        import("tailwindcss"),

        import("postcss-easy-import"),

        import("postcss-scss"),
        import("@csstools/postcss-sass"),
    ]);

    return stream(`${cssSrcFolder}/*.css`, {
        pipes: [
            // Minify scss to css
            postcss([
                _import(),
                sass({ outputStyle: "compressed" }),
                tailwind("./tailwind.cjs"),
            ], { syntax: scss }),
        ],
        dest: cssFolder,
        end: browserSync ? [browserSync.stream()] : null,
    });
});

task("minify-css", async () => {
    const [
        { default: postcss },
        { default: autoprefixer },
        { default: csso },
    ] = await Promise.all([
        import("gulp-postcss"),
        import("autoprefixer"),
        import("postcss-csso"),
    ]);

    return stream(`${cssFolder}/**/*.css`, {
        pipes: [
            // Minify scss to css
            postcss([
                csso(),
                autoprefixer(),
            ])
        ],
        dest: cssFolder,
        end: browserSync ? [browserSync.stream()] : null,
    });
});

// JS Tasks
task("js", async () => {
    const [
        { default: gulpEsBuild, createGulpEsbuild },
        { default: size },
        { default: prettyBytes },
        { default: changed },
        { default: path }
    ] = await Promise.all([
        import("gulp-esbuild"),
        import("gulp-size"),
        import("pretty-bytes"),
        import("gulp-changed"),
        import("path")
    ]);

    const __dirname = path.resolve();
    const sizeConfig = {
        gzip: true
    };
    const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
    const esbuildConfig = {
        bundle: true,
        minify: true,
        color: true,
        define: {
            "esbuildVer": `\"${esbuildVer}\"`
        },
        entryNames: '[name].min',
        target: ["es2017"]
    };

    const monacoConfig = {
        loader: { '.ttf': 'file' },
    };

    return streamList(
        // Main.js
        stream(`${tsFolder}/*.ts`, {
            pipes: [
                changed(jsFolder),

                // Bundle Modules
                esbuild({
                    ...esbuildConfig,
                    sourcemap: true,
                    format: "esm",
                }),
                size({
                    ...sizeConfig,
                    title: "main.min.js"
                }),
            ],
            dest: jsFolder, // Output
        }),

        // Esbuild js
        stream(`${tsFolder}/modules/esbuild.ts`, {
            opts: { allowEmpty: true },
            pipes: [
                changed(jsFolder),
                // Bundle Modules
                esbuild({
                    ...esbuildConfig,
                    banner: {
                        js: 'const global = globalThis;'
                    },
                    inject: [path.join(__dirname, './shims/node-shim.js')],
                    format: "esm",
                }),
                size({
                    ...sizeConfig,
                    title: "esbuild.min.js"
                }),
            ],
            dest: jsFolder, // Output
        }),

        // Esbuild Wasm
        stream(`node_modules/esbuild-wasm/esbuild.wasm`, {
            opts: { allowEmpty: true },
            pipes: [
                changed(jsFolder),
            ],
            dest: jsFolder, // Output
        }),

        // Workers js
        stream(`${tsFolder}/workers/*.ts`, {
            opts: { allowEmpty: true },
            pipes: [
                changed(jsFolder),

                // Bundle Modules
                esbuild({
                    ...esbuildConfig,
                    ...monacoConfig,
                    format: "iife",
                }),
                size({
                    ...sizeConfig,
                    title: "workers.min.js"
                }),
            ],
            dest: jsFolder, // Output
        }),

        // Monaco js
        stream(`${tsFolder}/modules/monaco.ts`, {
            opts: { allowEmpty: true },
            pipes: [
                changed(jsFolder),

                // Bundle Modules
                esbuild({
                    ...esbuildConfig,
                    ...monacoConfig,
                    format: "esm",
                }),
                size({
                    ...sizeConfig,
                    title: "monaco.min.js"
                }),
            ],
            dest: jsFolder, // Output
        }),
    );
});

// Other assets
task("assets", () => {
    return stream(`${assetsFolder}/**/*`, {
        opts: {
            base: assetsFolder,
        },
        dest: destFolder,
    });
});

// Delete destFolder for added performance
task("clean", async () => {
    const { default: del } = await import("del");
    return del(destFolder);
});

// BrowserSync
task("reload", () => {
    if (browserSync) browserSync.reload();
    return Promise.resolve();
});

// Build & Watch Tasks
task("watch", async () => {
    const { default: bs } = await import("browser-sync");
    browserSync = bs.create();
    browserSync.init(
        {
            notify: true,
            server: {
                baseDir: destFolder,
                serveStaticOptions: {
                    cacheControl: false,
                    extensions: ["html"],
                },
            },
            // serveStatic: [
            //     {
            //         route: "/lib",
            //         dir: ["./lib"],
            //     },
            // ],
            online: true,
            reloadOnRestart: true,
            scrollThrottle: 250
        },
        (_err, bs) => {
            bs.addMiddleware("*", (_req, res) => {
                res.writeHead(302, {
                    location: `/404`,
                });
                res.end();
            });
        }
    );

    watch(`${pugFolder}/**/*.pug`, series("html", "reload"));
    watch([`${cssSrcFolder}/**/*.css`, `./tailwind.cjs`], series("css"));
    watch(`${tsFolder}/**/*.ts`, series("js", "reload"));

    watch([`${assetsFolder}/**/*`], { delay: 300, queue: false }, series("reload"));
});

task("build", series("clean", parallel("html", "css", "assets"), "js", "minify-css"));
task("default", series("clean", parallel("html", "css", "assets"), "js", "watch"));
