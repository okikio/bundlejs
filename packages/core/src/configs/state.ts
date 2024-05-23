import type { ESBUILD } from "../types.ts";

export interface GlobalState {
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
  esbuild: typeof ESBUILD | null;

  [key: PropertyKey]: unknown;
}

/**
 * Holds global state
 */
const STATE: GlobalState = {
  initialized: false,
  assets: [],
  esbuild: null,
};

/**
 * Gets state or if there is no name returns STATE object
 */
export function getState<T extends keyof State, State extends Record<PropertyKey, unknown> = GlobalState>(
  name?: T,
  state: State = STATE as unknown as State
): State[T] | null {
  return name && name in state ? state[name] : null;
}

/**
 * Sets state value
 */
export function setState<T extends keyof State, State extends Record<PropertyKey, unknown> = GlobalState>(
  name: T,
  value: State[T],
  state: State = STATE as unknown as State
): State[T] {
  state[name] = value;
  return value;
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
      if (
        typeof value === "object" && 
        !Array.isArray(value) && 
        value !== null
      ) {
        Object.assign(result as {}, value);
      } else result = value ?? initial;

      return result;
    }
  ] as StateArray<T>;
}