import { defineConfig } from "vite";
import copy from 'vite-plugin-cp';

export default defineConfig({
  build: {
    target: ["chrome110"],
    sourcemap: true,
    outDir: "dist",
    assetsInlineLimit: 0,
    lib: {
      entry: "./src/index.ts",
      name: "bundlejs"
    },
    rollupOptions: {
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
