// import type { StringifyOptions } from "./src/types.ts";
// import { stringifyUrl } from "./src/query-string.ts";
// import qs from "npm:query-string";

// const options: StringifyOptions = {
//   arrayFormat: "bracket-separator",
//   // arrayFormatSeparator: "|"
// }

// const inputObj = {
//   url: "https://bundlejs.com",
//   query: {
//     x: [ 7, 8, null, undefined, '', 'cool', 10, [10, 6]]
//   }
// }

// const originalResult = qs.stringifyUrl(inputObj, options)
// const newResult = stringifyUrl(inputObj, options)
// console.log({
//   original: originalResult,
//   new: newResult,
//   match: originalResult === newResult
// })


import type { IStringifyOptions } from "./src/qs/types.ts";
import fullStringify, { stringify } from "./src/qs/stringify.ts";
import fs from "node:fs/promises";
import qs from "npm:qs";


const options: IStringifyOptions = { encode: false, arrayFormat: 'comma', strictNullHandling: true }
const inputObj = { a: [], b: [null], c: 'c' }

const originalResult = qs.stringify(inputObj, options)
const newResult = fullStringify(inputObj, options)
let result = {
  original: (originalResult),
  new: (newResult),
  match: originalResult === newResult
}
console.log(result)

await fs.writeFile("./url.ts", JSON.stringify(result, null, 2))