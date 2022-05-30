import Button from "../Button";
import IconSearch from "~icons/fluent/search-24-filled";
import IconClear from "~icons/fluent/dismiss-24-filled";

import type { ComponentProps } from "solid-js";

export function SearchInput(props: ComponentProps<'div'> & {
  onClear?: (e?: MouseEvent) => void;
  onKeyup?: (e?: KeyboardEvent) => void;
}) { 
  return (
    <div class="search">
      <div class="px-3 py-2 gap-3 flex flex-row justify-center">
        <IconSearch astro-icon />
      </div>

      {/* @ts-ignore */}
      <input id="input" type="text" autocorrect="off" autocomplete="off" placeholder="Type a package name..." onKeyup={props?.onKeyup} />

      <Button class="clear umami--click--search-clear-button" title="Clear search input" onClick={props?.onClear}>
        <IconClear astro-icon />
      </Button>
    </div>
  );
}

export default SearchInput;