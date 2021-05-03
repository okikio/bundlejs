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
const sassFolder = `${srcFolder}/sass`;
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
        { default: scss },
        { default: sass },
        { default: _import },
        { default: rename }
    ] = await Promise.all([
        import("gulp-postcss"),
        import("tailwindcss"),
        import("postcss-scss"),
        import("@csstools/postcss-sass"),
        import("postcss-import"),
        import("gulp-rename")
    ]);

    return stream(`${sassFolder}/**/*.scss`, {
        pipes: [
            // Minify scss to css
            postcss([
                sass({ outputStyle: "compressed" }),
                tailwind("./tailwind.cjs"),
                _import()
            ], { syntax: scss }),

            rename({ extname: ".css" }),
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
        { default: gzipSize },
        { default: prettyBytes },
        { default: changed }
    ] = await Promise.all([
        import("gulp-esbuild"),
        import("gzip-size"),
        import("pretty-bytes"),
        import("gulp-changed")
    ]);

    const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
    const esbuildConfig = {
        bundle: true,
        minify: true,
        color: true,
        define: {
            "esbuildVer": `\"${esbuildVer}\"`
        },
    };

    const monacoConfig = {
        loader: { '.ttf': 'file' }
    };

    return streamList(
        // Modern js
        stream(`${tsFolder}/*.ts`, {
            pipes: [
                changed(jsFolder),
                // Bundle Modules
                esbuild({
                    ...esbuildConfig,
                    ...monacoConfig,
                    sourcemap: true,
                    format: "esm",
                    target: ["es2019"],
                    entryNames: '[name].min',
                }),
            ],
            dest: jsFolder, // Output
            // async end() {
            //     console.log(
            //         `=> \`modern\` Gzip size - ${prettyBytes(
            //             await gzipSize.file(`${jsFolder}/main.min.js`)
            //         )}`
            //     );
            // },
        }),

        // Esbuild js
        stream(`${tsFolder}/modules/esbuild.ts`, {
            opts: { allowEmpty: true },
            pipes: [
                changed(jsFolder),
                // Bundle Modules
                esbuild({
                    ...esbuildConfig,
                    banner: { js: 'const global = globalThis;' },
                    inject: ["./shims/node-shim.js"],
                    format: "esm",
                    target: ["es2017"]
                }),
            ],
            dest: jsFolder, // Output
        }),

        // Esbuild js
        stream(`${tsFolder}/workers/*.ts`, {
            opts: { allowEmpty: true },
            pipes: [
                changed(jsFolder),
                // Bundle Modules
                esbuild({
                    ...esbuildConfig,
                    format: "iife",
                    target: ["es2017"],
                    entryNames: '[name].min',
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

    watch(`${pugFolder}/**/*.pug`, series("html"));
    watch([`${sassFolder}/**/*.scss`, `./tailwind.cjs`], series("css"));
    watch(`${tsFolder}/**/*.ts`, series("js"));

    watch(
        [`${htmlFolder}/**/*.html`, `${jsFolder}/**/*.js`, `${assetsFolder}/**/*`],
        { delay: 500, queue: false }
    ).on("change", browserSync.reload);
});

task("build", series("clean", parallel("html", "css", "assets"), "js", "minify-css"));
task("default", series("clean", parallel("html", "css", "assets"), "js", "watch"));
