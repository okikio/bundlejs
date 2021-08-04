import {
    initialize, 
    build, BuildResult, 
    OutputFile, 
    BuildIncremental, 
    Loader,
    transform as esbuildTransform,
    formatMessages,
    Message,
    CommonOptions,
} from "esbuild-wasm/esm/browser";
import path from "path";
import { fs, vol } from "memfs";
import { PluginContext, Plugin, LoadResult, TransformResult } from 'rollup';
import { createFilter, FilterPattern } from '@rollup/pluginutils';

import { EXTERNAL } from "./external";
import { ENTRY } from "./entry";
import { JSON_PLUGIN } from "./json";
import { BARE } from "./bare";
import { HTTP } from "./http";
import { CDN } from "./cdn";
import { VIRTUAL_FS } from "./virtual-fs";
import { WASM } from "./wasm";

let _initialized = false;
let currentlyBuilding = false;

const { extname, resolve, dirname, join } = path;
const { existsSync, statSync } = fs;

vol.fromJSON({}, "/");

(async () => {
    try {
        if (!_initialized) {
            await initialize({
                worker: false,
                wasmURL: `./esbuild.wasm`
            });

            _initialized = true;
        }
    } catch (error) {
        self.postMessage({
            type: `initialize esbuild error`,
            error
        });
    }
})();


let result: BuildResult & {
    outputFiles: OutputFile[];
} | BuildIncremental;


const transform = async (inputCode: string, id: string, { plugins, pluginContext}) => {
    let code: string | undefined
    let map: any
    for (const plugin of plugins) {
        if (plugin.transform && plugin.name !== 'esbuild') {
            const transformed = (await plugin.transform.call(
                pluginContext,
                inputCode,
                id
            )) as TransformResult
            if (transformed == null) continue
            if (typeof transformed === 'string') {
                code = transformed
            } else if (typeof transformed === 'object') {
                if (transformed.code !== null) {
                    code = transformed.code
                }
            }
        }
    }
    return { code }
}

const ROLLUP_PLUGIN = ({ pluginContext, loaders, plugins }) => {
    return {
        name: 'rollup',
        setup: (build) => {
            build.onResolve({ filter: /.+/ }, async (args) => {
                const resolved = await pluginContext.resolve(
                    args.path,
                    args.importer
                )
                if (resolved == null) return
                return {
                    external:
                        resolved.external === 'absolute' ? true : resolved.external,
                    path: resolved.id,
                }
            })

            build.onLoad({ filter: /.+/ }, async (args) => {
                const loader = loaders[path.extname(args.path)] as
                    | Loader
                    | undefined

                let contents: string | undefined;
                for (const plugin of plugins) {
                    if (plugin.load && plugin.name !== 'esbuild') {
                        const loaded = (await plugin.load.call(
                            pluginContext,
                            args.path
                        )) as LoadResult
                        if (loaded == null) {
                            continue
                        } else if (typeof loaded === 'string') {
                            contents = loaded
                            break
                        } else if (loaded && loaded.code) {
                            contents = loaded.code
                        }
                    }
                }

                if (contents == null) {
                    contents = await fs.promises.readFile(args.path, 'utf8') as string;
                }

                const transformed = await transform(contents, args.path, { plugins, pluginContext })
                if (transformed.code) {
                    let code = transformed.code;
                    return {
                        contents: code,
                    }
                }
                return {
                    contents,
                    loader: loader || 'js',
                }
            })
        },
    };
}

export const bundle = async (
    id: string,
    pluginContext: PluginContext,
    plugins: Plugin[],
    loaders: {
        [ext: string]: string
    },
    target: string | string[],
    cache
) => {
    if (!_initialized) {
        self.postMessage({
            type: `esbuild has not initialized. \nYou need to wait for the promise returned from "initialize" to be resolved before calling this`,
            warn: ' '
        });

        return;
    }

    // Stop builiding if another input is coming down the pipeline
    if (currentlyBuilding) result?.stop?.();
    currentlyBuilding = true;

    if (result) {
        result = await result.rebuild();
    } else {
        result = await build({
            entryPoints: ['<stdin>'],
            // stdin: {
            //     contents: input,

            //     // These are all optional:
            //     // resolveDir: require('path').join(__dirname, 'src'),
            //     sourcefile: '/input.ts',
            //     loader: 'ts',
            // },
            bundle: true,
            minify: true,
            color: true,
            incremental: true,
            target: ["esnext"],
            logLevel: 'info',
            write: false,
            outfile: "/bundle.js",
            platform: "browser",
            format: "esm",
            loader: {
                '.ts': 'ts',
                '.png': 'dataurl',
                '.svg': 'text',
            },
            define: {
                "__NODE__": `false`,
                "process.env.NODE_ENV": `"production"`
            },
            plugins: [
                ROLLUP_PLUGIN({ pluginContext, loaders, plugins }),
                EXTERNAL(),
                ENTRY(`/input.js`),
                JSON_PLUGIN(),

                BARE(),
                HTTP(),
                CDN(cache),
                VIRTUAL_FS(),
                WASM(),
            ],
            globalName: 'bundler',
        });
    }

    return {
        code: result.outputFiles.find((file) => file.path.endsWith('.js'))?.text,
    }
}

