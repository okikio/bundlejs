/// <reference lib="webworker" />
import { init, setFile, deleteFile, useFileSystem, getFile } from "@bundle/core/src/index.ts";
import { PLATFORM_AUTO } from "@bundle/core/src/index.ts";

import type { ESBUILD, IFileSystem } from "@bundle/core/src/index.ts";

export let initOpts: ESBUILD.InitializeOptions = null;
export const ready = (async () => {
  initOpts = { worker: false };
  const fs = await useFileSystem("OPFS");
  console.log({
    writeToOPFS: true
  })
  await setFile(fs, "/cool/text_file.ts", "This is pretty cool");
  await setFile(fs, "/cool/text_file.ts", "This was pretty cool");

  await deleteFile(fs, "/cool/text_file.ts");
  await setFile(fs, "/cool/text_file.ts", "2 can play this game");

  console.log({
    contents: await getFile(fs, "/cool/text_file.ts", "string"),
  })

  const files = (await fs.files());
  console.log({
    entries: Array.from(files.entries())
  })
  
  return await init([PLATFORM_AUTO], initOpts);
})();
