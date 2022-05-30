import type { ComponentProps } from "solid-js";
import { createSignal, onMount, Show } from "solid-js";
import OfflineIcon from "~icons/fluent/cloud-offline-24-regular";

export function Offline({ class: className }: ComponentProps<"div">) {
    let [isOnline, setIsOnline] = createSignal(true);
    onMount(() => {
        setIsOnline(navigator.onLine);
    
        globalThis.addEventListener("online", () => {
            setIsOnline(true);
        });
    
        globalThis.addEventListener("offline", () => {
            setIsOnline(false);
        });
    });

    return (
        // Show when Offline Icon when offline
        <Show when={!isOnline()}>
            <div class={className} title="You are offline" aria-label="You are offline">
                <OfflineIcon />
                <span>Offline</span>
            </div>
        </Show>
    );
}

export default Offline;