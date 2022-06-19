import { build, setFile, PLATFORM_AUTO } from "./lib/index.mjs";

console.log("\n");
setFile("/index.tsx", `export * from "@okikio/animate";`);

let result = await build();
console.log(result);

if (PLATFORM_AUTO == "deno") { 
  globalThis?.Deno?.exit?.();
}


// import { resolveVersion } from "./src/utils/npm-search";
// console.log(await resolveVersion("@okikio/animate@>=1 <2"))