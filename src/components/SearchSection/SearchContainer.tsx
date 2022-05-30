import { type ComponentProps, createSignal, Suspense } from "solid-js";
import type { SearchResultProps } from "./Result";

import SearchInput from "./SearchInput";
import { SearchResults } from "./SearchResults";

import { debounce, getRequest, parseInput } from "@bundlejs/core";
export function SearchContainer(props?: ComponentProps<'div'>) {
  const [getQuery, setQuery] = createSignal("");
  function onClear(e?: MouseEvent) { }

  const onKeyup = debounce((e?: KeyboardEvent) => {
    e?.stopPropagation?.();
    let { value } = e?.target as HTMLInputElement;
    if (value.length <= 0) return;

    setQuery(value);
  }, 250);

  return (
    <div class="search-container">
      <SearchInput
        onClear={onClear}
        onKeyup={onKeyup}
      />
      <SearchResults query={getQuery} />
    </div>
  );
}

export default SearchContainer;