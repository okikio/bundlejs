import type { ComponentProps } from "solid-js";
import { mergeProps, splitProps } from "solid-js";

export interface Props extends ComponentProps<"div"> {
  max?: string;
  class?: string;
}

export function Container(props: Props = {}) {
  const [newProps, attrs] = splitProps(props, ["max", "class", "children"]);
  const mergedProps = mergeProps({
    max: "md",
    class: "col"
  }, newProps);

  return (
    <div class={`contain ${mergedProps.max ?? "md"} ${mergedProps.class ?? "col"}`} custom-container {...attrs}>
      {mergedProps.children}
    </div>
  );
}

export default Container;