import { build, setFile, PLATFORM_AUTO } from "./mod.ts";

console.log("\n");
setFile("/index.tsx", `export * from "@okikio/animate";`);

const result = await build();
console.log(result);

if (PLATFORM_AUTO == "deno") { 
  globalThis?.Deno?.exit?.();
}
