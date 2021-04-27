import { initialize, build } from "esbuild-wasm/esm/browser";

(async () => {
    try {
        const options = {
            entryPoints: ['<stdin>'],
            incremental: true,
            logLevel: 'error',
            write: false,
            // outfile: this.options.output,
            // format: context.options.format,
            banner: 'global = globalThis',
            // inject: this.options.platform === 'node' ? [] : [path.join(__dirname, '../shim/node.js')],
            // plugins: [
            //     context.options.platform === 'browser' && pluginNodePolyfill(),
            //     context.options.platform === 'browser' && pluginGlobalExternal(),
            //     pluginEntry(context),
            //     rollupProxyPlugin(plugins, context),
            //     pluginBareModule(context),
            //     context.options.http && pluginHttp(),
            //     context.options.unpkg && pluginUnpkg(),
            //     context.options.memfs && pluginMemfs(context),
            // ].filter(Boolean),
            globalName: 'bundler',

        };

        await initialize({
            worker: true,
            wasmURL: "https://unpkg.com/esbuild-wasm/esbuild.wasm"
        });

        await build(options);
    } catch (e) {
        console.warn(`esbuild error`, e);
    }
})();