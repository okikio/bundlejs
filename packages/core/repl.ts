import { getFile, setFile, PLATFORM_AUTO, TheFileSystem } from "./src/index.ts";
import { context, cancel, dispose, rebuild, } from "./src/index.ts";

// compress, resolveVersion, defaultVersion 

const fs = await TheFileSystem;

// console.log({
//   version: await resolveVersion(`esbuild@0.18`)
// })
console.log("\n");
await setFile(fs, "/index.tsx", `\
export * as Other from "/new.tsx";
export * from "@okikio/animate";`);
await setFile(fs, "/new.tsx", "export * from \"@okikio/native\";");
await setFile(fs, "/other.tsx", `\
export * as Other from "/index.tsx";
export * from "@okikio/emitter";`);

console.log(await getFile(fs, "/index.tsx", "string") )
console.log(fs)

const ctx = await context({
  entryPoints: ["/index.tsx", "/new.tsx"],
  esbuild: {
    treeShaking: true,
    splitting: true,
    format: "esm"
  },
  init: {
    // platform: "node",
    // version: "0.17",
    // wasm
  }
});
const result = await rebuild(ctx);

console.log({
  result,
  packageManifests: result.state.packageManifests,
  //   // await compress(
  //   //   result.contents.map((x: any) => x?.contents),
  //   //   { type: "gzip" }
  //   // )
});


await setFile(fs, "/index.tsx", `\
  export * as Other from "/new.tsx";
  export * from "spring-easing";`);
const result2 = await rebuild(ctx);


console.log({
  result2,
  packageManifests: result2.state.packageManifests,
  //   // await compress(
  //   //   result.contents.map((x: any) => x?.contents),
  //   //   { type: "gzip" }
  //   // )
});

await cancel(ctx);
await dispose(ctx);
if (PLATFORM_AUTO === "deno") {
  globalThis?.Deno?.exit?.();
} else {
  // @ts-ignore Only for Node
  globalThis?.process?.exit?.();
}


// import { resolveVersion } from "./src/utils/npm-search";
// console.log(await resolveVersion("@okikio/animate@>=1 <2"))

