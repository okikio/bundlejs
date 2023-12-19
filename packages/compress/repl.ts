import { encode } from "@bundle/utils/utils/encode-decode.ts";
import { compress } from "./src/mod.ts";

console.log("\n");
console.log(
  await compress(
    [encode("Lorem Ipsium...Lorem Ipsium...Lorem Ipsium...Lorem Ipsium...")],
    { type: "gzip" }
  )
);

if (globalThis?.Deno) {
  globalThis?.Deno?.exit?.();
} else {
  // @ts-ignore Only for Node
  globalThis?.process?.exit?.();
}