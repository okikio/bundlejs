import type { ESBUILD } from "../types";

/**
 * Holds global state 
 */
const STATE = {
  /**
   * Registers if esbuild has been initialized
   */
  initialized: false as boolean,

  /**
   * Assets are files during the build process that esbuild can't handle natively, 
   * e.g. fetching web workers using the `new URL("...", import.meta.url)`
   */
  assets: [] as ESBUILD.OutputFile[],

  /**
   * Instance of esbuild being used
   */
  esbuild: null as typeof ESBUILD
};

/**
 * Gets state or if there is no name returns STATE object
 */
export function getState<T extends keyof typeof STATE>(name?: T) {
  return STATE[name];
}

export function setState<T extends keyof typeof STATE>(name: T, value: typeof STATE[T]) {
  return (STATE[name] = value);
}

export type Getter<T> = () => T;
export type Setter<T> = (value?: T) => T;
export type StateArray<T> = [Getter<T>, Setter<T>];

/**
 * Returns a state array
 * @param initial Initial state
 * @returns [get, set] functions
 */
export function createState<T>(initial?: T) {
  let result = initial;
  return [
    () => result,
    (value?: T) => {
      if (typeof value === "object" && !Array.isArray(value) && value !== null) {
        Object.assign(result, value);
      } else {
        result = value ?? initial;
      }
      return result;
    }
  ] as StateArray<T>;
}