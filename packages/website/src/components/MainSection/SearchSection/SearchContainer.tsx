import type { ComponentProps } from "solid-js";

import { onCleanup, onMount, createSignal } from "solid-js";
import { registerSearchProvider } from "./search-context.ts";

import SearchResults from "./SearchResults.tsx";
import SearchInput from "./SearchInput.tsx";

export function SearchContainer(props?: ComponentProps<"dialog">) {
  const [open, setOpen] = createSignal(false);

  let ref: HTMLDialogElement | undefined | null;
  function onClick(e?: MouseEvent) {
    const target = e?.target as HTMLElement | undefined | null;

    if (ref?.open && target && !ref.contains(target)) {
      e?.stopPropagation?.();

      ref.open = false;
      setOpen(ref.open);
      ref.style.pointerEvents = "none";
    }
  }

  function onFocus(e?: FocusEvent) {
    const target = e?.target as HTMLElement | undefined | null;

    if (ref && target && ref?.contains(target)) {
      if (!ref?.open) {
        ref.open = true;
        setOpen(ref.open);
        ref.style.pointerEvents = "auto";
      }
    } else if (ref?.open) {
      e?.stopPropagation?.();
      ref.open = false;
      setOpen(ref.open);
      ref.style.pointerEvents = "none";
    }
  }

  onMount(() => {
    if ("document" in globalThis) {
      document.addEventListener("click", onClick);
      document.addEventListener("focusin", onFocus);

      registerSearchProvider();
    }
  });

  onCleanup(() => {
    if ("document" in globalThis) {
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFocus);
      ref = null;
    }
  });

  return (
    <div class="relative">
      <div class="search-backdrop" data-open={open()} />
      <div class="search-offset" />
      <dialog class="search-container" ref={(el) => (ref = el)} {...props}>
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