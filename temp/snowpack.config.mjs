// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

// snowpack.config.mjs
// Example: If `--polyfill-node` doesn't support your use-case, you can provide your own custom Node.js polyfill behavior
// const rollupPluginNodePolyfills = require('rollup-plugin-node-polyfills');
import rollupPluginNodePolyfills from 'rollup-plugin-node-polyfills';

export const resolve = (id) => {
  return `./node_modules/${id}`
};

// load core modules from builtin dir
export const localModule = (name) => {
  return resolve(`browser-builtins/builtin/${name}.js`);
}
// Remap builtins
export const PolyfillMap = {
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

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  exclude: ["typescript"],
  
  alias: {
    // ...PolyfillMap,
    // Type 1: Package Import Alias
    // lodash: 'lodash-es',
    // react: 'preact/compat',
    // // Type 2: Local Directory Import Alias (relative to cwd)
    // components: './src/components',
    'path': './node_modules/path',
    'buffer': './node_modules/buffer',
  },
  mount: {
    /* ... */
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    /* ... */
    polyfillNode: false,
    rollup: {
      plugins: [
        rollupPluginNodePolyfills()
      ]
    },
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2020',
    treeshake: true,
    splitting: true,
  },
};
