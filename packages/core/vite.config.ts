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
            "esbuild": ["/src/wasm.ts", "esbuild-wasm"],
            "lz4": ["/src/deno/lz4/mod.ts"],
            "gzip": ["/src/deno/denoflate/mod.ts"],
            "brotli": ["/src/deno/brotli/mod.ts"]
          },
          chunkFileNames: "[name].mjs",
          entryFileNames: "[name].mjs"
        },
        {
          format: "cjs",
          entryFileNames: "[name].cjs"
        },
        {
          format: "umd",
          entryFileNames: "[name].js"
        }
      ],
      external: ["esbuild"]
    }
  }
})
