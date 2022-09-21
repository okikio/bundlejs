import { ComponentProps, onCleanup, onMount } from "solid-js";
import { createSignal } from "solid-js";

import SearchInput, { setQuery, getQuery } from "./SearchInput";
import SearchResults from "./SearchResults";

export function SearchContainer(props?: ComponentProps<'dialog'>) {
  const [open, setOpen] = createSignal(false);

  let ref: HTMLDialogElement = null;
  function onClick(e?: MouseEvent) {
    let target = e.target as HTMLElement;

    if (ref?.open && !ref.contains(target)) {
      e?.stopPropagation?.();

      ref.open = false;
      setOpen(ref.open);
      ref.style.pointerEvents = "none";
    }
  }

  function onFocus(e?: MouseEvent) {
    let target = e.target as HTMLElement;

    if (ref.contains(target)) {
      if (!ref?.open) {
        ref.open = true;
        setOpen(ref.open);
        ref.style.pointerEvents = "auto";
      }
    }

    else if (ref?.open) {
      e?.stopPropagation?.();
      ref.open = false;
      setOpen(ref.open);
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
      <div class="search-backdrop" data-open={open()}></div>
      <div class="search-offset"></div>
      <dialog class="search-container" ref={ref} {...props}>
        <div class="search-input">
          <SearchInput />
        </div>

        <div class="search-results">
          <SearchResults />
        </div>
      </dialog>
    </div>
  );
}

export default SearchContainer;