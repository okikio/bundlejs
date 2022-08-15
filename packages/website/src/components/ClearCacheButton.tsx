import { onCleanup, onMount } from "solid-js";
import { createSignal } from "solid-js";

import { CACHE } from "@bundlejs/core/src/util";

import IconArrowClockwise from "~icons/fluent/arrow-clockwise-24-filled";
import Button from "./Button";

export function ClearCacheButton() {
  function onClick() { 
    (async () => {
      // Clear Cache
      if ("caches" in globalThis) {
        let cache_names = await caches.keys();
        await Promise.all(cache_names.map(cache_name => {
          return caches.delete(cache_name);
        }));
      } else await CACHE.clear();

      console.log("Clear Cache");
      globalThis?.location?.reload();
    })();
  }

  return (
    <Button class="bg-primary/20" title="Clear Cache / Force Reload Site" onClick={onClick}>
      <IconArrowClockwise />
    </Button>
  );
}

export default ClearCacheButton;