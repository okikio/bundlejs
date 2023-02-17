import type { PartialMessage } from "esbuild-wasm";

import { ansi } from "./ansi.ts";
import { getEsbuild } from "./get-esbuild.ts";

/** 
 * Inspired by https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
 * I didn't even know this was exported by esbuild, great job @egoist
*/
export async function createNotice (errors: PartialMessage[], kind: "error" | "warning" = "error", color = true) {
  const { formatMessages } = await getEsbuild();
  const notices = await formatMessages(errors, { color, kind });
  return notices.map((msg) => !color ? msg : ansi(msg.replace(/(\s+)(\d+)(\s+)\│/g, "\n$1$2$3│")));
};

export default createNotice;