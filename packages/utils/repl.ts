import { parseQuery, stringifyQuery } from "./src/utils/url.ts";

console.log({
  "repl.ts": "Repl.ts - Cool",
  query: stringifyQuery({
    obj: {
      cool: "this"
    }
  })
})