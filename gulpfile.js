// Import external modules
const mode = process.argv.includes("--watch") ? "watch" : "build";

// Gulp utilities
import { watch, task, series, parallel, stream, tasks, parallelFn } from "./util.js";
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
        { default: fiber },

        { default: postcss },
        { default: tailwind },

        { default: _import },

        { default: scss },
        { default: sass },

        { default: rename }
    ] = await Promise.all([
        import("fibers"),

        import("gulp-postcss"),
        import("tailwindcss"),

        import("postcss-easy-import"),

        import("postcss-scss"),
        import("@csstools/postcss-sass"),

        import("gulp-rename")
    ]);

    return stream(`${cssSrcFolder}/*.scss`, {
        pipes: [
            // Minify scss to css
            postcss([
                // _import(),
                sass({ outputStyle: "compressed" }),
                tailwind("./tailwind.config.cjs"),
            ], { syntax: scss }),
            rename({ extname: ".css", suffix: ".min"})
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

const sizeConfig = {
    gzip: true,
    showFiles: true,
    showTotal: false
};

const esbuildConfig = {
    bundle: true,
    minify: true,
    color: true,
    define: {
        "esbuildVer": `\"${esbuildVer}\"`
    },
    entryNames: '[name].min',
    target: ["es2018"]
};

const monacoConfig = {
    loader: { '.ttf': 'file' },
};

// JS Tasks
tasks({
    "main-js": async () => {
        const [
            { default: gulpEsBuild, createGulpEsbuild },
            { default: size },
            { default: terser },
            { default: gulpif }
        ] = await Promise.all([
            import("gulp-esbuild"),
            import("gulp-size"),
            import("gulp-terser"),
            import("gulp-if")
        ]);

        const esbuild = mode == "watch" ? createGulpEsbuild({ incremental: true }) : gulpEsBuild;
        return stream(`${tsFolder}/*.ts`, {
            pipes: [
                // Bundle Modules
                esbuild({
                    ...esbuildConfig,
                    sourcemap: true,
                    format: "esm",
                }),

                // Filter out the sourcemap
                // I don't need to know the size of the sourcemap
                gulpif(
                    (file) => !/\.map$/.test(file.path),
                    terser()
                ),

                gulpif(
                    (file) => !/\.map$/.test(file.path),
                    size(sizeConfig)
                ),
            ],
            dest: jsFolder, // Output
        });
    },
    "esbuild-js": async () => {
        const [
            { default: gulpEsBuild, createGulpEsbuild },
            { default: size },
            { default: path },
            { NODE },
            { default: terser }
        ] = await Promise.all([
            import("gulp-esbuild"),
            import("gulp-size"),
            import("path"),
            import("./plugins/builtins.js"),
            import("gulp-terser")
        ]);

        const __dirname = path.resolve();
        const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
        return stream([`${tsFolder}/modules/esbuild.ts`, `${tsFolder}/modules/rollup.ts`], {
            opts: { allowEmpty: true },
            pipes: [
                // Bundle Modules
                esbuild({
                    ...esbuildConfig,
                    banner: {
                        js: 'const global = globalThis;'
                    },
                    plugins: [
                        NODE()
                    ],
                    inject: [path.join(__dirname, './shims/node-shim.js')],
                    format: "iife",
                }),
                // terser(),
                size(sizeConfig),
            ],
            dest: jsFolder, // Output
        });
    },
    "esbuild-wasm": async () => {
        const [
            { default: changed },
        ] = await Promise.all([
            import("gulp-changed"),
        ]);

        return stream(`node_modules/esbuild-wasm/esbuild.wasm`, {
            opts: { allowEmpty: true },
            pipes: [
                changed(jsFolder),
            ],
            dest: jsFolder, // Output
        });
    },
    "workers-js": async () => {
        const [
            { default: gulpEsBuild, createGulpEsbuild },
            { default: size },
            { default: terser },
        ] = await Promise.all([
            import("gulp-esbuild"),
            import("gulp-size"),
            import("gulp-terser")
        ]);

        const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
        return stream(`${tsFolder}/workers/*.ts`, {
            opts: { allowEmpty: true },
            pipes: [
                // Bundle Modules
                esbuild({
                    ...esbuildConfig,
                    ...monacoConfig,
                    format: "iife",
                }),
                // terser(),
                size({
                    gzip: true,
                    title: "workers.min.js"
                }),
            ],
            dest: jsFolder, // Output
        });
    },
    "monaco-js": async () => {
        const [
            { default: gulpEsBuild, createGulpEsbuild },
            { default: size },
            { default: terser },
            { default: gulpif }
        ] = await Promise.all([
            import("gulp-esbuild"),
            import("gulp-size"),
            import("gulp-terser"),
            import("gulp-if")
        ]);

        const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
        return stream(`${tsFolder}/modules/monaco.ts`, {
            opts: { allowEmpty: true },
            pipes: [
                // Bundle Modules
                esbuild({
                    ...esbuildConfig,
                    ...monacoConfig,
                    format: "esm",
                }),

                // Filter out the .css, and .ttf files
                // gulpif(
                //     (file) => /\.js$/.test(file.path),
                //     terser()
                // ),
                size(sizeConfig),
            ],
            dest: jsFolder, // Output
        });
    },
    "js": parallelFn("main-js", "esbuild-wasm", "esbuild-js", "workers-js", "monaco-js")
});

// Other assets
task("assets", () => {
    return stream([`${assetsFolder}/**/*`], {
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

            // I use Chrome canary for development
            browser: "chrome",
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

    watch(`${pugFolder}/**/*.pug`, { delay: 250 }, series("html", "reload"));
    watch([`${cssSrcFolder}/**/*`, `./tailwind.config.cjs`], { delay: 250 }, series("css"));

    watch([
        `${tsFolder}/**/*.ts`,
        `!${tsFolder}/modules/esbuild.ts`,
        `!${tsFolder}/modules/rollup.ts`,
        `!${tsFolder}/plugins/*.ts`,
        `!node_modules/esbuild-wasm/esbuild.wasm`,
        `!${tsFolder}/workers/*.ts`,
        `!${tsFolder}/modules/monaco.ts`
    ], { delay: 250 }, series("main-js", "reload"));

    watch([
        `${tsFolder}/modules/esbuild.ts`,
        `${tsFolder}/modules/rollup.ts`,
        `${tsFolder}/plugins/*.ts`,
    ], { delay: 250 }, series("esbuild-js", "reload"));

    watch(`node_modules/esbuild-wasm/esbuild.wasm`, { delay: 250 }, series("esbuild-wasm", "reload"));
    watch(`${tsFolder}/workers/*.ts`, { delay: 250 }, series("workers-js", "reload"));
    watch(`${tsFolder}/modules/monaco.ts`, { delay: 250 }, series("monaco-js", "reload"));

    watch([`${assetsFolder}/**/*`], { delay: 300 }, series("reload"));
});

task("build", series("clean", parallel("html", "css", "assets", "js"), "minify-css"));
task("default", series("clean", parallel("html", "css", "assets", "js"), "watch"));
