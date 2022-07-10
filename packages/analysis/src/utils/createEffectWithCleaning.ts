import { createEffect, onCleanup } from "solid-js";

// Based off of @suid/system/createEffectWithCleaning
export function createEffectWithCleaning(effect: () => () => void) {
  let lastCleanup: (() => void) | undefined;
  onCleanup(() => lastCleanup?.());
  createEffect<(() => void) | undefined>((prevCleanup) => {
    if (prevCleanup) {
      lastCleanup = undefined;
      prevCleanup?.();
    }

    // @ts-ignore
    return (lastCleanup = effect());
  });
}

export default createEffectWithCleaning;