"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATE = void 0;
exports.STATE = {
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
exports.default = exports.STATE;
