export const STATE = {
    initialized: false,
    /**
     * Assets are files during the build process that esbuild can't handle natively,
     * e.g. fetching web workers using the `new URL("...", import.meta.url)`
     */
    assets: [],
    /**
     * Instance of esbuild being used
     */
    esbuild: null
};
export default STATE;
