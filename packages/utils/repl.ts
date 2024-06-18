// import { parseQuery, stringifyQuery } from "./src/utils/url.ts";

// console.log({
//   "repl.ts": "Repl.ts - Cool",
//   query: stringifyQuery({
//     obj: {
//       cool: "this"
//     }
//   })
// })


import { getPackageOfVersion, getPackageVersions, getPackages, getRegistryURL } from "./src/utils/npm-search.ts";

const input = "@okikio/animate";
let { version: range } = getRegistryURL(input);
const versionsAndTags = await getPackageOfVersion(input);
const pkg = await getPackages(input);

console.log({
  input,
  range,
  versionsAndTags,
  info: pkg.info,
})