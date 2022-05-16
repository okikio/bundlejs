// Import external modules
const mode = process.argv.includes("--watch") ? "watch" : "build";
import { ENABLE_SW } from "./env.js";

// Gulp utilities
import {
    watch,
    task,
    series,
    parallel,
    stream,
    streamList,
    parallelFn,
} from "./util.js";
import { createRequire } from "module";
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
    const [
        { default: pug },
        { default: plumber },

        { default: posthtml },
        { render },
        { parser },

        { rehype },
        { h },
    ] = await Promise.all([
        import("gulp-pug"),
        import("gulp-plumber"),

        import("gulp-posthtml"),
        import("posthtml-render"),
        import("posthtml-parser"),

        import("rehype"),
        import("hastscript"),
    ]);

    let plugins = [
        "rehype-slug",
        "rehype-highlight",
        [
            "rehype-autolink-headings",
            {
                behavior: "append",
                content: [h("i.icon", { "aria-hidden": "true" }, "insert_link")],
                test: ['h2', 'h3', 'h4', 'h5', 'h6']
            },
        ],
        ["rehype-external-links", { target: "_blank", rel: ["noopener"] }],
    ];

    const importPlugin = async (p) => {
        if (typeof p === "string") {
            return await import(p);
        }

        return await p;
    };

    plugins = plugins.map((p) => {
        return new Promise((resolve, reject) => {
            const [plugin, opts] = [].concat(p);
            return importPlugin(plugin)
                .then((m) => {
                    return resolve([m.default, opts]);
                })
                .catch((e) => reject(e));
        });
    });

    const loadedPlugins = await Promise.all(plugins);
    return stream(`${pugFolder}/*.pug`, {
        pipes: [
            plumber(),
            pug({
                basedir: pugFolder,
                self: true,
            }),
            posthtml([
                (() => {
                    return async (tree) => {
                        const content = render(tree);
                        const engine = rehype();

                        try {
                            loadedPlugins.forEach(([plugin, opts]) => {
                                engine.use(plugin, opts);
                            });
                        } catch (e) {
                            console.warn(e);
                        }

                        const value = String(await engine.process(content));
                        return parser(value);
                    };
                })(),
            ]),
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

        { default: rename },
    ] = await Promise.all([
        import("gulp-postcss"),
        import("tailwindcss"),

        import("postcss-scss"),
        import("@csstools/postcss-sass"),

        import("gulp-rename"),
    ]);

    return stream(`${cssSrcFolder}/*.scss`, {
        pipes: [
            // Minify scss to css
            postcss(
                [
                    sass({ outputStyle: "compressed" }), // fiber
                    tailwind("./tailwind.config.cjs")
                ],
                { syntax: scss }
            ),
            rename({ extname: ".css", suffix: ".min" }),
        ],
        dest: cssFolder,
        end: browserSync ? [browserSync.stream()] : null,
    });
});

task("minify-css", async () => {
    const [
        { default: postcss }, 
        { default: autoprefixer }, 
        { default: cssnano }
    ] = await Promise.all([
        import("gulp-postcss"),
        import("autoprefixer"),
        import("cssnano"),
    ]);

    return stream(`${destFolder}/**/*.css`, {
        pipes: [
            // Minify scss to css
            postcss([,
                cssnano({ preset: "default", plugin: autoprefixer })
            ]),
        ],
        dest: destFolder,
        end: browserSync ? [browserSync.stream()] : null,
    });
});

