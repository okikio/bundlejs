import { build, compress, setFile, PLATFORM_AUTO } from "./lib/index.mjs";
// import { build, compress, setFile, PLATFORM_AUTO } from "./src/index";

globalThis.fetch = globalThis.fetch ?? (async function (...args: Parameters<typeof fetch>) {
  const { fetch } = await import("cross-fetch");
  return await fetch(...args);
});

console.log("\n");
setFile("/index.tsx", `\
export * as Other from "/new.tsx";
export * from "@okikio/animate";`);
setFile("/new.tsx", "export * from \"@okikio/native\";");
setFile("/other.tsx", `\
export * as Other from "/index.tsx";
export * from "@okikio/emitter";`);

const bundle = build; //  as typeof buildType
const result = await bundle({
  entryPoints: ["/index.tsx", "/new.tsx"],
  esbuild: {
    treeShaking: true,
    splitting: true,
    format: "esm"
  }
});

console.log(
  await compress(
    result.contents.map((x: any) => x?.contents)
  )
);

if (PLATFORM_AUTO == "deno") {
  globalThis?.Deno?.exit?.();
}


// import { resolveVersion } from "./src/utils/npm-search";
// console.log(await resolveVersion("@okikio/animate@>=1 <2"))