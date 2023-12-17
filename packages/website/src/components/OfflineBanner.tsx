import type { ComponentProps } from "solid-js";
import { createSignal, Show } from "solid-js";
import OfflineIcon from "~icons/fluent/cloud-offline-24-regular";

const [isOnline, setIsOnline] = createSignal(true);

if ("visualViewport" in globalThis) {
  setIsOnline(navigator.onLine);

  globalThis.addEventListener("online", () => {
    setIsOnline(true);
  });

  globalThis.addEventListener("offline", () => {
    setIsOnline(false);
  });
}

export function Offline(props: ComponentProps<"div">) {
  return (
    // Show when Offline Icon when offline
    <Show when={!isOnline()}>
      <div class={props.class} title="You are offline" aria-label="You are offline">
        <OfflineIcon />
        <span class="lt-sm:hidden">Offline</span>
      </div>
    </Show>
  );
}

export default Offline;