// JS Tasks
task("js", async () => {
    const [
        { default: gulpEsBuild, createGulpEsbuild },
        { default: size },
        { default: gulpif },

        { WEB_WORKER },
        { solidPlugin: SOLID },
        { TS_TO_JSON },
    ] = await Promise.all([
        import("gulp-esbuild"),
        import("gulp-size"),
        import("gulp-if"),

        import("./plugins/worker.js"),
        import("esbuild-plugin-solid"),
        import("./plugins/ts-to-json.js"),
    ]);

    const esbuild =
        mode == "watch"
            ? createGulpEsbuild({ incremental: true })
            : gulpEsBuild;

    return stream(
        [
            `${tsFolder}/*.ts`,
            `${tsFolder}/*.js`,
            `!${tsFolder}/**/*.d.ts`,
            // `${tsFolder}/scripts/*`,
            `node_modules/esbuild-wasm/esbuild.wasm`,
        ],
        {
            pipes: [
                // Bundle Modules
                esbuild({
                    target: ["es2019"],
                    platform: "browser",
                    treeShaking: true,

                    assetNames: "[name]",
                    entryNames: "[name].min",

                    bundle: true,
                    minify: true,
                    color: true,
                    format: "esm",
                    sourcemap: true,
                    splitting: true,

                    loader: {
                        ".ttf": "file",
                        ".wasm": "file",
                    },

                    plugins: [WEB_WORKER(), SOLID(), TS_TO_JSON()],
                }),

                gulpif(
                    (file) => /\.(js|css)$/.test(file.path),
                    size({
                        gzip: true,
                        showFiles: true,
                        showTotal: false,
                    })
                ),
            ],
            dest: jsFolder, // Output
        }
    );
});

// JS Analyzer Tasks
task("js-analyzer", async () => {
    const [
        { default: gulpEsBuild, createGulpEsbuild },
        { default: size },
        { default: gulpif },

        { SASS },
    ] = await Promise.all([
        import("gulp-esbuild"),
        import("gulp-size"),
        import("gulp-if"),

        import("./plugins/sass.js"),
    ]);

    const TEMPLATE = ["sunburst", "treemap", "network"];

    const esbuild =
        mode == "watch"
            ? createGulpEsbuild({ incremental: true })
            : gulpEsBuild;

    return stream(
        [
            `${tsFolder}/plugins/analyzer/src/{${TEMPLATE.toString()}}/index.tsx`,
            `!${tsFolder}/**/*.d.ts`
        ],
        {
            pipes: [
                // Bundle Modules
                esbuild({
                    target: ["es2019"],
                    platform: "browser",
                    treeShaking: true,

                    assetNames: "[dir]",
                    entryNames: "[dir].min",

                    jsxFragment: "Fragment",
                    jsxFactory: "h",

                    bundle: true,
                    minify: true,
                    color: true,
                    format: "esm",
                    sourcemap: true,
                    splitting: true,

                    loader: {
                        ".ttf": "file",
                        ".wasm": "file",
                    },

                    plugins: [SASS()],
                }),

                gulpif(
                    (file) => /\.(js|css)$/.test(file.path),
                    size({
                        gzip: true,
                        showFiles: true,
                        showTotal: false,
                    })
                ),
            ],
            dest: jsFolder, // Output
        }
    );
});

task("preload-chunks", async () => {
    const [{ default: posthtml }, { default: glob }] = await Promise.all([
        import("gulp-posthtml"),
        import("tiny-glob"),
    ]);

    let chunks = await glob(`${jsFolder}/chunk-*.js`);
    chunks = chunks.map((x, i) => ({
        tag: "link",
        attrs: {
            src: x.replace(`${destFolder}`, ""),
            type: "modulepreload",
            as: "script",
            id: `chunk-preload-${i}`,
        },
    }));

    let chunkPreloadEl = {
        tag: "div",
        attrs: {
            id: "chunk-preload",
        },
        content: chunks,
    };

    return stream(`${htmlFolder}/index.html`, {
        pipes: [
            posthtml([
                async (tree) => {
                    tree.match({ tag: "head" }, (node) => {
                        let indexOf = node?.content.indexOf(chunkPreloadEl);

                        if (Array.isArray(node?.content))
                            if (indexOf > -1) {
                                node.content[indexOf] = chunkPreloadEl;
                            } else {
                                node.content.push(chunkPreloadEl);
                            }
                        else node.content = [chunkPreloadEl];

                        return node;
                    });
                },
            ]),
        ],
        dest: htmlFolder,
    });
});

