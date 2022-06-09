import repl_url from "./repl.ts?url";

new Worker(repl_url, {
  type: "module"
})