import { onCleanup, onMount } from "solid-js";

// Based off of @suid/system/onMountWithCleaning
export function onMountWithCleaning(effect: () => () => void) {
    let lastCleanup: (() => void) | undefined;
    onCleanup(() => lastCleanup?.());
    onMount(() => {
      lastCleanup = effect();
    });
}
  
export default onMountWithCleaning;