// Import external modules
const mode = process.argv.includes("--watch") ? "watch" : "build";

// Gulp utilities
import { watch, task, series, parallel, stream, tasks, parallelFn } from "./util.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

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
        { default: scss },
        { default: sass },

        { default: rename }
    ] = await Promise.all([
        import("fibers"),

        import("gulp-postcss"),
        import("tailwindcss"),

        import("postcss-scss"),
        import("@csstools/postcss-sass"),

        import("gulp-rename")
    ]);

    return stream(`${cssSrcFolder}/*.scss`, {
        pipes: [
            // Minify scss to css
            postcss([
                sass({ outputStyle: "compressed", fiber }),
                tailwind("./tailwind.config.cjs"),
            ], { syntax: scss }),
            rename({ extname: ".css", suffix: ".min" })
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

    return stream(`${destFolder}/**/*.css`, {
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
    entryNames: '[name].min',
    target: ["es2018"],
    platform: "browser"
};

const monacoConfig = {
    loader: {
        // ".css": "file",
        '.ttf': 'file',
        ".wasm": "file"
    },
};

// JS Tasks
task("js", async () => {
    const [
        { default: gulpEsBuild, createGulpEsbuild },
        { default: size },
        { default: gulpif },

        { WEB_WORKER },
        { solidPlugin: solid },
        { default: rename }
    ] = await Promise.all([
        import("gulp-esbuild"),
        import("gulp-size"),
        import("gulp-if"),

        import("./plugins/worker.js"),
        import("esbuild-plugin-solid"),
        import("gulp-rename")
    ]);

    const esbuild = mode == "watch" ? createGulpEsbuild({ incremental: true }) : gulpEsBuild;
    return stream([
        `${tsFolder}/*.ts`,
        `${tsFolder}/scripts/*`,
        `!${tsFolder}/**/*.d.ts`,
        `node_modules/esbuild-wasm/esbuild.wasm`
    ], {
        pipes: [
            // Bundle Modules
            esbuild({
                ...esbuildConfig,
                ...monacoConfig,
                sourcemap: true,
                format: "esm",
                splitting: true,
                assetNames: "[name]",
                plugins: [
                    WEB_WORKER(),
                    solid()
                ]
            }),

            gulpif(
                (file) => /\.js$/.test(file.path),
                size(sizeConfig)
            ),

            gulpif(
                (file) => /monaco(.*)\.css$/.test(file.path),
                rename("monaco.min.css")
            )
        ],
        dest: jsFolder, // Output
    });
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
        `${tsFolder}/**/*.{tsx,ts}`,
        `!${tsFolder}/**/*.d.ts`
    ], { delay: 250 }, series("js", "reload"));

    watch([`${assetsFolder}/**/*`], { delay: 300 }, series("reload"));
});

task("build", series("clean", parallel("html", "css", "assets", "js"), "minify-css"));
task("default", series("clean", parallel("html", "css", "assets", "js"), "watch"));
