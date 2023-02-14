import type { ESBUILD } from "../types.ts";
/**
 * Holds global state
 */
declare const STATE: {
    /**
     * Registers if esbuild has been initialized
     */
    initialized: boolean;
    /**
     * Assets are files during the build process that esbuild can't handle natively,
     * e.g. fetching web workers using the `new URL("...", import.meta.url)`
     */
    assets: ESBUILD.OutputFile[];
    /**
     * Instance of esbuild being used
     */
    esbuild: typeof ESBUILD;
};
/**
 * Gets state or if there is no name returns STATE object
 */
export declare function getState<T extends keyof typeof STATE>(name?: T): {
    /**
     * Registers if esbuild has been initialized
     */
    initialized: boolean;
    /**
     * Assets are files during the build process that esbuild can't handle natively,
     * e.g. fetching web workers using the `new URL("...", import.meta.url)`
     */
    assets: ESBUILD.OutputFile[];
    /**
     * Instance of esbuild being used
     */
    esbuild: typeof ESBUILD;
}[T];
export declare function setState<T extends keyof typeof STATE>(name: T, value: typeof STATE[T]): {
    /**
     * Registers if esbuild has been initialized
     */
    initialized: boolean;
    /**
     * Assets are files during the build process that esbuild can't handle natively,
     * e.g. fetching web workers using the `new URL("...", import.meta.url)`
     */
    assets: ESBUILD.OutputFile[];
    /**
     * Instance of esbuild being used
     */
    esbuild: typeof ESBUILD;
}[T];
export type Getter<T> = () => T;
export type Setter<T> = (value?: T) => T;
export type StateArray<T> = [Getter<T>, Setter<T>];
/**
 * Returns a state array
 * @param initial Initial state
 * @returns [get, set] functions
 */
export declare function createState<T>(initial?: T): StateArray<T>;
export {};
