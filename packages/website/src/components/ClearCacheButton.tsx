import Button from "./Button";
import { CACHE } from "@bundlejs/core/src/util";

import IconArrowClockwise from "~icons/fluent/arrow-clockwise-24-filled";

export function ClearCacheButton() {
  async function onClick() {
    if ("caches" in globalThis) {
      const cache_names = await caches.keys();
      await Promise.all(cache_names.map(cache_name => {
        return caches.delete(cache_name);
      }));
    } else CACHE.clear();

    console.log("Clear Cache");
    globalThis?.location?.reload();
  }

  return (
    <Button class="bg-primary/20" title="Clear Cache / Force Reload Site" onClick={onClick}>
      <IconArrowClockwise />
    </Button>
  );
}

export default ClearCacheButton;