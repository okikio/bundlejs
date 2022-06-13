import { build } from "esbuild";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await build({
    entryPoints: [path.resolve(__dirname, "typedoc.tsx")],
    jsxFactory: "JSX.createElement", 
    "jsxFragment": "JSX.Fragment", 
    "format": "cjs", 
    "outfile": path.resolve(__dirname, "typedoc.cjs")
});