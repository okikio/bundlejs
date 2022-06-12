import { formatMessages } from "esbuild-wasm";
import { ansi } from "./ansi.js";
/**
 * Inspired by https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
 * I didn't even know this was exported by esbuild, great job @egoist
*/
export const createNotice = async (errors, kind = "error", color = true) => {
    const notices = await formatMessages(errors, { color, kind });
    return notices.map((msg) => !color ? msg : ansi(msg.replace(/(\s+)(\d+)(\s+)\│/g, "\n$1$2$3│")));
};
export default createNotice;
