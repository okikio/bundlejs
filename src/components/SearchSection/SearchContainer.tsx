import type { ComponentProps } from "solid-js";
import { createSignal } from "solid-js";

import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

import { debounce } from "../../../packages/core/src/index"; // @bundlejs/core
export function SearchContainer() {
  const [getQuery, setQuery] = createSignal("");
  let ref: HTMLInputElement;

  function onClear(e?: MouseEvent) { }

  const onKeyup = debounce((e?: KeyboardEvent) => {
    e?.stopPropagation?.();
    console.log(ref)
    let { value } = e?.target as HTMLInputElement;
    if (value.length <= 0) return;

    setQuery(value);
  }, 250);

  return (
    <div class="search-container">
      <SearchInput
        onClear={onClear}
        onKeyup={onKeyup}
        ref={ref}
      />
      <SearchResults query={getQuery} />
    </div>
  );
}

export default SearchContainer;