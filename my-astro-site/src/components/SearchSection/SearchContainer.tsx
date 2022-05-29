import type { ComponentProps } from "solid-js";

import SearchInput from "./SearchInput";
import { SearchResults, getSearchResults, setSearchResults } from "./SearchResults";

export function SearchContainer(props?: ComponentProps<'div'>) {
  function onClear(e?: MouseEvent) {
  }

  function onKeyup(e?: KeyboardEvent) {
  }

  return (
    <>
      <SearchInput
        onClear={onClear}
        onKeyup={onKeyup}
      />
      <SearchResults />
    </>
  );
}

export default SearchContainer;