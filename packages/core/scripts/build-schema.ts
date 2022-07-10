import * as TJS from "typescript-json-schema";
import * as fs from "node:fs/promises";

import { bytes } from "../src/utils/pretty-bytes";
const encoder = new TextEncoder();

export const generateSchema = async () => {
  let compilerOpts = {
    // Enable top-level await, and other modern ESM features.
    "target": "ESNext",
    "module": "ESNext",
    // Enable node-style module resolution, for things like npm package imports.
    "moduleResolution": "node",
    // Enable JSON imports.
    "resolveJsonModule": true,
    // Enable stricter transpilation for better output.
    "isolatedModules": true,
    // Add support for Web Workers
    "lib": [
      "ES2021",
      "DOM",
      "DOM.Iterable"
    ],
  }

  const program = TJS.getProgramFromFiles(["src/configs/options.ts"], compilerOpts, "./");
  const generator = TJS.buildGenerator(program, {});

  // We can either get the schema for one file and one type...
  const schema = TJS.generateSchema(program, "BundleConfigOptions", {}, [], generator);
  return schema;
};

export const build = async (target = "src/schema.ts") => {
  const schema = await generateSchema();
  const source = `const schema = ${JSON.stringify(schema)}; export default schema;`;
  await fs.writeFile(target, encoder.encode(source));

  const outputFile = await fs.stat(target);
  console.log(
    `- Output file (${target}), final size is: ${bytes(outputFile.size)}\n`
  );
};

await build();
