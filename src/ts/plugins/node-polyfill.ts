import type { Plugin } from 'esbuild';
import { HTTP_NAMESPACE } from './http';
export const resolve = (id: string) => {
    return `https://unpkg.com/${id}`
};

// load core modules from builtin dir
export const localModule = (name) => {
    return resolve(`browser-builtins/builtin/${name}.js`);
}

export const NODE = (): Plugin => {
    return {
        name: 'node-polyfill',
        setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {
                // Remap builtins
                const polyfillMap = {
                    "console": resolve('console-browserify'),
                    "constants": resolve('constants-browserify'),
                    "crypto": resolve('crypto-browserify'),
                    "http": resolve('http-browserify'),
                    "buffer": resolve('buffer'),
                    "Dirent": resolve("dirent"),
                    "vm": resolve('vm-browserify'),
                    "zlib": resolve('zlib-browserify'),
                    "assert": resolve('assert'),
                    "child_process": localModule('child_process'),
                    "cluster": localModule('child_process'),
                    "dgram": localModule('dgram'),
                    "dns": localModule('dns'),
                    "domain": resolve('domain-browser'),
                    "events": resolve('events'),
                    "https": localModule('https'),
                    "module": localModule('module'),
                    "net": localModule('net'),
                    "path": resolve('path-browserify'),
                    "punycode": resolve('punycode'),
                    "querystring": localModule('querystring'),
                    "readline": localModule('readline'),
                    "repl": localModule('repl'),
                    "stream": localModule('stream'),
                    "string_decoder": resolve('string_decoder'),
                    "sys": localModule('sys'),
                    "timers": localModule('timers'),
                    "tls": localModule('tls'),
                    "tty": resolve('tty-browserify'),
                    "url": localModule('url'),
                    "util": localModule('util'),
                    "_shims": localModule('_shims'),
                    "_stream_duplex": localModule('_stream_duplex'),
                    "_stream_readable": localModule('_stream_readable'),
                    "_stream_writable": localModule('_stream_writable'),
                    "_stream_transform": localModule('_stream_transform'),
                    "_stream_passthrough": localModule('_stream_passthrough'),
                    // url: resolve('url'),
                    // assert: resolve('assert'),
                    // buffer: resolve('buffer'),
                    process: resolve('process/browser'),
                    // "fs": localModule('fs'),
                    fs: resolve('memfs'),
                    // path: resolve('path-browserify'),
                    // stream: resolve('stream-browserify'),
                    os: resolve('os-browserify/browser'),
                    // crypto: resolve('crypto-browserify'),
                    // vm: resolve('vm-browserify'),
                    // tty: resolve('tty-browserify'),
                };

                if (Object.keys(polyfillMap).includes(args.path)) {
                    return {
                        namespace: HTTP_NAMESPACE,
                        path: polyfillMap[args.path as 'os'],
                    };
                }
            });
        },
    };
};