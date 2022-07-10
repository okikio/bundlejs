import { defineConfig } from "vitest/config";

import SOLID from 'vite-plugin-solid';
export default defineConfig({
  plugins: [SOLID()],
  test: {},
  build: {
    target: ["chrome99"],
    sourcemap: true,
    outDir: "lib",
    assetsInlineLimit: 0,
    lib: {
      entry: "./src/index.ts",
      name: 'analysis'
    },
    rollupOptions: {
      output: [
        {
          format: "es",
          entryFileNames: "[name].mjs",
          chunkFileNames: "[name]-[hash].mjs"
        },
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
          chunkFileNames: "[name]-[hash].cjs"
        },
        {
          format: "umd",
          entryFileNames: "[name].js",
          manualChunks: () => 'index.js'
        }
      ]
    }
  }
})
