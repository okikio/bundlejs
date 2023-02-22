import { build, compress, getFile, setFile, PLATFORM_AUTO, TheFileSystem } from "./src/index.ts";

const fs = await TheFileSystem;

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

const result = await build({
  entryPoints: ["/index.tsx", "/new.tsx"],
  esbuild: {
    treeShaking: true,
    splitting: true,
    format: "esm"
  },
});

console.log(
  await compress(
    result.contents.map((x: any) => x?.contents),
    { type: "gzip" }
  )
);


if (PLATFORM_AUTO == "deno") {
  globalThis?.Deno?.exit?.();
} else {
  // @ts-ignore Only for Node
  globalThis?.process?.exit?.();
}


// import { resolveVersion } from "./src/utils/npm-search";
// console.log(await resolveVersion("@okikio/animate@>=1 <2"))
