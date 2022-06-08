import type { Plugin } from "vite";
export const fileRegex = /\.wasm\?to-js$/;

import { encode as base64 } from "../../deno/base64/mod";
import { encode } from "../../utils/encode-decode";
import { compress } from "../../deno/lz4/mod";
import * as fs from "node:fs/promises";

export function WASM_TO_JS(): Plugin {
  return {
    name: 'wasm-to-js', // this name will show up in warnings and errors,
    async transform(code, id) {
      if (fileRegex.test(id)) {
        id = id.replace(/\?to-js/, "");
        // console.log(, id)
        const compressed = await compress(await fs.readFile(id));
        const encoded = base64(compressed);
        
        const source = `import * as lz4 from "/deno/lz4/mod";
        export const source = lz4.decompress(Uint8Array.from(atob("${encoded}"), c => c.charCodeAt(0)));
        export default source`;
        return {
          code: source,
          map: null
        }
      };
    }

    // resolveId ( source ) {
    //   if (/\?to-js/.test(source)) {
    //     return source; // this signals that rollup should not ask other plugins or check the file system to find this id
    //   }
    //   return null; // other ids should be handled as usually
    // },
    // load ( id ) {
    //   if (id === 'virtual-module') {
    //     return 'export default "This is virtual!"'; // the source code for "virtual-module"
    //   }
    //   return null; // other ids should be handled as usually
    // }
  };
}

export default WASM_TO_JS;