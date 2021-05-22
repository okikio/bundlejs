import * as browserBuiltins from "browser-builtins";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// browserBuiltins["fs"] = require.resolve("memfs");

let PolyfillMap = {
    ...browserBuiltins,
    "fs": require.resolve("memfs")
};

export const NODE = () => {
    return {
        name: 'node-polyfill',
        setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {

                if (Object.keys(PolyfillMap).includes(args.path)) {
                    return {
                        // namespace: HTTP_NAMESPACE,
                        path: PolyfillMap[args.path],
                    };
                }
            });
        },
    };
};