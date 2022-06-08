import { build, FileSystem, setFile } from "./lib/index.mjs";

console.log("\n");
setFile("/index.tsx", `
  export * from "@okikio/animate";
`);

let result = await build({ 
  init: {
    platform: "deno"
  }
});

console.log(result)
