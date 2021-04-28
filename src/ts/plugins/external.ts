import type { Plugin } from 'esbuild';
export const EXTERNAL = (): Plugin => {
    return {
        name: 'external-globals',
        setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {
                if (['chokidar', 'yargs', 'node-fetch'].includes(args.path)) {
                    return {
                        path: args.path,
                        namespace: 'external',
                    };
                }
            });

            build.onLoad({ filter: /.*/, namespace: 'external' }, (args) => {
                if (args.path === 'node-fetch') 
                    return { contents: 'export default fetch' };
                
                return {
                    contents: `module.exports = ${args.path}`,
                };
            });
        },
    };
};