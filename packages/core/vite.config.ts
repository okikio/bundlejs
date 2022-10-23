import { defineConfig } from "vitest/config";
import copy from 'vite-plugin-cp';

export default defineConfig({
  test: {},
  build: {
    target: ["chrome99"],
    sourcemap: true,
    outDir: "lib",
    assetsInlineLimit: 0,
    lib: {
      entry: "./src/index.ts",
      name: "bundlejs"
    },
    rollupOptions: {
      output: [
        {
          format: "es",
          manualChunks: {
            "esbuild": ["esbuild-wasm"],
            "esbuild-wasm": ["/src/wasm.ts"],
            "lz4": ["/src/deno/lz4/wasm.ts"],
            "gzip": ["/src/deno/denoflate/pkg/denoflate_bg.wasm.js"],
            "brotli": ["/src/deno/brotli/wasm.ts"],
          },
          chunkFileNames: "[name]-[hash].mjs",
          entryFileNames: "[name].mjs",
        },
        {
          format: "cjs",
          manualChunks: {
            "esbuild": ["esbuild-wasm"],
            "esbuild-wasm": ["/src/wasm.ts"],
            "lz4": ["/src/deno/lz4/wasm.ts"],
            "gzip": ["/src/deno/denoflate/pkg/denoflate_bg.wasm.js"],
            "brotli": ["/src/deno/brotli/wasm.ts"]
          },
          entryFileNames: "[name].cjs",
          chunkFileNames: "[name]-[hash].cjs",
        },
        {
          format: "umd",
          entryFileNames: "[name].js",
          inlineDynamicImports: true
        }
      ],
      plugins: [
        copy({
          targets: [
            // @ts-ignore
            { src: 'src/esbuild.wasm', dest: './lib' },
          ]
        })
      ],
      external: ["esbuild"]
    },
  },
});
