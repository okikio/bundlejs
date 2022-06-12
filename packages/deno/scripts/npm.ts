// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  typeCheck: false,
  packageManager: "npm",
  declaration: false,
  entryPoints: ["./mod.ts"],
  compilerOptions: {
    lib: ["es2021", "dom"],
  },
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
    undici: true
  },
  package: {
    // package.json properties
    name: "@bundlejs/core",
    version: Deno.args[0],
    description: "An animation library for the modern web which utilizes the Web Animation API (WAAPI) to create butter smooth animation.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/okikio/bundlejs.git",
    },
    bugs: {
      url: "https://github.com/okikio/bundlejs/issues",
    },
  },
});

// post build steps
// Deno.copyFileSync("LICENSE", "npm/LICENSE");
// Deno.copyFileSync("README.md", "npm/README.md");