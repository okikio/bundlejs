import * as path from 'path';
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: "lib",
    lib: {
      entry: "./src/index.ts",
      name: 'bundlejs',
      formats: ["es", "cjs", "umd"],
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
      }
    }
  }
})
