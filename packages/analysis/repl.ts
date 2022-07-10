import { build, getSize, setFile, PLATFORM_AUTO } from "@bundlejs/core";

// @ts-ignore
// import type { build as buildType } from "./src/index";

console.log("\n");
setFile("/index.tsx", `\
export * as Other from "/new.tsx";
export * from "@okikio/animate";`);
setFile("/new.tsx", `export * from "@okikio/native";`);
setFile("/other.tsx", `\
export * as Other from "/index.tsx";
export * from "@okikio/emitter";`);

const bundle = build; //  as typeof buildType
let result = await bundle({
  entryPoints: ["/index.tsx", "/new.tsx"],
  esbuild: {
    treeShaking: true,
    splitting: true
  }
  
});
console.log(await getSize(result.contents));

if (PLATFORM_AUTO == "deno") { 
  globalThis?.Deno?.exit?.();
}


// import { resolveVersion } from "./src/utils/npm-search";
// console.log(await resolveVersion("@okikio/animate@>=1 <2"))