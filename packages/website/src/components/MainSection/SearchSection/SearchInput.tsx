import Button from "../../Button";
import IconSearch from "~icons/fluent/search-24-filled";
import IconClear from "~icons/fluent/dismiss-24-filled";

import { ComponentProps, onCleanup, onMount, Setter } from "solid-js";
import { debounce } from "@bundlejs/core/src/util";

import { ToolTip, SingletonToolTip } from "../../../hooks/tooltip";
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

      <ToolTip as={Button} content="Clear Search Input and Results" id="clear" aria-label="Clear search input and results" class="umami--click--search-clear-button" onClick={onClear}>
        <IconClear astro-icon />
      </ToolTip>
    </div>
  );
}

export default SearchInput;