import type { OutputFile } from "esbuild-wasm";
import type * as ESBUILD from "esbuild";
export declare const STATE: {
    initialized: boolean;
    /**
     * Assets are files during the build process that esbuild can't handle natively,
     * e.g. fetching web workers using the `new URL("...", import.meta.url)`
     */
    assets: OutputFile[];
    /**
     * Instance of esbuild being used
     */
    esbuild: typeof ESBUILD;
};
export default STATE;
