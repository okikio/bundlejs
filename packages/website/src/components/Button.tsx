import type { ComponentProps, ParentProps } from "solid-js";

import { mergeProps, splitProps } from "solid-js";

export function Button(props: ParentProps<ComponentProps<'button'>>) {
  let [newProps, attrs] = splitProps(props, ["type", "children"]);
  let mergedProps = mergeProps({ type: "button" }, newProps)

  return (
    <button type={mergedProps.type as "button" | "submit" | "reset"} custom-button {...attrs}>
      {mergedProps.children}
    </button>
  );
}

export default Button;