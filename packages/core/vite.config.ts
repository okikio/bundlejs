import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { },
  build: {
    target: ["chrome99"],
    sourcemap: true,
    outDir: "lib",
    assetsInlineLimit: 0,
    lib: {
      entry: "./src/index.ts",
      name: 'bundlejs'
    },
    rollupOptions: {
      output: [
        {
          format: "es",
          manualChunks: {
            "schema": ["/src/schema.ts"],
            "esbuild": ["esbuild-wasm"],
            "esbuild-wasm": ["/src/wasm.ts"],
            "lz4": ["/src/deno/lz4/wasm.ts"],
            "gzip": ["/src/deno/denoflate/pkg/denoflate_bg.wasm.js"],
            "brotli": ["/src/deno/brotli/wasm.ts"]
          },
          chunkFileNames: "[name].mjs",
          entryFileNames: "[name].mjs"
        },
        {
          format: "cjs",
          entryFileNames: "[name].cjs"
        },
        // {
        //   format: "umd",
        //   entryFileNames: "[name].js",
        //   manualChunks: () => 'index.js'
        // }
      ],
      external: ["esbuild"]
    }
  }
})
