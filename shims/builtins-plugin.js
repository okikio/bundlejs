import * as PolyfillMap from "browser-builtins";

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