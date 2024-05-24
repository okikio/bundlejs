import { globToRegExp, normalizeGlob, basename, join, relative } from "@bundle/utils/utils/path.ts"; 
import { bytes } from "@bundle/utils/utils/fmt.ts";

import { promises as fs } from "node:fs";
import process from "node:process";

const encoder = new TextEncoder();

// @ts-ignore Deno.cwd isn't refined so relative doesn't quite work as expected
globalThis.Deno ??= {
  cwd(){ return process.cwd(); }
}

/**
 * Recursively walks through a directory and matches files against a regex pattern.
 * 
 * @param dir - The directory to start walking from.
 * @param baseDir - The base directory to remove from the file path before matching.
 * @param pattern - The regex pattern to match files against.
 * @param fileList - An array to collect matching files.
 * @returns A promise that resolves to an array of matching file paths.
 * 
 * @example
 * const files = await walk('.', './node_modules/typescript/lib', /\.d\.ts$/);
 * console.log(files); // ['./node_modules/typescript/lib/lib.dom.d.ts', ...]
 */
async function walk(dir: string, baseDir: string, pattern: RegExp, fileList: string[] = []): Promise<string[]> {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = join(dir, file.name);
    if (file.isDirectory()) {
      await walk(filePath, baseDir, pattern, fileList);
    } else if (file.isSymbolicLink()) {
      const realPath = await fs.realpath(filePath);
      const stats = await fs.stat(realPath);
      if (stats.isDirectory()) {
        await walk(realPath, baseDir, pattern, fileList);
      } else {
        const relativePath = relative(baseDir, realPath);
        if (pattern.test(relativePath)) {
          fileList.push(realPath);
        }
      }
    } else {
      const relativePath = relative(baseDir, filePath);
      if (pattern.test(relativePath)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

/**
 * Splits a glob pattern into static and dynamic parts.
 * 
 * @param globPattern - The glob pattern to split.
 * @returns An object containing the base directory and the dynamic part of the glob pattern.
 * 
 * @example
 * const { baseDir, dynamicPart } = splitGlobPattern('./node_modules/typescript/lib/*.d.ts');
 * console.log(baseDir); // './node_modules/typescript/lib'
 * console.log(dynamicPart); // '*.d.ts'
 */
function splitGlobPattern(globPattern: string): { baseDir: string, dynamicPart: string } {
  const normalizedPattern = normalizeGlob(globPattern, { globstar: true });
  const index = normalizedPattern.search(/[*?\[\]]/);
  if (index === -1) {
    return { baseDir: normalizedPattern, dynamicPart: '' };
  }
  return {
    baseDir: normalizedPattern.slice(0, index),
    dynamicPart: normalizedPattern.slice(index)
  };
}

/**
 * Generates a JSON file containing the contents of TypeScript declaration files.
 * 
 * @param src - The glob pattern to match TypeScript declaration files. Defaults to "./node_modules/typescript/lib/*.d.ts".
 * @param target - The path to the output JSON file. Defaults to "src/scripts/ts-libs.json".
 * @returns A promise that resolves when the JSON file is written.
 * 
 * @example
 * await generateLibs();
 * // - Source file: ./node_modules/typescript/lib/*.d.ts
 * // ['./node_modules/typescript/lib/lib.dom.d.ts', ...]
 * // - Writing output to file (src/scripts/ts-libs.json)
 * // - Output file (src/scripts/ts-libs.json), final size is: 1.2 MB
 */
export async function generateLibs(src: string = "./node_modules/typescript/lib/*.d.ts", target: string = "src/scripts/ts-libs.json"): Promise<void> {
  console.log(`\n- Source file: ${src}`);

  const { baseDir, dynamicPart } = splitGlobPattern(src);
  const pattern = globToRegExp(dynamicPart, { extended: true, globstar: true });
  console.log({ baseDir, dynamicPart, pattern }); // Debugging output
  const files = await walk(baseDir, baseDir, pattern);

  console.log(files);
  const res = await Promise.all(
    files.map(async (filePath) => [basename(filePath), (await fs.readFile(filePath, 'utf-8')).trim()])
  );
  const json = Object.fromEntries(res);

  console.log(`- Writing output to file (${target})`);
  await fs.writeFile(target, encoder.encode(JSON.stringify(json)));

  const outputFile = await fs.stat(target);
  console.log(
    `- Output file (${target}), final size is: ${bytes.format(outputFile.size)}\n`
  );
}

await generateLibs();