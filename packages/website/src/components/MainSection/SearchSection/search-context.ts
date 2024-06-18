import type { SearchPackage } from "@bundle/utils/utils/types.ts";
import type { SearchResultProps } from "./Result.tsx";

import { createResource } from "solid-js";
import { createStore } from "solid-js/store";

import { getPackages } from "@bundle/utils/utils/npm-search.ts";
import { debounce } from "@bundle/utils/utils/async.ts";

export interface SearchProviderProps {
  loading: boolean;
  input: string;
  result: Array<SearchPackage | SearchResultProps>;
  error: Error | null;
}

export type SearchContextType = [
  SearchProviderProps,
  {
    setInput: (input: string) => void;
    setResult: (arr: SearchProviderProps["result"]) => void;
    setLoading: (bool: boolean) => void;
    setError: (err: Error | null) => void;
  }
];

export const [state, setState] = createStore<SearchProviderProps>({
  input: "",
  result: [],
  loading: false,
  error: null,
});

export function useSearchContext() {
  return [
    state,
    {
      setInput(input: string) {
        setState("input", input);
      },
      setResult(arr: SearchProviderProps["result"]) {
        setState("result", arr);
      },
      setLoading(bool: boolean) {
        setState("loading", bool);
      },
      setError(err: Error | null) {
        setState("error", err);
      },
    },
  ] as SearchContextType;
}


export function registerSearchProvider() {
  return createResource(() => state.input, debounce(async (input) => {
    if (!("document" in globalThis)) return;
    setState("error", null);
    
    try {
      setState("loading", true);
      if (input.length === 0) return setState("result", []);
      if (input.length <= 1) {
        throw new Error(
          `'${input}' you must have a minimum of 2 characters.`
        );
      }

      const { packages } = await getPackages(input);
      const data = packages?.map?.((result) => result.package) ?? [];
      setState("result", (data));
    } catch (err) {
      setState("error", err instanceof Error ? err : new Error(err?.toString?.()));
      setState("result", []);
    } finally {
      setState("loading", false);
    }
  }, 200));
}
