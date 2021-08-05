import { VIRTUAL_FS_NAMESPACE } from "./virtual-fs";
import type { Plugin } from 'esbuild';

export const ENTRY = (input: string): Plugin => {
    return {
        name: 'virtual-entry',
        setup(build) {
            build.onResolve({ filter: /^<stdin>$/ }, () => {
                return {
                    path: input,
                    namespace: VIRTUAL_FS_NAMESPACE,
                    pluginData: {
                        importer: '',
                    },
                };
            });
        },
    };
};