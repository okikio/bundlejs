import { bytes } from "@bundlejs/core/src/util";
import glob from "fast-glob";

import { basename } from "path";
import * as fs from "node:fs/promises";
const encoder = new TextEncoder();

export async function generateLibs(src = `./node_modules/typescript/lib/*.d.ts`, target = `src/scripts/ts-libs.json`) {
  console.log(`\n- Source file: ${src}`);

  const files = await glob([src]);
  console.log(files)
  const res = await Promise.all(
    files.map(async (path) => [basename(path), (await fs.readFile(path, 'utf-8')).trim()])
  );
  const json = Object.fromEntries(res);

  console.log(`- Writing output to file (${target})`);
  await fs.writeFile(target, encoder.encode(JSON.stringify(json)));

  const outputFile = await fs.stat(target);
  console.log(
    `- Output file (${target}), final size is: ${bytes(outputFile.size)}\n`
  );
}

await generateLibs();