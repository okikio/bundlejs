import path from 'path';
import type { IFs } from "memfs";

import type { Plugin } from 'esbuild';

export const VIRTUAL_FS_NAMESPACE = 'virtualfs';
export const VIRTUAL_FS = (fs: IFs): Plugin => {
    const resolve = ({ id, importer }: { id: string; importer: string }) => {
        let resolvedPath = id;
        if (importer && id.startsWith('.'))
            resolvedPath = path.resolve(path.dirname(importer), id);
        for (const x of ['', '.ts', '.js', '.css']) {
            const realPath = resolvedPath + x;
            if (fs.existsSync(realPath)) return realPath;
        }

        throw new Error(`${resolvedPath} not exists`);
    };
    
    return {
        name: VIRTUAL_FS_NAMESPACE,
        setup(build) {
            build.onResolve({ filter: /.*/, namespace: VIRTUAL_FS_NAMESPACE }, (args) => {
                return {
                    path: args.path,
                    pluginData: args.pluginData,
                    namespace: VIRTUAL_FS_NAMESPACE
                };
            });

            build.onLoad({ filter: /.*/, namespace: VIRTUAL_FS_NAMESPACE }, async (args) => {
                let realPath = args.path;
                const resolvePath = resolve({
                    id: args.path,
                    importer: args.pluginData.importer
                });
                
                if (!resolvePath) throw new Error('not found');
                realPath = resolvePath;

                const content = (await fs.promises.readFile(realPath)).toString();
                return {
                    contents: content,
                    pluginData: {
                        importer: realPath,
                    },
                    loader: path.extname(realPath).slice(1) as 'ts',
                };
            });
        },
    };
};