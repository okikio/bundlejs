import { createSignal } from "solid-js";
import { useSearchContext } from "./search-context.ts";

import { ToolTip } from "../../../hooks/tooltip.tsx";
import Button from "../../Button.tsx";

import IconSearch from "~icons/fluent/search-24-filled";
import IconClear from "~icons/fluent/dismiss-24-filled";

import { debounce } from "@bundle/utils/src/mod.ts";

export function SearchInput() { 
  let ref: HTMLInputElement | undefined | null;
  const [ctx, { setInput }] = useSearchContext();

  function onClear() { 
    if (ref) {
      ref.value = "";
      setInput("");
    }
  }

  const onKeyUp = debounce((e?: KeyboardEvent) => {
    e?.stopPropagation?.();
    if (ref) setInput(ref?.value);
  }, 250);

  return (
    <div class="search">
      <div class="px-3 py-2 gap-3 flex flex-row justify-center">
        <IconSearch astro-icon />
      </div>

      <input 
        id="input" 
        type="text" 
        autocorrect="off" 
        autocomplete="off" 
        placeholder="Type a package name..." 
        onKeyUp={onKeyUp} 
        ref={(el) => (ref = el)} 
      /> 

      <ToolTip content="Clear Search Input and Results"> 
        <Button id="clear" aria-label="Clear search input and results" class="umami--click--search-clear-button" onClick={onClear}>
          <IconClear astro-icon />
        </Button>
      </ToolTip> 
    </div>
  );
}

export default SearchInput;