import Button from "../../Button";
import IconSearch from "~icons/fluent/search-24-filled";
import IconClear from "~icons/fluent/dismiss-24-filled";

import type { ComponentProps, Setter } from "solid-js";

import { debounce } from "@bundlejs/core";
export function SearchInput(props: ComponentProps<'div'> & {
  query?: Setter<string>;
}) { 
  let ref: HTMLInputElement;

  function onClear() { 
    ref.value = "";
    props?.query?.("");
  }

  const onKeyup = debounce((e?: KeyboardEvent) => {
    e?.stopPropagation?.();
    let { value } = ref;
    props?.query?.(value);
  }, 250);

  return (
    <div class="search">
      <div class="px-3 py-2 gap-3 flex flex-row justify-center">
        <IconSearch astro-icon />
      </div>

      {/* @ts-ignore */}
      <input id="input" type="text" autocorrect="off" autocomplete="off" placeholder="Type a package name..." onKeyup={onKeyup} ref={ref} />

      <Button class="clear umami--click--search-clear-button" title="Clear search input" onClick={onClear}>
        <IconClear astro-icon />
      </Button>
    </div>
  );
}

export default SearchInput;