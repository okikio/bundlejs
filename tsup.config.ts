import { defineConfig } from 'tsup';

export default defineConfig({
  target: ["esnext", "node20", "chrome120"],
  format: ["esm", "cjs"],
  platform: "browser",
  sourcemap: true,
  clean: true,
  dts: true,
  outDir: "lib",
  external: ["esbuild"],
})