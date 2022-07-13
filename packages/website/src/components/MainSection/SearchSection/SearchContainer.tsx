import { ComponentProps, onCleanup, onMount } from "solid-js";
import { createSignal } from "solid-js";

import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

export function SearchContainer(props?: ComponentProps<'div'>) {
  const [getQuery, setQuery] = createSignal("");

  let ref: HTMLDivElement & { open?: boolean } = null;
  function onClick(e?: MouseEvent) {
    let target = e.target as HTMLElement;

    if (ref?.open && !ref.contains(target)) {
      e?.stopPropagation?.();

      ref.open = false;
      ref.style.pointerEvents = "none";
    }
  }

  function onFocus(e?: MouseEvent) {
    let target = e.target as HTMLElement;

    if (ref.contains(target)) {
      if (!ref?.open) {
        ref.open = true;
        ref.style.pointerEvents = "auto";
      }
    }

    else if (ref?.open) {
      e?.stopPropagation?.();
      ref.open = false;
      ref.style.pointerEvents = "none";
    }
  }

  onMount(() => {
    document.addEventListener("click", onClick);
    document.addEventListener("focusin", onFocus);
  });

  onCleanup(() => {
    document.removeEventListener("click", onClick);
    document.removeEventListener("focusin", onFocus);
  });

  return (
    <div class="relative">
      <div class="search-offset"></div>
      <dialog class="search-container" ref={ref} {...props}>
        {/* <div class="search-backdrop"></div> */}
        <div class="search-input">
          <SearchInput query={setQuery} />
        </div>

        <div class="search-results">
          <SearchResults query={getQuery} />
        </div>
      </dialog>
    </div>
  );
}

export default SearchContainer;