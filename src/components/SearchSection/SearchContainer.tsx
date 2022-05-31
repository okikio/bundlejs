import { onCleanup, onMount } from "solid-js";
import { createSignal } from "solid-js";

import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

export function SearchContainer() {
  const [getQuery, setQuery] = createSignal("");

  let ref: HTMLDivElement = null;
  function onFocus(e?: FocusEvent) {
    // @ts-ignore
    if (!ref?.open) ref.open = true; 
  }
  
  function onClick(e?: MouseEvent) {
    let target = e.target as HTMLElement;

    if (ref.contains(target)) {
      // @ts-ignore
      if (!ref?.open && target.id == 'input') ref.open = true;
    }

    // @ts-ignore
    else if (ref?.open) {
      e?.stopPropagation?.();

      // @ts-ignore
      ref.open = false;
    }
  }

  onMount(() => {
    document.addEventListener("click", onClick);
  });

  onCleanup(() => {
    document.removeEventListener("click", onClick);
  });

  return (
    <div class="relative">
      <div class="search-offset"></div>
      <dialog class="search-container" ref={ref}>
        <SearchInput query={setQuery} onFocus={onFocus} />

        <div class="search-results">
          <SearchResults query={getQuery} />
        </div>
      </dialog>
    </div>
  );
}

export default SearchContainer;