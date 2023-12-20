import { defineConfig } from 'tsup';
import extendsConfig from "../../tsup.config.ts";

export default defineConfig({
  ...extendsConfig,
  entry: ["src/index.ts", "src/mod.ts", "src/wasm.ts"]
})