import { ComponentProps, createSignal, splitProps } from "solid-js";

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
  let [initialValue, setInitialValue] = createSignal(initial);
  let [nextValue, setNextValue] = createSignal(next);

  let ref: HTMLSpanElement = null;

  return {
    getInitial: initialValue,
    setInitial: setInitialValue,

    getNext: nextValue,
    setNext: setNextValue,

    async switch(dir: "next" | "initial" = "next", delay = 100) {
      await ref.animate({
        transform: [
          `translateY(${dir == "next" ? 0 : -100}%)`,
          `translateY(${dir == "next" ? -100 : -200}%)`
        ]
      }, {
        duration: 500,
        easing: "ease",
        fill: "both",
        delay,
      }).finished;
    },

    render(props?: ComponentProps<"span">) {
      return (
        <span custom-text-switch {...props}>
          <span class="text-switch-container" ref={ref}>
            <span class="text-value initial">{initialValue()}</span>
            <span class="text-value next">{nextValue()}</span>
            <span class="text-value next-initial">{initialValue()}</span>
          </span>
        </span>
      );
    }
  };
}

export default createTextSwitch;