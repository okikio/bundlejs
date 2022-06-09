import { defineConfig } from "vitest/config";

import dts from 'vite-plugin-dts';
import WASM_TO_JS from "./vite-plugins/wasm-to-js/index";

export default defineConfig({
  test: { },
  build: {
    target: ["chrome99"],
    sourcemap: true,
    outDir: "lib",
    assetsInlineLimit: 0,
    lib: {
      entry: "./src/index.ts",
      name: 'bundlejs',
      formats: ["es"], //, "cjs", "umd"],
      fileName(format) {
        switch (format) { 
          case "es":
            return `index.mjs`;
          case "cjs":
            return `index.cjs`;
          case "umd":
            return `index.js`;
        }

        return `index.${format}.js`;
      },
    },
    rollupOptions: {
      manualChunks: {
        "esbuild-wasm": ["esbuild-wasm/esbuild.wasm?to-js", "esbuild-wasm"],
        compress: ["/src/deno/lz4/mod.ts", "/src/deno/denoflate/mod.ts", "/src/deno/brotli/mod.ts"]
      },
      external: ["esbuild"]
    }
  },
  plugins: [     
    WASM_TO_JS(),
    dts({
      outputDir: "@types",
      tsConfigFilePath: "./dts.tsconfig.json"
    })
  ]
})
