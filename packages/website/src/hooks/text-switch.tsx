import type { ComponentProps} from "solid-js";
import { createSignal, onCleanup, onMount } from "solid-js";

export type TextSwitchProps = [
  /**
   * The initial text value to switch from
   */
  initial: string,

  /**
   * The next text value to switch to
   */
  next: string
]

export function createTextSwitch([initial, next]: TextSwitchProps) {
  const [initialValue, setInitialValue] = createSignal(initial);
  const [nextValue, setNextValue] = createSignal(next);

  const refList = new Map<HTMLElement, null>();
  const refElList = new Map<HTMLElement, null>();

  let initialRef: HTMLElement = null;
  let nextRef: HTMLElement = null;
  let nextInitialRef: HTMLElement = null;

  return {
    getInitial: initialValue,
    setInitial: setInitialValue,

    getNext: nextValue,
    setNext: setNextValue,

    async switch(dir: "next" | "initial" = "next", delay = 100) {
      const arr = [];
      
      refList.forEach((_, ref) => {
        arr.push(
          ref.animate({
            transform: [
              `translateY(${dir == "next" ? 0 : -100}%)`,
              `translateY(${dir == "next" ? -100 : -200}%)`
            ]
          }, {
            duration: 500,
            easing: "ease",
            fill: "both",
            delay,
          }).finished
        );
      });
      await Promise.all(arr);
    },

    render(props?: ComponentProps<"span">) {
      let ref: HTMLElement = null;
      onMount(() => {
        refList.set(ref, null);

        refElList.set(initialRef, null);
        refElList.set(nextRef, null);
        refElList.set(nextInitialRef, null);
      });

      onCleanup(() => {
        refList.delete(ref);
      });
      
      return (
        <span custom-text-switch {...props}>
          <span class="text-switch-container" ref={ref}>
            <span class="text-value initial" ref={initialRef}>{initialValue()}</span>
            <span class="text-value next" ref={nextRef}>{nextValue()}</span>
            <span class="text-value next-initial" ref={nextInitialRef}>{initialValue()}</span>
          </span>
        </span>
      );
    }
  };
}

export default createTextSwitch;