// Service Worker
task("service-worker", async () => {
    if (ENABLE_SW) {
        const { generateSW } = await import("workbox-build");

        return generateSW({
            globDirectory: destFolder,
            globPatterns: [
                "**/*.{html,js,css}",
                "/js/*.ttf",
                "/favicon/*.svg",
                "!/js/index.min.css",
            ],
            swDest: `${destFolder}/sw.js`,

            ignoreURLParametersMatching: [/index\.html\?(.*)/, /\\?(.*)/],
            cleanupOutdatedCaches: true,

            // Define runtime caching rules.
            runtimeCaching: [
                {
                    // Match any request that starts with https://api.producthunt.com, https://api.countapi.xyz, https://opencollective.com, etc...
                    urlPattern:
                        /^https:\/\/((?:api\.producthunt\.com)|(?:api\.countapi\.xyz)|(?:opencollective\.com)|(?:discus\.bundlejs\.com)|(?:analytics\.bundlejs\.com))/,

                    // Apply a network-first strategy.
                    handler: "NetworkFirst",
                    method: "GET",
                    options: {
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    // Match any request that ends with .png, .jpg, .jpeg, .svg, etc....
                    urlPattern:
                        /workbox\-(.*).js|\.(?:png|jpg|jpeg|svg|webp|map|wasm|json|ts|css)$|^https:\/\/(?:cdn\.polyfill\.io)/,

                    // Apply a stale-while-revalidate strategy.
                    handler: "StaleWhileRevalidate",
                    method: "GET",
                    options: {
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    // Match any request that ends with .woff2, .woff, etc.... or that comes from Google Fonts
                    urlPattern:
                        /\.(?:woff2|woff)$|^https:\/\/(?:fonts\.gstatic\.com)/,

                    // Apply a stale-while-revalidate strategy.
                    handler: "CacheFirst",
                    method: "GET",
                    options: {
                        cacheableResponse: {
                            statuses: [0, 200]
                        },
                        cacheName: "FontCache",
                        expiration: { 
                            maxAgeSeconds: 60 * 60 * 24 * 365
                        }
                    }
                },
            ],
        });
    }

    return;
});

// Other assets
task("assets", () => {
    return stream([`${assetsFolder}/**/*`, `${tsFolder}/**/*.wasm`], {
        dest: destFolder,
    });
});

task("sitemap", async () => {
    let [{ default: sitemap }] = await Promise.all([import("gulp-sitemap")]);

    return stream(`${htmlFolder}/**/*.html`, {
        pipes: [
            sitemap({
                siteUrl: "https://bundlejs.com",
                mappings: [
                    {
                        pages: ["**/*"],
                        changefreq: "monthly",
                        getLoc(siteUrl, loc, entry) {
                            // Removes the file extension if it exists
                            return loc.replace(/\.\w+$/, "");
                        },
                    },
                ],
            }),
        ],
        dest: htmlFolder,
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
            scrollThrottle: 350,
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

    watch(
        `${pugFolder}/**/*.pug`,
        { delay: 750 },
        series("html", "css", "service-worker", "reload")
    );

    watch(
        [`${cssSrcFolder}/**/*`, `./tailwind.config.cjs`],
        { delay: 250 },
        series("css")
    );

    watch(
        [`${tsFolder}/**/*.{tsx,ts,js,jsx}`, `!${tsFolder}/**/*.d.ts`],
        { delay: 850 },
        series(parallel("js", "js-analyzer"), /* "preload-chunks", */ "service-worker", "reload")
    );

    watch(
        [`${assetsFolder}/**/*`],
        { delay: 750 },
        series("assets", "service-worker", "reload")
    );
});

task(
    "build",
    series(
        "clean",
        parallel("html", "css", "assets", "js", "js-analyzer"),
         /* "preload-chunks", */ 
        parallelFn("minify-css", "service-worker", "sitemap")
    )
);
task(
    "default",
    series(
        "clean",
        parallel("html", "css", "assets", "js", "js-analyzer"),
         /* "preload-chunks", */ 
        "service-worker",
        "watch"
    )
);
