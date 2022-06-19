import { createSignal } from "solid-js";

export function createTextSwitch(initialValue: string) { 
  let [value, setValue] = createSignal(initialValue);
  let reset = () => setValue(initialValue);
  return {
    get: value,
    set: setValue,
    reset,
    delayReset: (delay = 600) => { 
      setTimeout(() => { 
        reset();
      }, delay);
    }
  };
}