import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    sourcemap: true,
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
  },
  plugins: [
    dts({
      outputDir: "@types",
      tsConfigFilePath: "./dts.tsconfig.json"
    })
  ]
})
