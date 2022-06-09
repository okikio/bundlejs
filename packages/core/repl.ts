import { build, FileSystem, setFile } from "./lib/index.mjs";

console.log("\n");
setFile("/index.tsx", `
  export * from "@okikio/animate";
`);

let result = await build({ 
  init: {
    platform: ("Deno" in globalThis) ? "deno" : ("process" in globalThis) ? "node" : "browser"
    // worker: true
  }
});

console.log(result)

if ("Deno" in globalThis) { 
  globalThis?.Deno?.exit?.();
}