const defaultLoaders: { [ext: string]: Loader } = {
    '.js': 'js',
    '.jsx': 'jsx',
    '.ts': 'ts',
    '.tsx': 'tsx',
}

export type Options = {
    include?: FilterPattern
    exclude?: FilterPattern
    sourceMap?: boolean
    minify?: boolean
    minifyWhitespace?: boolean
    minifyIdentifiers?: boolean
    minifySyntax?: boolean
    legalComments?: CommonOptions['legalComments']
    target?: string | string[]
    /**
     * Requires esbuild >= 0.12.1
     */
    jsx?: 'transform' | 'preserve'
    jsxFactory?: string
    jsxFragment?: string
    define?: {
        [k: string]: string
    }
    experimentalBundling?: boolean
    /**
     * Use this tsconfig file instead
     * Disable it by setting to `false`
     */
    tsconfig?: string | false
    /**
     * Map extension to esbuild loader
     * Note that each entry (the extension) needs to start with a dot
     */
    loaders?: {
        [ext: string]: Loader | false
    }
    pure?: string[],
    cache?: Map<string, string>
}

const warn = async (pluginContext: PluginContext, messages: Message[]) => {
    if (messages.length > 0) {
        const warnings = await formatMessages(messages, {
            kind: 'warning',
            color: true,
        })
        warnings.forEach((warning) => pluginContext.warn(warning))
    }
}

export default (options: Options = {
    cache: new Map()
}): Plugin => {
    let target: string | string[]

    const loaders = {
        ...defaultLoaders,
    }

    if (options.loaders) {
        for (const key of Object.keys(options.loaders)) {
            const value = options.loaders[key]
            if (typeof value === 'string') {
                loaders[key] = value
            } else if (value === false) {
                delete loaders[key]
            }
        }
    }

    const extensions: string[] = Object.keys(loaders)
    const INCLUDE_REGEXP = new RegExp(
        `\\.(${extensions.map((ext) => ext.slice(1)).join('|')})$`
    )
    const EXCLUDE_REGEXP = /node_modules/

    const filter = createFilter(
        options.include || INCLUDE_REGEXP,
        options.exclude || EXCLUDE_REGEXP
    )

    const resolveFile = (resolved: string, index: boolean = false) => {
        for (const ext of extensions) {
            const file = index ? join(resolved, `index${ext}`) : `${resolved}${ext}`
            if (existsSync(file)) return file
        }
        return null
    }

    let plugins: Plugin[] = []

    return {
        name: 'esbuild',

        resolveId(importee, importer) {
            if (importer && importee[0] === '.') {
                const resolved = resolve(
                    importer ? dirname(importer) : process.cwd(),
                    importee
                )

                let file = resolveFile(resolved)
                if (file) return file
                if (!file && existsSync(resolved) && statSync(resolved).isDirectory()) {
                    file = resolveFile(resolved, true)
                    if (file) return file
                }
            }
        },

        options(options) {
            plugins = options.plugins as Plugin[] || [];
            return null
        },

        async load(id) {
            if (options.experimentalBundling) {
                const bundled = await bundle(id, this, plugins, loaders, target, options.cache)
                if (bundled.code) {
                    return {
                        code: bundled.code
                    }
                }
            }
        },

        async transform(code, id) {
            // In bundle mode transformation is handled by esbuild too
            if (!filter(id) || options.experimentalBundling) {
                return null
            }

            const ext = extname(id)
            const loader = loaders[ext]

            if (!loader) {
                return null
            }

            const defaultOptions =
                options.tsconfig === false
                    ? {}
                    : {};

            target = options.target || 'es2020';

            const result = await esbuildTransform(code, {
                loader,
                target,
                jsx: options.jsx,
                jsxFactory: options.jsxFactory,
                jsxFragment: options.jsxFragment,
                define: options.define,
                sourcemap: options.sourceMap !== false,
                sourcefile: id,
                pure: options.pure,
                legalComments: options.legalComments,
            })

            await warn(this, result.warnings)

            return (
                result.code && {
                    code: result.code
                }
            )
        },

        async renderChunk(code) {
            if (
                options.minify ||
                options.minifyWhitespace ||
                options.minifyIdentifiers ||
                options.minifySyntax
            ) {
                const result = await esbuildTransform(code, {
                    loader: 'js',
                    minify: options.minify,
                    minifyWhitespace: options.minifyWhitespace,
                    minifyIdentifiers: options.minifyIdentifiers,
                    minifySyntax: options.minifySyntax,
                    target,
                    sourcemap: options.sourceMap !== false,
                })
                await warn(this, result.warnings)
                if (result.code) {
                    return {
                        code: result.code,
                        map: result.map || null,
                    }
                }
            }
            return null
        },
    }
}